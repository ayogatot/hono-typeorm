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
import { CafeMenu } from "./CafeMenu";
import { CafeItem } from "./CafeItem";

@Entity("cafe_recipes")
export class CafeRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CafeMenu, (cafeMenu) => cafeMenu.cafe_recipes)
  @JoinColumn({ name: "cafe_menu_id" })
  cafe_menu!: Relation<CafeMenu>;

  @ManyToOne(() => CafeItem, (cafeItem) => cafeItem.cafe_recipe)
  @JoinColumn({ name: "cafe_item_id" })
  cafe_item!: Relation<CafeItem>;

  @Column({ type: "int" })
  used_quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
