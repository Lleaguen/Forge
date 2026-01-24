import { Metadata } from 'next';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const metadata: Metadata = {
  title: 'Forge Web - Home',
  description: 'Esta es la descripción para Google',
};

export default function HomePage() {
  return (
    <main >
      <ThemeToggle/>
    </main>
  );
}