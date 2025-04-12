import { z } from 'zod'

export const createBankValidator = z.object({
    name: z.string().min(3).max(255).nonempty(),
    account_name: z.string().min(3).max(255).nonempty(),
    account_number: z.string().min(3).max(255).nonempty(),
})

export const updateBankValidator = z.object({
    name: z.string().min(3).max(255).nonempty(),
    account_name: z.string().min(3).max(255).nonempty(),
    account_number: z.string().min(3).max(255).nonempty(),
}) 