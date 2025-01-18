import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { Transaction } from "./Transaction";
import { ItemStock } from "./ItemStock";

@Entity("transaction_items")
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionItems)
  transaction!: Relation<Transaction>;

  @ManyToOne(() => ItemStock, (itemStock) => itemStock.transactionItems)
  itemStock!: Relation<ItemStock>;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "double" })
  total_price!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
