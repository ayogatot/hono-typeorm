import { z } from 'zod'

export const categoryValidator = z.object({
    name: z.string().min(3).max(30).nonempty()
})