import { FiMoreVertical, FiGrid } from "react-icons/fi";

interface Props {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "on-track" | "delayed";
  membersCount: number;
  onOpen: () => void;
}

export default function ProjectCard({
  id,
  title,
  description,
  progress,
  status,
  membersCount,
  onOpen,
}: Props) {
  return (
    <div
      onClick={onOpen}
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

        <button
          onClick={(e) => e.stopPropagation()}
          className="
            rounded-lg p-1.5 transition
            text-slate-400 hover:text-slate-600

            dark:text-slate-500 dark:hover:text-slate-300
          "
        >
          <FiMoreVertical size={18} />
        </button>
      </div>

      {/* Title */}
      <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-brand-text">
        {title}
      </h3>

      <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
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
            +{membersCount}
          </span>
        </div>

        <span
          className={`
            rounded-full px-3 py-1 text-xs font-medium
            ${
              status === "on-track"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-orange-100 text-brand-primary dark:bg-brand-secondary"
            }
          `}
        >
          {status === "on-track" ? "On Track" : "Delayed"}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="tracking-wide">PROGRESS</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="h-2 rounded-full bg-brand-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
