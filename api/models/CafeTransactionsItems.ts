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
import { CafeTransactions } from "./CafeTransactions";
import { CafeItemStock } from "./CafeItemStock";

@Entity("cafe_transactions_items")
export class CafeTransactionsItems {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => CafeTransactions,
    (cafeTransaction) => cafeTransaction.cafe_transactions_items
  )
  @JoinColumn({ name: "cafe_transaction_id" })
  cafe_transaction!: Relation<CafeTransactions>;

  @ManyToOne(() => CafeItemStock, (cafeItemStock) => cafeItemStock.cafe_recipes)
  @JoinColumn({ name: "cafe_item_stock_id" })
  cafe_item_stock!: Relation<CafeItemStock>;

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
