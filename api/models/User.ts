import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  type Relation,
  JoinColumn,
} from "typeorm";

import { ItemStock } from "./ItemStock";
import { Transaction } from "./Transaction";
import { Expense } from "./Expense";
import { Store } from "./Store";
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

  @Column({ type: "enum", enum: ["SUPER_ADMIN", "ADMIN", "CASHIER", "USER"], default: "USER" })
  role!: "SUPER_ADMIN" | "ADMIN" | "CASHIER" | "USER";

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;

  @OneToMany(() => ItemStock, (itemStock) => itemStock.added_by)
  item_stocks!: ItemStock[];

  @OneToMany(() => Transaction, (transaction) => transaction.buyer)
  transactions!: Transaction[];

  @OneToMany(() => Expense, (expense) => expense.added_by)
  expenses!: Expense[];

  @ManyToOne(() => Store, (store) => store.users)
  @JoinColumn({ name: "store_id" })
  store!: Relation<Store>;  
}
