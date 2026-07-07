'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, Clock, Trophy, BarChart3, Gamepad2, Menu, X, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: <Zap className="w-4 h-4" />, label: 'Live' },
  { href: '/fixtures', icon: <Clock className="w-4 h-4" />, label: 'Fixtures' },
  { href: '/leagues', icon: <Trophy className="w-4 h-4" />, label: 'Leagues' },
  { href: '/multi-match', icon: <BarChart3 className="w-4 h-4" />, label: 'Multi-Match' },
  { href: '/predictions', icon: <Gamepad2 className="w-4 h-4" />, label: 'Predictions' },
];

export function Header({}: { darkMode: boolean; toggleDarkMode: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Glass header bar */}
        <div className="glass border-b border-white/[0.06]">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover:bg-emerald-500/30 transition-colors" />
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Goal className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <span className="text-xl font-extrabold tracking-tight gradient-text">
                  FootyLive
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/15 to-violet-500/10 border border-emerald-500/20"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
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

              {/* Right side — mobile toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/[0.06]"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5 text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 glass border-b border-white/[0.06]"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
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
    </>
  );
}

export function MobileNav({}: { isOpen: boolean; onClose: () => void }) {
  // Retained for backwards compat – actual mobile nav is now inside Header
  return null;
}