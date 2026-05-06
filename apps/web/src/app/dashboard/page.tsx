'use client'

import DashboardHeader from './components/DashboardHeader'
import StatCard from './components/StatCard'
import ProjectList from './components/ProjectList'
import { useDashboardStats, useActivities } from '@/app/hooks/useActivity'
import { LoadingState } from '@/components/states/LoadingState'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: activities, isLoading: activitiesLoading } = useActivities()

  return (
    <section className="space-y-10">
      {/* Header interno del dashboard */}
      <DashboardHeader />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
            ))}
          </>
        ) : (
          <>
            <StatCard title="Active Projects" value={stats?.activeProjects?.toString() || '0'} />
            <StatCard title="Pending Tasks" value={stats?.pendingTasks?.toString() || '0'} />
            <StatCard title="Team Members" value={stats?.teamMembers?.toString() || '0'} />
            <StatCard title="Activity Today" value={stats?.activityToday?.toString() || '0'} />
          </>
        )}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Projects */}
        <div className="xl:col-span-8">
          <ProjectList />
        </div>

        {/* Activity Feed */}
        <aside
          className="
            xl:col-span-4
            rounded-2xl
            border border-slate-200
            bg-white
            p-6
            shadow-sm
            dark:border-white/10
            dark:bg-brand-surface
          "
        >
          <h3 className="font-semibold text-slate-800 dark:text-brand-text">
            Activity Feed
          </h3>

          {activitiesLoading ? (
            <div className="mt-4">
              <LoadingState message="Loading activities..." />
            </div>
          ) : Array.isArray(activities) && activities.length > 0 ? (
            <div className="mt-4 space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="text-sm">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{activity.user?.fullName || 'Unknown User'}</span>{' '}
                    {activity.action}{' '}
                    <span className="text-brand-primary">{activity.highlight}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-brand-textMuted">
              No recent activity.
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}
