import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Category } from "../models/Category";
import { Discount } from "../models/Discount";
import { Expense } from "../models/Expense";
import { Item } from "../models/Item";
import { ItemStock } from "../models/ItemStock";
import { PaymentMethod } from "../models/PaymentMethod";
import { Transaction } from "../models/Transaction";
import { TransactionItem } from "../models/TransactionItem";
import { User } from "../models/User";
import { Unit } from "../models/Unit";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [
    Category,
    Discount,
    Expense,
    Item,
    ItemStock,
    PaymentMethod,
    Transaction,
    TransactionItem,
    Unit,
    User,
  ],
});
