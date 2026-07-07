import './globals.css';
import { Header } from '@/components/ui/Header';

export const metadata = {
  title: 'FootyLive | Telemetry',
  description: 'Live football telemetry and match stats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen relative text-zinc-100 bg-[#050505]">
        {/* Ambient background glows */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}