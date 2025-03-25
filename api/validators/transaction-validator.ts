import { z } from 'zod'

const transactionItemSchema = z.object({
    item: z.number().positive(),
    quantity: z.number().positive(),
})

export const createTransactionValidator = z.object({
    payment_method: z.number().positive(),
    discount: z.number().positive().optional(),
    name: z.string().min(3).max(100).optional(),
    address: z.string().min(3).max(255).optional(),
    phone_number: z.string().min(8).max(15).optional(),
    term_count: z.number().positive().optional(),
    term_deadline: z.string().optional(), // Date will be parsed in service
    notes: z.record(z.string()).optional(),
    items: z.array(transactionItemSchema).min(1),
    image: z.string().optional(),
    store_id: z.number()
})

export const updateTransactionValidator = z.object({
    payment_method: z.number().positive().optional(),
    discount: z.number().positive().optional(),
    name: z.string().min(3).max(100).optional(),
    address: z.string().min(3).max(255).optional(),
    phone_number: z.string().min(8).max(15).optional(),
    term_count: z.number().positive().optional(),
    term_deadline: z.string().optional(),
    notes: z.record(z.string()).optional(),
    status: z.enum(["PAID", "NOT_PAID"]).optional(),
    image: z.string().optional(),
    store_id: z.number()
}) 