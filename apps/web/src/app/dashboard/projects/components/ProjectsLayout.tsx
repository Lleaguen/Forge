import ProjectsContent from './ProjectsContent'

interface Props {
  onOpenProject: (projectId: string) => void
}

export default function ProjectsLayout({ onOpenProject }: Props) {
  return (
    <div className="flex h-screen w-full bg-brand-bg text-slate-100">
      <ProjectsContent onOpenProject={onOpenProject} />
    </div>
  )
}
