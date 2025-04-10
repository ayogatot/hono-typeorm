import { z } from 'zod'

export const createCafeItemStockValidator = z.object({
    cafe_item_id: z.number().positive(),
    added_by_id: z.number().positive(),
    initial_quantity: z.number().positive(),
    quantity: z.number().positive(),
    buying_price: z.number().positive().optional(),
    sell_price: z.number().positive().optional()
})

export const updateCafeItemStockValidator = z.object({
    initial_quantity: z.number().positive().optional(),
    quantity: z.number().positive().optional(),
    buying_price: z.number().positive().optional(),
    sell_price: z.number().positive().optional(),  
    added_by_id: z.number().positive().optional()
}) 