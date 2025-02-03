import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  type Relation,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("expenses")
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "double" })
  price!: number;

  @Column({ type: "varchar" })
  note!: string;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: "added_by_id" })
  added_by!: Relation<User>;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;
}
