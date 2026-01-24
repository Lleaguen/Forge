'use client';
import {useLoginForm} from "../hooks/useLoginForm";
import { Footer, Main } from "../../components/layout/index";
import HeaderForm from "../../components/ui/Head-Form";
import FormCard from "./components/FormCard";
import {FormField} from "./components/FormField";
import { Input, Button, } from "../../components/shared/index";
import SocialAuth from "@/components/shared/SocialAtuh";

export default function LoginPage() {
  const { form, onSubmit } = useLoginForm()
  const {
    register,
    formState: { errors, isSubmitting }
  } = form
  return (
    <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-brand-bg dark:to-brand-surface">
      <HeaderForm  className="items-center-safe" action={<Button href="/register" children="Create an account"/>}/>
      <Main bottom={<Footer />}
      children={
      <FormCard title="Welcome back" description="Sign in to your Forge workspace" form={form} footer="© 2024 Forge Web Inc. All rights reserved." onSubmit={onSubmit}>
        <FormField label="Email Address" error={errors.email?.message}>
          <Input type="email" placeholder="john.doe@forge.com" hasError={!!errors.email} {...register('email')}/>
        </FormField>
        <FormField label="Password" action={ <Button href="/#" variant="ghost">Forgot password?</Button> }
          error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" hasError={!!errors.password} {...register('password')}/>
        </FormField>
      <Button type="submit" variant="primary" isLoading={isSubmitting}>Sing In</Button>
      <SocialAuth />
      </FormCard>
      }
      />
    </div>
  );
}