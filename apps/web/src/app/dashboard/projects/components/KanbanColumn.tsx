'use client';

import TaskCard, { Task } from './TaskCard';
import { TaskStatus } from './types';

interface Props {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDropTask: (taskId: string, status: TaskStatus) => void;
}
export interface Column {
  id: string;
  title: string;
  status: TaskStatus;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  onDropTask,
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
      className="w-80 shrink-0"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <span>{title}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
