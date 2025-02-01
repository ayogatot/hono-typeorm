import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  type Relation,
  JoinColumn,
} from "typeorm";
import { Category } from "./Category";
import { Unit } from "./Unit";
import { ItemStock } from "./ItemStock";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Category, (category) => category.items)
  @JoinColumn({ name: "category_id" })
  category!: Relation<Category>;

  @ManyToOne(() => Unit, (unit) => unit.items)
  @JoinColumn({ name: "unit_id" })
  unit!: Relation<Unit>;

  @Column({ type: "varchar", nullable: true })
  code!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "int" })
  total_quantity!: number;

  @Column({ type: "varchar" })
  status!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @OneToMany(() => ItemStock, (itemStock) => itemStock.item)
  item_stocks!: ItemStock[];
}
