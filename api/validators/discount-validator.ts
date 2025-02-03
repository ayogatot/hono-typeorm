import { z } from 'zod'

export const createDiscountValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    code: z.string().min(3).max(20).nonempty(),
    quota: z.number().min(0).positive(),
    discount_price: z.number().min(0).positive()
})

export const updateDiscountValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    code: z.string().min(3).max(20).nonempty(),
    quota: z.number().min(0).positive(),
    discount_price: z.number().min(0).positive()
}) 