'use client';

import TaskCard, { Task } from './TaskCard';
import { TaskStatus } from './types';

interface Props {
  title: string;
  status: TaskStatus;
  color?: string;
  tasks: Task[];
  onDropTask: (taskId: string, status: TaskStatus) => void;
  onAddTask?: () => void;
}
export interface Column {
  id: string;
  title: string;
  status: TaskStatus;
}

export default function KanbanColumn({
  title,
  status,
  color,
  tasks,
  onDropTask,
  onAddTask,
}: Props) {
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onDropTask(taskId, status);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex h-full min-w-[320px] max-w-[320px] flex-shrink-0 flex-col rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {color && (
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
          <span className="truncate">{title}</span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>
        
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            title="Add task"
          >
            +
          </button>
        )}
      </div>

      {/* Tasks Container - Scrollable */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {/* Add Task Button */}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex h-20 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all dark:border-slate-600 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:hover:bg-blue-500/10"
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  );
}
