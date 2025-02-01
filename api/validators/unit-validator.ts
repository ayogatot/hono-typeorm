import { z } from 'zod'

export const createUnitValidator = z.object({
    name: z.string().min(3).max(30).nonempty()
})

export const updateUnitValidator = z.object({
    name: z.string().min(3).max(30).nonempty()
}) 