import ProjectActivity from './components/ProjectActivity';
import ProjectsGrid from './components/ProjectsGrid';

interface Props {
  onOpenProject: () => void;
}
export default function ProjectsView({ onOpenProject }: Props) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B1020] to-[#070B18] px-10 py-8 text-slate-100">

      <div className="mt-10">
        <ProjectsGrid onOpenProject={onOpenProject} />
      </div>

      <div className="mt-12">
        <ProjectActivity />
      </div>
    </div>
  );
}
