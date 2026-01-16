import { z } from 'zod'

export const organizationSchema = z.object({
  name: z.string().min(2)
})

export type OrganizationSchema = z.infer<typeof organizationSchema>
export const organizationOnboardingSchema = organizationSchema.extend({
  plan: z.enum(['free', 'pro', 'enterprise'])
})
export type OrganizationOnboardingSchema = z.infer<
  typeof organizationOnboardingSchema
>