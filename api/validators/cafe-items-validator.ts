import { z } from 'zod'

export const createCafeItemValidator = z.object({
    cafe_menu_id: z.number().positive(),
    unit_id: z.number().positive(),
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(3).max(100).nonempty(),
    total_quantity: z.number().positive().optional()
})

export const updateCafeItemValidator = z.object({
    cafe_menu_id: z.number().positive().optional(),
    unit_id: z.number().positive().optional(),
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(3).max(100).optional(),
    total_quantity: z.number().positive().optional()
}) 