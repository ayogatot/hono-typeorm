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
import { Transaction } from "./Transaction";
import { Expense } from "./Expense";
import { User } from "./User";
import { Discount } from "./Discount";
import { CafeTransactions } from "./CafeTransactions";
  @Entity("Stores")
  export class Store {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar" })
    name!: string;
    
    @Column({ type: "enum", enum: ["BUILDING", "CAFE"], default: "BUILDING" })
    type!: "BUILDING" | "CAFE";

    @Column({ type: "enum", enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" })
    status!: "ACTIVE" | "INACTIVE";

    @Column({ type: "varchar", nullable: true })
    address!: string;

    @Column({ type: "varchar", nullable: true })
    phone_number!: string;

    @Column({ type: "varchar", nullable: true })
    email!: string;


  
    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
  
    @DeleteDateColumn({ type: "timestamp" })
    deleted_at!: Date;

    @OneToMany(() => Item, (item) => item.store)
    items!: Item[];

    @OneToMany(() => Transaction, (transaction) => transaction.store)
    transactions!: Transaction[];

    @OneToMany(() => CafeTransactions, (cafeTransaction) => cafeTransaction.store)
    cafe_transactions!: CafeTransactions[];

    @OneToMany(() => Expense, (expense) => expense.store)
    expenses!: Expense[];

    @OneToMany(() => User, (user) => user.store)
    users!: User[];
    
    @OneToMany(() => Discount, (discount) => discount.store)
    discounts!: Discount[];
  }
  