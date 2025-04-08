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
import { TransactionItem } from "./TransactionItem";
import { CafeMenu } from "./CafeMenu";
import { CafeRecipes } from "./CafeRecipes";

@Entity("cafe_item_stocks")
export class CafeItemStock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CafeMenu, (cafeMenu) => cafeMenu.item_stocks)
  @JoinColumn({ name: "cafe_menu_id" })
  cafe_menu!: Relation<CafeMenu>;

  @ManyToOne(() => User, (user) => user.item_stocks)
  @JoinColumn({ name: "added_by_id" })
  added_by!: Relation<User>;

  @Column({ type: "int" })
  initial_quantity!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "double" })
  buying_price!: number;

  @Column({ type: "double" })
  sell_price!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.item_stock
  )
  transaction_items!: TransactionItem[];

  @OneToMany(
    () => CafeRecipes,
    (cafeRecipes) => cafeRecipes.cafe_item_stock
  )
  cafe_recipes!: CafeRecipes[];

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
