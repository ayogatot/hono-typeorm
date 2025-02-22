import { z } from 'zod'

export const createTermPaymentValidator = z.object({
    transaction_id: z.number().positive(),
    amount: z.number().min(0).positive(),
    image: z.string().optional()
})

export const updateTermPaymentValidator = z.object({
    amount: z.number().min(0).positive(),
    image: z.string().optional()
}) 