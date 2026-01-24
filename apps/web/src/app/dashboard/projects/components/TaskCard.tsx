'use client';

import { FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { TaskStatus } from './types';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  label: string;
  dueDate: string;
  comments: number;
}

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="
        cursor-grab select-none
        rounded-xl p-4
        ring-1 ring-white/10
        bg-white dark:bg-brand-bgCard
        hover:bg-white/60 transition
      "
    >
      <span className="mb-2 inline-block font-bold rounded-md px-2 py-0.5 text-xs text-blue-400 bg-blue-400/20">
        {task.label}
      </span>

      <h4 className="mb-2 font-medium font-bold text-slate-600 dark:text-slate-100 ">
        {task.title}
      </h4>

      <p className="text-sm text-brand-Muted dark:text-slate-400">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <FiCalendar /> {task.dueDate}
        </div>
        <div className="flex items-center gap-1">
          <FiMessageSquare />
          {task.comments}
        </div>
      </div>
    </div>
  );
}
