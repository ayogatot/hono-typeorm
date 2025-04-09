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
import { CafeMenu } from "./CafeMenu";

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

  @ManyToOne(() => CafeMenu, (cafeMenu) => cafeMenu.cafe_recipes)
  @JoinColumn({ name: "cafe_menu_id" })
  cafe_menu!: Relation<CafeMenu>;

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
