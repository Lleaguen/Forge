'use client'

import { FiBell, FiChevronRight, FiFolder, FiCheckCircle, FiRefreshCw, FiUsers } from 'react-icons/fi'
import { useActivities } from '@/app/hooks/useActivity'
import { LoadingState } from '@/components/states/LoadingState'
import { EmptyState } from '@/components/states/EmptyState'
import { formatDistanceToNow } from 'date-fns'
import { type ReactNode } from 'react'

// Types
interface ProjectActivityProps {
  projectId?: string
}

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  userId: string
  userName: string
  createdAt: string
  metadata?: ActivityMetadata
}

interface ActivityMetadata {
  projectId?: string
  projectName?: string
  taskId?: string
  taskTitle?: string
  oldStatus?: string
  newStatus?: string
}

type ActivityType = 'project_created' | 'task_created' | 'task_updated' | 'member_added'

interface ActivityIconConfig {
  icon: ReactNode
  color: string
}

// Constants
const ACTIVITY_ICON_MAP: Record<ActivityType, ActivityIconConfig> = {
  project_created: {
    icon: <FiFolder size={18} />,
    color: 'text-brand-primary',
  },
  task_created: {
    icon: <FiCheckCircle size={18} />,
    color: 'text-green-400',
  },
  task_updated: {
    icon: <FiRefreshCw size={18} />,
    color: 'text-blue-400',
  },
  member_added: {
    icon: <FiUsers size={18} />,
    color: 'text-purple-400',
  },
}

const DEFAULT_ACTIVITY_ICON: ActivityIconConfig = {
  icon: <FiBell size={18} />,
  color: 'text-slate-400',
}

const MAX_VISIBLE_ACTIVITIES = 5

// Main Component
export default function ProjectActivity({ projectId }: ProjectActivityProps) {
  const { data: activities, isLoading } = useActivities(projectId)

  if (isLoading) {
    return <ActivityContainer><LoadingState message="Loading activities..." /></ActivityContainer>
  }

  const activitiesArray = Array.isArray(activities) ? activities : []

  if (activitiesArray.length === 0) {
    return (
      <ActivityContainer>
        <ActivityHeader />
        <EmptyState message="No recent activity" />
      </ActivityContainer>
    )
  }

  return (
    <ActivityContainer>
      <ActivityHeader showViewAll />
      <div className="divide-y divide-white/10">
        {activitiesArray.slice(0, MAX_VISIBLE_ACTIVITIES).map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </ActivityContainer>
  )
}

// Sub-components
function ActivityContainer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      {children}
    </div>
  )
}

function ActivityHeader({ showViewAll = false }: { showViewAll?: boolean }) {
  return (
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

      {showViewAll && (
        <button className="text-sm text-brand-primary hover:underline">
          View All
        </button>
      )}
    </div>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
  })

  const iconConfig = ACTIVITY_ICON_MAP[activity.type] || DEFAULT_ACTIVITY_ICON
  const displayName = activity.metadata?.taskTitle || activity.metadata?.projectName || activity.title

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <ActivityIcon config={iconConfig} />
        <ActivityContent
          userName={activity.userName}
          description={activity.description}
          displayName={displayName}
          timeAgo={timeAgo}
        />
      </div>
      <FiChevronRight className="text-slate-400" />
    </div>
  )
}

function ActivityIcon({ config }: { config: ActivityIconConfig }) {
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 ${config.color}`}>
      {config.icon}
    </div>
  )
}

function ActivityContent({
  userName,
  description,
  displayName,
  timeAgo,
}: {
  userName: string
  description: string
  displayName: string
  timeAgo: string
}) {
  return (
    <div className="text-sm">
      <p>
        <span className="font-medium">{userName}</span>{' '}
        {description}{' '}
        <span className="text-brand-primary">{displayName}</span>
      </p>
      <span className="text-xs text-slate-400">{timeAgo}</span>
    </div>
  )
}
