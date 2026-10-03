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
        {/* Sidebar fijo */}
        <aside className="flex-shrink-0">
          <AsideLayout />
        </aside>

        {/* Columna derecha: header + contenido + footer */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header fijo */}
          <div className="flex-shrink-0">
            <HeaderLayout />
          </div>

          {/* Contenido scrolleable */}
          <main className="flex-1 overflow-y-auto px-12 py-10">
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
