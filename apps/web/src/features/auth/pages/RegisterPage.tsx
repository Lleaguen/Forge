import { Button, Input, FormCard, FormField } from '../../../shared/components/ui/index'
import { AuthHeader, AuthMain } from '../components/index'
import { useRegisterForm } from '../hooks/useRegisterForm'

export function RegisterPage() {
  const { form, onSubmit } = useRegisterForm()
  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthHeader action={<Button to="/login" >Sign in</Button>}/>
      <AuthMain center={
        <FormCard title="Create your account" description="Join your Forge workspace" form={form} footer="© 2024 Forge Web Inc. All rights reserved." onSubmit={onSubmit}>
          <FormField label="Email Address" error={errors.email?.message}>
            <Input type="email" placeholder="Enter your email address" {...register('email')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="Enter your password" {...register('password')} />
          </FormField>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Register</Button>
        </FormCard>
      }/>
    </div>
  )
}