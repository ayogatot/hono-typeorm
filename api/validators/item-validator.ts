import { z } from 'zod'

export const createItemValidator = z.object({
    category: z.number().positive(),
    unit: z.number().positive(),
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(3).max(100).nonempty()
})

export const updateItemValidator = z.object({
    category: z.number().positive().optional(),
    unit: z.number().positive().optional(),
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(3).max(100).optional(),
    status: z.string().optional()
}) 