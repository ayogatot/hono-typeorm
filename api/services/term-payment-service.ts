import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { TermPayment } from "../models/TermPayment";
import { Transaction } from "../models/Transaction";

export class TermPaymentService {
  private termPaymentRepository = AppDataSource.getRepository(TermPayment);
  private transactionRepository = AppDataSource.getRepository(Transaction);

  async createTermPayment(termPaymentData: Partial<TermPayment>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the term payment
      const termPayment = this.termPaymentRepository.create({
        ...termPaymentData,
        // @ts-ignore
        transaction: { id: termPaymentData.transaction_id },
      });
      await queryRunner.manager.save(termPayment);

      // Get the transaction
      const transaction = await this.transactionRepository.findOne({
        where: {
          // @ts-ignore
          id: termPaymentData.transaction_id,
          status: "NOT_PAID",
          payment_method: { id: 1 }, // 1: Kasbon
        },
        relations: ["term_payments"],
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Calculate total paid amount
      const totalPaid = transaction.term_payments
        ? transaction.term_payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          ) + termPayment.amount
        : termPayment.amount;

      // If total paid equals or exceeds total, mark transaction as PAID
      if (totalPaid >= transaction.total) {
        transaction.status = "PAID";
        termPayment.transaction = transaction;

        await queryRunner.manager.save(transaction);
        await queryRunner.manager.save(termPayment);
      }

      await queryRunner.commitTransaction();
      return termPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTermPayments(query: any) {
    const {
      page = 1,
      limit = 10,
      transactionId,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = query;

    const whereClause = transactionId
      ? { transaction: { id: transactionId } }
      : {};

    const [termPayments, total] = await this.termPaymentRepository.findAndCount(
      {
        where: whereClause,
        order: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
        relations: {
          transaction: true,
        },
      }
    );

    return {
      data: termPayments,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  async getTermPaymentById(id: number) {
    const termPayment = await this.termPaymentRepository.findOne({
      where: { id },
      relations: ["transaction"],
    });

    if (!termPayment) {
      throw new Error("Term payment not found");
    }

    return termPayment;
  }

  async updateTermPayment(id: number, termPaymentData: Partial<TermPayment>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const termPayment = await this.getTermPaymentById(id);

      // Update the term payment
      await queryRunner.manager.update(TermPayment, id, termPaymentData);

      // Get the transaction and recalculate total paid
      const transaction = await this.transactionRepository.findOne({
        where: { id: termPayment.transaction.id },
        relations: ["term_payments"],
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      const totalPaid = transaction.term_payments!.reduce((sum, payment) => {
        return (
          sum +
          // @ts-ignore
          (payment.id === id ? termPaymentData.amount : payment.amount)
        );
      }, 0);

      // Update transaction status based on total paid
      if (totalPaid >= transaction.total) {
        transaction.status = "PAID";
      } else {
        transaction.status = "NOT_PAID";
      }

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return this.getTermPaymentById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteTermPayment(id: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const termPayment = await this.getTermPaymentById(id);

      // Soft delete the term payment
      await queryRunner.manager.softDelete(TermPayment, id);

      // Get the transaction and recalculate total paid
      const transaction = await this.transactionRepository.findOne({
        where: { id: termPayment.transaction.id },
        relations: ["term_payments"],
      });

      if (!transaction || !transaction.term_payments) {
        throw new Error("Transaction not found");
      }

      const totalPaid = transaction.term_payments
        .filter((payment) => payment.id !== id)
        .reduce((sum, payment) => sum + payment.amount, 0);

      // Update transaction status based on total paid
      if (totalPaid < transaction.total) {
        transaction.status = "NOT_PAID";
        await queryRunner.manager.save(transaction);
      }

      await queryRunner.commitTransaction();
      return { message: "Term payment deleted successfully" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
