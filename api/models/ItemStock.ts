import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { Item } from "./Item";
import { User } from "./User";
import { TransactionItem } from "./TransactionItem";

@Entity("item_stocks")
export class ItemStock {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Item, (item) => item.itemStocks)
  item!: Relation<Item>;

  @ManyToOne(() => User, (user) => user.itemStocks)
  addedBy!: Relation<User>;

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
    (transactionItem) => transactionItem.itemStock
  )
  transactionItems!: TransactionItem[];
}
