import { BarChart3, LogOut, ShieldCheck, UsersRound } from "lucide-react";
import { type ReactNode } from "react";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { type AuthSession } from "../../types/session";
import { type ThemeMode } from "../../types/ui";

interface DashboardShellProps {
  children: ReactNode;
  session: AuthSession;
  theme: ThemeMode;
  onLogout: () => void;
  onToggleTheme: () => void;
}

export const DashboardShell = ({
  children,
  onLogout,
  onToggleTheme,
  session,
  theme
}: DashboardShellProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-600 text-sm font-bold text-white dark:bg-teal-500 dark:text-slate-950">
            SL
          </div>
          <div>
            <p className="text-sm font-semibold">Smart Leads</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard</p>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="mt-8 space-y-1">
          <button
            className="flex h-10 w-full items-center gap-3 rounded-md bg-slate-100 px-3 text-left text-sm font-medium text-slate-950 dark:bg-slate-800 dark:text-white"
            type="button"
          >
            <UsersRound aria-hidden="true" className="h-4 w-4" />
            Leads
          </button>
          <button
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            type="button"
          >
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Auth
          </button>
          <button
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            type="button"
          >
            <BarChart3 aria-hidden="true" className="h-4 w-4" />
            Reports
          </button>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-white">
                  Lead Operations
                </h1>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Authentication and lead forms
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-950 dark:text-white">{session.user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{session.user.role}</p>
              </div>
              <Button
                icon={<LogOut aria-hidden="true" className="h-4 w-4" />}
                onClick={onLogout}
                variant="secondary"
              >
                Logout
              </Button>
              <ThemeToggle onToggle={onToggleTheme} theme={theme} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
};
