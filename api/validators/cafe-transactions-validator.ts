import { z } from 'zod'

const menuItemValidator = z.object({
  cafe_menu_id: z.number().positive(),
  quantity: z.number().positive(),
  total_price: z.number().positive()
})

export const createCafeTransactionValidator = z.object({
  buyer_id: z.number().positive().optional(),
  discount_id: z.number().positive().optional(),
  payment_method_id: z.number().positive(),
  store_id: z.number().positive(),
  image: z.string().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  term_count: z.number().positive().optional(),
  term_deadline: z.string().optional(),
  status: z.enum(["PAID", "NOT_PAID"]).default("PAID"),
  notes: z.any().optional(),
  menus: z.array(menuItemValidator).min(1)
})

export const updateCafeTransactionValidator = z.object({
  buyer_id: z.number().positive().optional(),
  cashier_id: z.number().positive().optional(),
  discount_id: z.number().positive().optional(),
  payment_method_id: z.number().positive().optional(),
  store_id: z.number().positive().optional(),
  image: z.string().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  term_count: z.number().positive().optional(),
  term_deadline: z.string().optional(),
  status: z.enum(["PAID", "NOT_PAID"]).optional(),
  notes: z.any().optional(),
  menus: z.array(menuItemValidator).optional()
}) 