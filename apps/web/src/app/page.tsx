import { Metadata } from 'next';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const metadata: Metadata = {
  title: 'Forge Web - Home',
  description: 'Project management platform for teams.',
};

export default function HomePage() {
  return (
    <main >
      <ThemeToggle/>
    </main>
  );
}