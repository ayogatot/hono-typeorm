import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    type Relation,
    JoinColumn,
    DeleteDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Unit } from "./Unit";
  import { CafeItemStock } from "./CafeItemStock";
  import { Store } from "./Store";
import { CafeRecipes } from "./CafeRecipes";
  
  @Entity("cafe_menus")
  export class CafeMenu {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar" })
    name!: string;
  
    @Column({ type: "varchar", nullable: true })
    image!: string;
  
    @Column({ type: "double" })
    selling_price!: number;
  
    @Column({ type: "enum", enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" })
    status!: string;

    @Column({ type: "enum", enum: ["DRINK", "FOOD"], default: "DRINK" })
    type!: string;
  
    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
  
    @DeleteDateColumn({ type: "timestamp" })
    deleted_at!: Date;
  
    @OneToMany(() => CafeItemStock, (cafeItemStock) => cafeItemStock.cafe_menu)
    item_stocks!: CafeItemStock[];
  
    @ManyToOne(() => Store, (store) => store.items)
    @JoinColumn({ name: "store_id" })
    store!: Relation<Store>;

    @OneToMany(() => CafeRecipes, (cafeRecipes) => cafeRecipes.cafe_menu)
    cafe_recipes!: CafeRecipes[];
  }
  