import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { DashboardHomePage } from '../../features/dashboard/pages/DashboardHomePage'
import { ProjectsListPage } from '../../features/projects/pages/ProjectsListPage'
import { NewProjectPage } from '../../features/projects/pages/NewProjectPage'
import { ProjectDetailPage } from '../../features/projects/pages/ProjectDetailPage'
import { ProjectTasksPage } from '../../features/tasks/pages/ProjectTasksPage'
import { ProfilePage } from '../../features/profile/pages/ProfilePage'
import { OrganizationOnboardingPage } from '../../features/onboarding/pages/OrganizationOnboardingPage'
import { AuthGuard } from './guards'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/onboarding/organization',
    element: (
      <AuthGuard>
        <OrganizationOnboardingPage />
      </AuthGuard>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <DashboardHomePage />
      </AuthGuard>
    )
  },
  {
    path: '/dashboard/projects',
    element: (
      <AuthGuard>
        <ProjectsListPage />
      </AuthGuard>
    )
  },
  {
    path: '/dashboard/projects/new',
    element: (
      <AuthGuard>
        <NewProjectPage />
      </AuthGuard>
    )
  },
  {
    path: '/dashboard/projects/:id',
    element: (
      <AuthGuard>
        <ProjectDetailPage />
      </AuthGuard>
    )
  },
  {
    path: '/dashboard/projects/:id/tasks',
    element: (
      <AuthGuard>
        <ProjectTasksPage />
      </AuthGuard>
    )
  },
  {
    path: '/dashboard/profile',
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    )
  }
])
