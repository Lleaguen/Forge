import { Button, Input, FormCard, FormField } from '../../../shared/components/ui/index'
import { AuthHeader, AuthMain } from '../components/index'
import { useLoginForm } from '../hooks/useLoginForm'
import { AiOutlineGoogle, AiOutlineGithub } from 'react-icons/ai'

export function LoginPage() {
  const { form, onSubmit } = useLoginForm()
  const {
    register,
    formState: { errors, isSubmitting }
  } = form

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-white">
   <AuthHeader action={<Button to="/register" >Create an account</Button>}/>
   <AuthMain children={
      <FormCard title="Welcome back" description="Sign in to your Forge workspace" form={form} footer="© 2024 Forge Web Inc. All rights reserved." onSubmit={onSubmit}>
        <FormField label="Email Address" error={errors.email?.message}>
          <Input type="email" placeholder="john.doe@forge.com" hasError={!!errors.email} {...register('email')}/>
        </FormField>
        <FormField label="Password" action={ <Button to="/#" variant="ghost">Forgot password?</Button> }
          error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" hasError={!!errors.password} {...register('password')}/>
        </FormField>
      <Button type="submit" variant="primary" isLoading={isSubmitting}>Sing In</Button>
      <div className="flex items-center gap-4 my-6">
            <span className="h-px flex-1 bg-emerald-100" />
            <span className="text-xs text-emerald-700 font-medium">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-emerald-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <AiOutlineGoogle />
              Google
            </Button>
            <Button variant="outline">
              <AiOutlineGithub />
              GitHub
            </Button>
          </div>
    </FormCard>
  }
/>
  </div>
  )
}
