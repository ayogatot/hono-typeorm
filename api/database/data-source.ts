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
import { TermPayment } from "../models/TermPayment";
dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: process.env.NODE_ENV === "dev",
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
    TermPayment,
  ],
  poolSize: 10,
  extra: {
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    waitForConnections: true,
    connectTimeout: 10000,
  }
});

setInterval(() => {
  console.log("Checking database connection...");
  AppDataSource.query("SELECT 1")
    .then(() => {
      console.log("Database connection is healthy");
    })
    .catch((error) => {
      console.error("Database connection error:", error);
    });
}, 30000); // Check every 30 seconds

export { AppDataSource };
