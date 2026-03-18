import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Key,
  Plus,
  Settings,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/passwords', icon: Key, label: 'All Passwords' },
  { to: '/add-password', icon: Plus, label: 'Add Password' },
  { to: '/generator', icon: Sparkles, label: 'Generator' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden hover:bg-accent text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-sidebar backdrop-blur-xl border-r border-sidebar-border z-40 transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Key className="size-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-sidebar-foreground">
                PassVault
              </h1>
              <p className="text-xs text-muted-foreground">
                Password Manager
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-accent',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-foreground border border-indigo-500/30'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto size-1.5 rounded-full bg-indigo-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto pt-6 border-t border-border">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-indigo-400" />
                <span className="text-xs font-semibold text-foreground">
                  Pro Tip
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use the password generator to create strong, unique passwords
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}