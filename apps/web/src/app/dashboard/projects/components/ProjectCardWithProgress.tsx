import { useProjectProgress } from '@/app/hooks/useProjectProgress'
import { Project } from '@/app/api/projects.api'
import ProjectCard from './ProjectCard'

interface Props {
  project: Project
  onOpen: () => void
}

export default function ProjectCardWithProgress({ project, onOpen }: Props) {
  const { progress, totalTasks, completedTasks } = useProjectProgress(project.id)
  
  // Determinar el estado basado en el progreso y las tareas
  const getProjectStatus = (): 'on-track' | 'delayed' => {
    if (totalTasks === 0) return 'on-track' // Sin tareas aún
    
    // Si tiene muchas tareas pero poco progreso, está retrasado
    if (totalTasks >= 5 && progress < 20) return 'delayed'
    
    // Si tiene progreso medio pero muchas tareas pendientes, podría estar retrasado
    if (totalTasks >= 10 && progress < 50) return 'delayed'
    
    // Si el progreso es muy bajo en general
    if (progress < 10 && totalTasks > 2) return 'delayed'
    
    return 'on-track' // Estado por defecto para buen progreso
  }

  return (
    <ProjectCard
      project={project}
      progress={progress}
      status={getProjectStatus()}
      membersCount={0} // TODO: Implementar conteo real de miembros
      onOpen={onOpen}
    />
  )
}