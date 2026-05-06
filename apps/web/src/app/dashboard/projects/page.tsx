'use client'

import { useState } from 'react'
import ProjectModalLayout from './components/ProjectBoardModal'
import ProjectBoardLayout from './components/ProjectBoardLayout'
import ProjectsLayout from './components/ProjectsLayout'

export default function ProjectsPage() {
  const [open, setOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setOpen(true)
  }

  return (
    <>
      <ProjectsLayout onOpenProject={handleOpenProject} />

      <ProjectBoardLayout
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedProjectId(null)
        }}
        onDropItem={(data) => {
          // Handle dropped item
        }}
      >
        {selectedProjectId && <ProjectModalLayout projectId={selectedProjectId} />}
      </ProjectBoardLayout>
    </>
  )
}
