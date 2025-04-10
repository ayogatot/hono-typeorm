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
    OneToMany,
  } from "typeorm";
  import { CafeRecipe } from "./CafeRecipe";
  import { CafeItemStock } from "./CafeItemStock";
  import { Unit } from "./Unit";

  @Entity("cafe_items")
  export class CafeItem {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => CafeRecipe, (cafeRecipe) => cafeRecipe.cafe_item)
    @JoinColumn({ name: "cafe_recipe_id" })
    cafe_recipe!: Relation<CafeRecipe>;

    @ManyToOne(() => Unit, (unit) => unit.items)
    @JoinColumn({ name: "unit_id" })
    unit!: Relation<Unit>;

    @Column({ type: "varchar", nullable: true, unique: true })
    code!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "int", nullable: true })
    total_quantity!: number;
  
    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
  
    @DeleteDateColumn({ type: "timestamp" })
    deleted_at!: Date;
    
    @OneToMany(() => CafeItemStock, (cafeItemStock) => cafeItemStock.cafe_items)
    cafe_item_stocks!: CafeItemStock[];
  }
  