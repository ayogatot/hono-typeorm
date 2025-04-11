import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  type Relation,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User";
import { Discount } from "./Discount";
import { PaymentMethod } from "./PaymentMethod";
import { TransactionItem } from "./TransactionItem";
import { Store } from "./Store";
import { CafeTransactionsMenus } from "./CafeTransactionsMenu";

@Entity("cafe_transactions")
export class CafeTransactions {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "buyer_id" })
  buyer!: Relation<User>;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "cashier_id" })
  cashier!: Relation<User>;

  @ManyToOne(() => Discount, (discount) => discount.transactions)
  @JoinColumn({ name: "discount_id" })
  discount!: Relation<Discount>;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.transactions)
  @JoinColumn({ name: "payment_method_id" })
  payment_method!: Relation<PaymentMethod>;

  @Column({ type: "double" })
  total!: number;

  @Column({ type: "double" })
  subtotal!: number;

  @Column({ type: "varchar", nullable: true })
  image?: string;

  @Column({ type: "varchar", nullable: true })
  name?: string;

  @Column({ type: "varchar", nullable: true })
  address?: string;

  @Column({ type: "varchar", nullable: true })
  phone_number?: string;

  @Column({ type: "integer", nullable: true })
  term_count?: number;

  @Column({ type: "date", nullable: true })
  term_deadline?: Date;

  @Column({ type: "enum", enum: ["PAID", "NOT_PAID"] })
  status!: "PAID" | "NOT_PAID";

  @Column({ type: "json" })
  notes?: JSON;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;

  @OneToMany(
    () => CafeTransactionsMenus,
    (cafeTransactionsMenus) => cafeTransactionsMenus.cafe_transaction
  )
  cafe_transactions_menus!: CafeTransactionsMenus[];

  @ManyToOne(() => Store, (store) => store.cafe_transactions)
  @JoinColumn({ name: "store_id" })
  store!: Relation<Store>;
}
