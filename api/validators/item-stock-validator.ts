import { z } from 'zod'

export const createItemStockValidator = z.object({
    item: z.number().positive(),
    quantity: z.number().min(1).positive(),
    buying_price: z.number().min(0).positive(),
    sell_price: z.number().min(0).positive()
})

export const updateItemStockValidator = z.object({
    quantity: z.number().min(1).positive().optional(),
    buying_price: z.number().min(0).positive().optional(),
    sell_price: z.number().min(0).positive().optional()
}) 