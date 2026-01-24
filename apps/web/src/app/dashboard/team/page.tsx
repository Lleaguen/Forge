'use client'
import { Button } from '@/components/shared'
import { useRouter } from 'next/navigation'

export default function TeamPage() {
  const router = useRouter()

  const onContinue = () => {
    // acá después llamás a la API
    router.push('/dashboard/team/new')
  }
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-brand-text">
          Team
        </h1>
        <p className="text-sm text-slate-500 dark:text-brand-textMuted">
          Members with access to this workspace
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-brand-surface">
        <p className="text-slate-500 dark:text-brand-textMuted">
          No team members yet.
        </p>
      </div>
      <Button onClick={onContinue}
       className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-5 py-2.5 text-white hover:bg-brand-primaryHover"
        children="Continue →"/>
    </div>
  )
}
