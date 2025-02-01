import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import { ItemStock } from "./ItemStock";
import { Transaction } from "./Transaction";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "enum", enum: ["ADMIN", "CASHIER", "USER"], default: "USER" })
  role!: "ADMIN" | "CASHIER" | "USER";

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => ItemStock, (itemStock) => itemStock.added_by)
  item_stocks!: ItemStock[];

  @OneToMany(() => Transaction, (transaction) => transaction.buyer)
  transactions!: Transaction[];
}
