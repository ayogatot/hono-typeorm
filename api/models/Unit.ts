import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Item } from "./Item";

@Entity("units")
export class Unit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "enum", enum: ["BUILDING", "CAFE"], default: "BUILDING" }) 
  type!: "BUILDING" | "CAFE";

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => Item, (item) => item.unit)
  items!: Item[];

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
