import { z } from 'zod'

// Esquema de Login
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),  // Validación del email
  password: z.string().min(6, 'Password should be at least 6 characters')  // Validación de la contraseña
})

// Esquema de Register (basado en LoginSchema)
export const RegisterSchema = LoginSchema.extend({
  confirmPassword: z.string().min(6, 'Password should be at least 6 characters')  // Validación de la confirmación de la contraseña
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',  // Mensaje de error si las contraseñas no coinciden
})

// Tipos inferidos de los esquemas
export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
