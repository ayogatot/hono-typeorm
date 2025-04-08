import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    type Relation,
    UpdateDateColumn,
    DeleteDateColumn,
  } from "typeorm";
  import { CafeMenu } from "./CafeMenu";
  import { CafeItemStock } from "./CafeItemStock";
  import { Unit } from "./Unit";

  @Entity("cafe_recipes")
  export class CafeRecipes {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => CafeMenu, (cafeMenu) => cafeMenu.cafe_recipes)
    @JoinColumn({ name: "cafe_menu_id" })
    cafe_menu!: Relation<CafeMenu>;

    @ManyToOne(() => Unit, (unit) => unit.items)
    @JoinColumn({ name: "unit_id" })
    unit!: Relation<Unit>;

    @ManyToOne(() => CafeItemStock, (cafeItemStock) => cafeItemStock.cafe_recipes)
    @JoinColumn({ name: "cafe_item_stock_id" })
    cafe_item_stock!: Relation<CafeItemStock>;

    @Column({ type: "varchar", nullable: true, unique: true })
    code!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "int" })
    total_quantity!: number;
  
    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
  
    @DeleteDateColumn({ type: "timestamp" })
    deleted_at!: Date;
  }
  