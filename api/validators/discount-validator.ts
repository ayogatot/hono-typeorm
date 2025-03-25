import { z } from 'zod'

export const createDiscountValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    code: z.string().min(3).max(20).nonempty(),
    quota: z.number().min(0).positive(),
    discount_price: z.number().min(0).positive().optional(),
    discount_percentage: z.number().min(0).max(100).optional(),
    store_id: z.number()
})

export const updateDiscountValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    code: z.string().min(3).max(20).nonempty(),
    quota: z.number().min(0).positive(),
    discount_price: z.number().min(0).positive().optional(),
    discount_percentage: z.number().min(0).max(100).optional(),
    store_id: z.number().optional()
}) 