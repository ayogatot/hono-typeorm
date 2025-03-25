import { z } from 'zod'

export const createStoreValidator = z.object({
    name: z.string().min(3).max(30).nonempty(),
    type: z.enum(["BUILDING", "CAFE"]).default("BUILDING"),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
})

export const updateStoreValidator = z.object({
    name: z.string().min(3).max(30).nonempty().optional(),
    type: z.enum(["BUILDING", "CAFE"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}) 