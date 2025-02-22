import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
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

  @Column({ type: "integer" })
  quota!: number;

  @Column({ type: "double",  nullable: true  })
  discount_price!: number;

  @Column({ type: "double", nullable: true })
  discount_percentage!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.discount)
  transactions!: Transaction[];
}
