import { z } from 'zod'

const recipeValidator = z.object({
  cafe_item_id: z.number().positive(),
  used_quantity: z.number().positive()
})

export const createCafeMenuValidator = z.object({
    name: z.string().min(3).max(100).nonempty(),
    image: z.string().optional(),
    selling_price: z.number().positive(),
    status: z.enum(["AVAILABLE", "OUT_OF_STOCK"]).optional(),
    type: z.enum(["DRINK", "FOOD"]).optional(),
    store_id: z.number(),
    recipes: z.array(recipeValidator).min(1)
})

export const updateCafeMenuValidator = z.object({
    name: z.string().min(3).max(100).optional(),
    image: z.string().optional(),
    status: z.enum(["AVAILABLE", "OUT_OF_STOCK"]).optional(),
    type: z.enum(["DRINK", "FOOD"]).optional(),
    selling_price: z.number().positive().optional(),
    store_id: z.number().optional(),
    recipes: z.array(recipeValidator).optional()
}) 