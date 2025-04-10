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
import { CafeItem } from "./CafeItem";

@Entity("cafe_item_stocks")
export class CafeItemStock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.item_stocks)
  @JoinColumn({ name: "added_by_id" })
  added_by!: Relation<User>;

  @ManyToOne(() => CafeItem, (cafeItem) => cafeItem.cafe_item_stocks)
  @JoinColumn({ name: "cafe_item_id" })
  cafe_items!: Relation<CafeItem>;

  @Column({ type: "int" })
  initial_quantity!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "double", nullable: true })
  buying_price!: number;

  @Column({ type: "double", nullable: true })
  sell_price!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
