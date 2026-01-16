import { Button, Input, FormCard, FormField } from '../../../shared/components/ui/index'
import { AuthHeader, AuthMain } from '../components/index'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginPage() {
  const { form, onSubmit } = useLoginForm()
  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  return (
  <div className="min-h-screen flex flex-col bg-white">
   <AuthHeader action={<Button to="/register" >Create an account</Button>}/>
   <AuthMain center={
      <FormCard title="Welcome back" description="Sign in to your Forge workspace" form={form} footer="© 2024 Forge Web Inc. All rights reserved." onSubmit={onSubmit}>
        <FormField label="Email Address" error={errors.email?.message}>
          <Input type="email" placeholder="john.doe@forge.com" hasError={!!errors.email} {...register('email')}/>
        </FormField>
        <FormField label="Password" action={ <Button to="/#" variant="ghost">Forgot password?</Button> }
          error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" hasError={!!errors.password} {...register('password')}/>
        </FormField>
      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        Sign in
      </Button>
    </FormCard>
  }
/>
  </div>
  )
}
