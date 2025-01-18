import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import { Category } from "./Category";
import { Unit } from "./Unit";
import { ItemStock } from "./ItemStock";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Category, (category) => category.items)
  category!: Relation<Category>;

  @ManyToOne(() => Unit, (unit) => unit.items)
  unit!: Unit;

  @Column({ type: "varchar" })
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
  itemStocks!: ItemStock[];
}
