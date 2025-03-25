import { z } from 'zod'

export const createExpenseValidator = z.object({
    price: z.number().min(0).positive(),
    note: z.string().min(3).max(255).nonempty(),
    store_id: z.number()
})

export const updateExpenseValidator = z.object({
    price: z.number().min(0).positive(),
    note: z.string().min(3).max(255).nonempty(),
    store_id: z.number()
}) 