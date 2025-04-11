import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  type Relation,
  JoinColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Store } from "./Store";
import { CafeRecipe } from "./CafeRecipe";
import { CafeTransactionsMenus } from "./CafeTransactionsMenu";

@Entity("cafe_menus")
export class CafeMenu {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  image!: string;

  @Column({ type: "double" })
  selling_price!: number;

  @Column({
    type: "enum",
    enum: ["AVAILABLE", "OUT_OF_STOCK"],
    default: "AVAILABLE",
  })
  status!: string;

  @Column({ type: "enum", enum: ["DRINK", "FOOD"], default: "DRINK" })
  type!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;

  @ManyToOne(() => Store, (store) => store.items)
  @JoinColumn({ name: "store_id" })
  store!: Relation<Store>;

  @OneToMany(() => CafeRecipe, (cafeRecipe) => cafeRecipe.cafe_menu)
  cafe_recipes!: CafeRecipe[];

  @OneToMany(
    () => CafeTransactionsMenus,
    (cafeTransactionsMenus) => cafeTransactionsMenus.cafe_menu
  )
  cafe_transactions_menus!: CafeTransactionsMenus[];
}
