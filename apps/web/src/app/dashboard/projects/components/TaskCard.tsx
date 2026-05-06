'use client';

import { useState } from 'react';
import { FiCalendar, FiTag, FiUser, FiCheck } from 'react-icons/fi';
import { TaskStatus } from './types';
import {
  getCategoryColors,
  getPriorityColors,
  getCategoryDisplayName,
  getPriorityDisplayName
} from '../utils/taskColors';
import { formatDistanceToNow } from 'date-fns';
import { useProjectMembers } from '@/app/hooks/useMembers';
import { useUpdateTask } from '@/app/hooks/useTasks';
import { useAuth } from '@/app/hooks/useAuth';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  label: string;
  dueDate: string;
  comments: number;
  tags?: string[];
  createdAt?: string;
  projectId: string;
  assignee?: {
    id: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
}

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: members } = useProjectMembers(task.projectId);
  const { user } = useAuth();
  const updateTaskMutation = useUpdateTask();

  const [category, priority] = task.label.split(' • ').map(s => s.trim());
  const categoryColors = getCategoryColors(category || 'DEVELOPMENT');
  const priorityColors = getPriorityColors(priority || 'MEDIUM');

  const createdAgo = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : null;

  const assigneeName = task.assignee?.fullName || task.assignee?.email?.split('@')[0] || null;
  const assigneeAvatar = task.assignee?.avatarUrl || null;
  const assigneeInitial = assigneeName ? assigneeName.charAt(0).toUpperCase() : null;

  const handleAssign = (assigneeId: string | null) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      payload: { assigneeId: assigneeId ?? null } as any,
      projectId: task.projectId,
      useStatusEndpoint: false,
      silent: true,
    });
    setDropdownOpen(false);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="
        group cursor-grab select-none
        rounded-lg border border-slate-200 bg-white p-4 shadow-sm
        hover:shadow-md hover:border-slate-300 transition-all duration-200
        dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600
        active:cursor-grabbing active:scale-[0.98]
        w-full
      "
    >
      {/* Category and Priority Labels */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`}>
          {getCategoryDisplayName(category || 'DEVELOPMENT')}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border`}>
          <div className={`w-2 h-2 rounded-full ${priorityColors.dot}`} />
          {getPriorityDisplayName(priority || 'MEDIUM')}
        </span>
      </div>

      {/* Title */}
      <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              title={tag}
              className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium text-brand-primary dark:bg-brand-primary/20"
            >
              <FiTag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: date + assignee */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {/* Creation date */}
        <div className="flex items-center gap-1">
          <FiCalendar size={12} />
          <span>{createdAgo || task.dueDate}</span>
        </div>

        {/* Assignee button */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {/* If assigned and it's not the current user, show locked avatar */}
          {task.assignee && task.assignee.id !== user?.id ? (
            <div className="relative group/avatar flex items-center gap-1">
              {assigneeAvatar ? (
                <img
                  src={assigneeAvatar}
                  alt={assigneeName || ''}
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white ring-2 ring-white dark:ring-slate-800">
                  {assigneeInitial}
                </div>
              )}
              {/* Tooltip with name */}
              <div className="pointer-events-none absolute bottom-full right-0 mb-1 hidden whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover/avatar:block dark:bg-slate-700">
                {assigneeName}
              </div>
            </div>
          ) : (
            <button
              type="button"
              title={task.assignee ? `Assigned to you — click to unassign` : 'Assign task'}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 rounded-full transition-transform hover:scale-110"
            >
              {task.assignee ? (
                assigneeAvatar ? (
                  <img
                    src={assigneeAvatar}
                    alt={assigneeName || ''}
                    className="h-6 w-6 rounded-full object-cover ring-2 ring-brand-primary dark:ring-brand-primary"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white ring-2 ring-brand-primary">
                    {assigneeInitial}
                  </div>
                )
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-primary hover:text-brand-primary dark:border-slate-600">
                  <FiUser size={12} />
                </div>
              )}
            </button>
          )}

          {/* Assignee dropdown - only for unassigned or current assignee */}
          {dropdownOpen && (
            <>
              <div className="absolute bottom-full right-0 z-50 mb-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
                <p className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {task.assignee ? 'Unassign task' : 'Assign to'}
                </p>

                {task.assignee ? (
                  // Only show unassign option if it's the current user's task
                  <button
                    type="button"
                    onClick={() => handleAssign(null)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <FiUser size={14} />
                    <span>Unassign from me</span>
                  </button>
                ) : (
                  // Show all members to assign
                  members?.map((member) => {
                    const name = member.user?.fullName || member.user?.email?.split('@')[0] || 'Unknown';
                    const isYou = member.userId === user?.id;

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleAssign(member.userId)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        {member.user?.avatarUrl ? (
                          <img src={member.user.avatarUrl} alt={name} className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-slate-700 dark:text-slate-200">
                          {name}{isYou ? ' (you)' : ''}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
