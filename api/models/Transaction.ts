import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { User } from "./User";
import { Discount } from "./Discount";
import { PaymentMethod } from "./PaymentMethod";
import { TransactionItem } from "./TransactionItem";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.transactions)
  buyer!: Relation<User>;

  @ManyToOne(() => User, (user) => user.transactions)
  cashier!: Relation<User>;

  @ManyToOne(() => Discount, (discount) => discount.transactions)
  discount!: Relation<Discount>;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.transactions)
  paymentMethod!:  Relation<PaymentMethod>;

  @Column({ type: "double" })
  total!: number;

  @Column({ type: "double" })
  subtotal!: number;

  @Column({ type: "enum", enum: ["PAID", "NOT_PAID"] })
  status!: "PAID" | "NOT_PAID";

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction
  )
  transactionItems!: TransactionItem[];
}
