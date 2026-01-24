'use client'

import { FiBell, FiChevronRight } from 'react-icons/fi'
import { useActivities } from '@/app/hooks/useActivity'
import { LoadingState } from '@/components/states/LoadingState'
import { EmptyState } from '@/components/states/EmptyState'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  projectId?: string
}

export default function ProjectActivity({ projectId }: Props) {
  const { data: activities, isLoading } = useActivities(projectId)

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <LoadingState message="Loading activities..." />
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-secondary p-2 text-brand-primary">
              <FiBell size={16} />
            </div>
            <div>
              <h4 className="font-medium">Recent Updates</h4>
              <p className="text-xs text-slate-400">
                Last 24 hours activity from your team
              </p>
            </div>
          </div>
        </div>
        <EmptyState message="No recent activity" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-brand-secondary p-2 text-brand-primary">
            <FiBell size={16} />
          </div>
          <div>
            <h4 className="font-medium">Recent Updates</h4>
            <p className="text-xs text-slate-400">
              Last 24 hours activity from your team
            </p>
          </div>
        </div>

        <button className="text-sm text-brand-primary hover:underline">
          View All
        </button>
      </div>

      <div className="divide-y divide-white/10">
        {activities.slice(0, 5).map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}

function ActivityItem({ activity }: { activity: any }) {
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
  })

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full bg-brand-primary">
          <img
            src={activity.user.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
            alt={activity.user.fullName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="text-sm">
          <p>
            <span className="font-medium">{activity.user.fullName}</span>{' '}
            {activity.action}{' '}
            <span className="text-brand-primary">{activity.highlight}</span>{' '}
            {activity.target}
          </p>
          <span className="text-xs text-slate-400">{timeAgo}</span>
        </div>
      </div>

      <FiChevronRight className="text-slate-400" />
    </div>
  )
}
