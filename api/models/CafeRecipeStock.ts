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
import { CafeRecipes } from "./CafeRecipes";

@Entity("cafe_recipe_stocks")
export class CafeRecipeStock {
  @PrimaryGeneratedColumn()
  id!: number;

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
    () => CafeRecipes,
    (cafeRecipes) => cafeRecipes.cafe_recipe_stock
  )
  cafe_recipes!: CafeRecipes[];

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
