'use client'

import { useProjects } from '@/app/hooks/useProjects'
import { useAuth } from '@/app/hooks/useAuth'
import ProjectCard from './ProjectCard'
import CreateProjectCard from './CreateProjectCard'
import { LoadingState } from '@/components/states/LoadingState'
import { ErrorState } from '@/components/states/ErrorState'
import { EmptyState } from '@/components/states/EmptyState'

interface Props {
  onOpenProject: (projectId: string) => void
}

export default function ProjectsGrid({ onOpenProject }: Props) {
  const { user } = useAuth()
  const { data: projects, isLoading, error } = useProjects(user?.organization?.id)

  if (isLoading) {
    return <LoadingState message="Loading projects..." />
  }

  if (error) {
    return <ErrorState message="Failed to load projects. Please try again." />
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-8">
        <EmptyState message="No projects yet. Create your first project!" />
        <CreateProjectCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.name}
          description={project.description || ''}
          progress={0}
          status="on-track"
          membersCount={0}
          onOpen={() => onOpenProject(project.id)}
        />
      ))}
      <CreateProjectCard />
    </div>
  )
}
