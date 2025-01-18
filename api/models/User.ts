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

  @Column({ type: "varchar" })
  role!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => ItemStock, (itemStock) => itemStock.addedBy)
  itemStocks!: ItemStock[];

  @OneToMany(() => Transaction, (transaction) => transaction.buyer)
  transactions!: Transaction[];
}
