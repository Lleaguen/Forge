import { FiMoreVertical, FiGrid, FiEdit3, FiUsers, FiSettings, FiTrash2, FiEye } from "react-icons/fi";
import { useState } from 'react';
import { useDeleteProject, useProjectProgress } from '@/app/hooks';
import EditProjectModal from './EditProjectModal';
import ManageMembersModal from './ManageMembersModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import { Project } from '@/app/api/projects.api';

interface Props {
  project: Project;
  onOpen: (projectId: string) => void;
}

export default function ProjectCard({ project, onOpen }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const deleteProjectMutation = useDeleteProject();
  const { progress } = useProjectProgress(project.id);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleMenuClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(false);
    
    switch (action) {
      case 'view':
        onOpen(project.id);
        break;
      case 'edit':
        setShowEditModal(true);
        break;
      case 'members':
        setShowMembersModal(true);
        break;
      case 'settings':
        setShowSettingsModal(true);
        break;
      case 'delete':
        if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`)) {
          deleteProjectMutation.mutate(project.id);
        }
        break;
    }
  };

  return (
    <>
      <div
        onClick={() => onOpen(project.id)}
        className="
          group relative cursor-pointer rounded-2xl border p-6 transition-all

          bg-white border-slate-200
          hover:shadow-lg

          dark:bg-brand-bgCard dark:border-white/10
          dark:hover:bg-[#151B34]
        "
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div
            className="
              flex h-11 w-11 items-center justify-center rounded-xl

              bg-slate-100 text-slate-600
              dark:bg-[#1E2442] dark:text-sky-400
            "
          >
            <FiGrid size={20} />
          </div>

          <div className="relative">
            <button
              onClick={handleDropdownClick}
              className="
                rounded-lg p-1.5 transition
                text-slate-400 hover:text-slate-600

                dark:text-slate-500 dark:hover:text-slate-300
              "
            >
              <FiMoreVertical size={18} />
            </button>
            
            {showDropdown && (
              <>
                <div className="absolute right-0 top-full z-[9999] mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <button
                    onClick={(e) => handleMenuClick('view', e)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FiEye size={16} />
                    Ver proyecto
                  </button>
                  <button
                    onClick={(e) => handleMenuClick('edit', e)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FiEdit3 size={16} />
                    Editar proyecto
                  </button>
                  <button
                    onClick={(e) => handleMenuClick('members', e)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FiUsers size={16} />
                    Gestionar miembros
                  </button>
                  <button
                    onClick={(e) => handleMenuClick('settings', e)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FiSettings size={16} />
                    Configuración
                  </button>
                  <hr className="my-1 border-slate-200 dark:border-slate-600" />
                  <button
                    onClick={(e) => handleMenuClick('delete', e)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <FiTrash2 size={16} />
                    Eliminar proyecto
                  </button>
                </div>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-[9998]" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-brand-text">
          {project.name}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {project.description || 'No description'}
        </p>

        {/* Members + Status */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              <div className="h-7 w-7 rounded-full bg-teal-400 dark:bg-teal-500" />
              <div className="h-7 w-7 rounded-full bg-cyan-400 dark:bg-cyan-500" />
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              +1
            </span>
          </div>

          <span
            className="
              rounded-full px-3 py-1 text-xs font-medium
              bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400
            "
          >
            On Track
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="tracking-wide">PROGRESS</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-brand-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProjectModal
        project={project}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => setShowEditModal(false)}
      />

      <ManageMembersModal
        projectId={project.id}
        projectName={project.name}
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
      />

      <ProjectSettingsModal
        project={project}
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}