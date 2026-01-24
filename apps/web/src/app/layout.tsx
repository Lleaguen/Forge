import { ThemeProvider } from 'next-themes';
import './globals.css';
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body>
        <div id="root-equivalent"> 
            <ThemeProvider attribute="class"  defaultTheme="dark"enableSystem={false}>
          <Providers>
              {children}
              </Providers>
              </ThemeProvider>
        </div>
      </body>
    </html>
  );
}