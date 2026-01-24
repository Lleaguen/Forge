'use client';

import { ReactNode, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onDropItem?: (data: string) => void;
}

export default function ProjectBoardLayout({
  open,
  onClose,
  children,
  onDropItem,
}: Props) {
  const [isDragOver, setIsDragOver] = useState(false);

  if (!open) return null;

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);

    const data = e.dataTransfer.getData('text/plain');
    onDropItem?.(data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL DROPEABLE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative
          h-[96vh] w-[96vw]
          rounded-2xl
          shadow-2xl
          overflow-hidden
          transition

          bg-brand-Muted/40
          text-slate-100
          dark:bg-brand-bg

          ${
            isDragOver
              ? 'ring-2 ring-orange-400'
              : 'ring-1 ring-white/10'
          }
        `}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 z-10
            rounded-lg p-2
            text-slate-400
            hover:bg-white/10
          "
        >
          <FiX size={20} />
        </button>

        {children}

        {/* Feedback visual cuando dropeas */}
        {isDragOver && (
          <div className="pointer-events-none absolute inset-0 bg-orange-400/5" />
        )}
      </div>
    </div>
  );
}
