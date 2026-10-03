'use client'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import HeaderLayout from '../../components/layout/head'
import AsideLayout from '../../components/layout/siderbar'
import Footer from '../../components/layout/footer'
import { Breadcrumb } from '@/components/shared'
import { AuthGuard } from '../components/AuthGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen overflow-hidden bg-brand-light-bg dark:bg-gradient-to-b dark:from-brand-bg dark:to-brand-surface">

        {/* Sidebar — fijo, oculto en mobile (se muestra como drawer) */}
        <AsideLayout />

        {/* Columna derecha */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">

          {/* Header fijo */}
          <HeaderLayout />

          {/* Contenido scrolleable */}
          <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8">
            <Breadcrumb />
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>

        <ThemeToggle />
      </div>
    </AuthGuard>
  )
}
