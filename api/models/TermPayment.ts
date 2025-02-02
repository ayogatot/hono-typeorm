import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Transaction } from "./Transaction";

@Entity("term_payment")
export class TermPayment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.term_payments)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Relation<Transaction>;

  @Column({ type: "double" })
  amount!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
