import { z } from 'zod'

export const createItemValidator = z.object({
    category: z.number().positive(),
    unit: z.number().positive(),
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(3).max(100).nonempty(),
    selling_price: z.number().positive(),
    image: z.string().optional()
})

export const updateItemValidator = z.object({
    category: z.number().positive().optional(),
    unit: z.number().positive().optional(),
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(3).max(100).optional(),
    status: z.string().optional(),
    selling_price: z.number().positive().optional(),
    image: z.string().optional()
}) 