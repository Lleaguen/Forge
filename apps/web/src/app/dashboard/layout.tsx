'use client'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import HeaderLayout from '../../components/layout/head'
import AsideLayout from '../../components/layout/siderbar'
import { Breadcrumb } from '@/components/shared'
import { AuthGuard } from '../components/AuthGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-gradient-to-b dark:from-brand-bg dark:to-brand-surface ">
        <AsideLayout />
        <ThemeToggle/>
        <div className="flex flex-1 flex-col">
          <HeaderLayout />
          <main className="flex-1 px-12 py-10">
          <Breadcrumb/>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
