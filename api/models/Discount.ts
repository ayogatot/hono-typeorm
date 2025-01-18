import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Transaction } from "./Transaction";

@Entity("discounts")
export class Discount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  code!: string;

  @Column({ type: "double" })
  discount_price!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.discount)
  transactions!: Transaction[];
}
