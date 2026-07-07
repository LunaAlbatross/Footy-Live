'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Calendar, Trophy, BarChart2, Crosshair, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', icon: <Activity size={18} />, label: 'Live Telemetry' },
  { href: '/fixtures', icon: <Calendar size={18} />, label: 'Fixtures' },
  { href: '/leagues', icon: <Trophy size={18} />, label: 'Leagues' },
  { href: '/multi-match', icon: <BarChart2 size={18} />, label: 'Multi-View' },
  { href: '/predictions', icon: <Crosshair size={18} />, label: 'Predictions' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-zinc-100">
            Footy<span className="text-emerald-400 font-light">Live</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-2',
                  isActive 
                    ? 'text-emerald-400 bg-white/5' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="header-active-tab"
                    className="absolute inset-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-zinc-400 hover:text-white">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-zinc-950"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-md flex items-center gap-3',
                    pathname === item.href 
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return null;
}