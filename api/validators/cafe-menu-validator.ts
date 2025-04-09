import { z } from 'zod'

export const createCafeMenuValidator = z.object({
    name: z.string().min(3).max(100).nonempty(),
    image: z.string().optional(),
    selling_price: z.number().positive(),
    status: z.enum(["AVAILABLE", "OUT_OF_STOCK"]).optional(),
    type: z.enum(["DRINK", "FOOD"]).optional(),
    store_id: z.number()
})

export const updateCafeMenuValidator = z.object({
    name: z.string().min(3).max(100).optional(),
    image: z.string().optional(),
    status: z.enum(["AVAILABLE", "OUT_OF_STOCK"]).optional(),
    type: z.enum(["DRINK", "FOOD"]).optional(),
    selling_price: z.number().positive().optional(),
    store_id: z.number()
}) 