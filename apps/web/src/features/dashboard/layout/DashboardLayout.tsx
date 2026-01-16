import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav>
        <Link to="/dashboard">Home</Link>
        <Link to="/dashboard/projects">Projects</Link>
        <Link to="/dashboard/profile">Profile</Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
