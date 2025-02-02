import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { Transaction } from "./Transaction";
import { ItemStock } from "./ItemStock";

@Entity("transaction_items")
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.transaction_items)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Relation<Transaction>;

  @ManyToOne(() => ItemStock, (itemStock) => itemStock.transaction_items)
  @JoinColumn({ name: "item_stock_id" })
  item_stock!: Relation<ItemStock>;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "double" })
  total_price!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
