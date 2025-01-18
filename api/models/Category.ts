import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Item } from "./Item";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => Item, (item) => item.category)
  items!: Item[];
}
