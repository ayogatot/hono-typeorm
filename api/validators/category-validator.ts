import { z } from 'zod'

export const createCategoryValidator = z.object({
    name: z.string().min(3).max(30).nonempty(),
    type: z.enum(["BUILDING", "CAFE"]).default("BUILDING")
})

export const updateCategoryValidator = z.object({
    name: z.string().min(3).max(30).nonempty(),
    type: z.enum(["BUILDING", "CAFE"]).optional()
})