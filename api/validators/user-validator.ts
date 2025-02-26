import { z } from 'zod'

export const registerValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().min(6).max(100).nonempty(),
    role: z.enum(["ADMIN", "CASHIER", "USER"]).default("USER")
})

export const loginValidator = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(6).max(100).nonempty()
})

export const updatePasswordValidator = z.object({
    old_password: z.string().min(6).max(100).nonempty(),
    new_password: z.string().min(6).max(100).nonempty()
})

export const updateProfileValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    email: z.string().email().nonempty()
})

export const updateUserValidator = z.object({
    name: z.string().min(3).max(50).nonempty(),
    email: z.string().email().nonempty(),
    role: z.enum(["ADMIN", "CASHIER", "USER"]).optional()
})

export const getAllUsersValidator = z.object({
    role: z.enum(["ADMIN", "CASHIER", "USER"]).optional()
})

export const adminUpdatePasswordValidator = z.object({
    new_password: z.string().min(6).max(100).nonempty()
}) 