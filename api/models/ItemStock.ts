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
} from "typeorm";
import { Item } from "./Item";
import { User } from "./User";
import { TransactionItem } from "./TransactionItem";

@Entity("item_stocks")
export class ItemStock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Item, (item) => item.item_stocks)
  @JoinColumn({ name: "item_id" })
  item!: Relation<Item>;

  @ManyToOne(() => User, (user) => user.item_stocks)
  @JoinColumn({ name: "added_by_id" })
  added_by!: Relation<User>;

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
}
