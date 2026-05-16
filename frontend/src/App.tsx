import { BarChart3, CheckCircle2, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SummaryMetric } from "./components/dashboard/SummaryMetric";
import { AuthForms } from "./components/forms/AuthForms";
import { DashboardShell } from "./components/layout/DashboardShell";
import { ThemeToggle } from "./components/layout/ThemeToggle";
import { LeadsDashboard } from "./components/leads/LeadsDashboard";
import { type AuthSession } from "./types/session";
import { type ThemeMode } from "./types/ui";

const SESSION_STORAGE_KEY = "smart-leads-session";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("smart-leads-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const isAuthSession = (value: unknown): value is AuthSession => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Record<string, unknown>;
  const user = session.user as Record<string, unknown> | undefined;

  return (
    typeof session.accessToken === "string" &&
    typeof user?.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  );
};

const getInitialSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession) as unknown;
    return isAuthSession(parsedSession) ? parsedSession : null;
  } catch {
    return null;
  }
};

export const App = (): JSX.Element => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [session, setSession] = useState<AuthSession | null>(getInitialSession);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("smart-leads-theme", theme);
  }, [theme]);

  const handleAuthenticated = (nextSession: AuthSession): void => {
    setSession(nextSession);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
  };

  const handleLogout = (): void => {
    setSession(null);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const metrics = useMemo(
    () => [
      {
        label: "API Session",
        value: "Active",
        icon: <UsersRound aria-hidden="true" className="h-4 w-4" />
      },
      {
        label: "Role",
        value: session?.user.role ?? "Unknown",
        icon: <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
      },
      {
        label: "Access",
        value: session?.user.role === "Admin" ? "Full CRUD" : "No Delete",
        icon: <ShieldCheck aria-hidden="true" className="h-4 w-4" />
      },
      {
        label: "UI States",
        value: "4",
        icon: <BarChart3 aria-hidden="true" className="h-4 w-4" />
      }
    ],
    [session]
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6">
        <header className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-600 text-sm font-bold text-white dark:bg-teal-500 dark:text-slate-950">
              SL
            </div>
            <div>
              <h1 className="text-base font-semibold">Smart Leads</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue</p>
            </div>
          </div>
          <ThemeToggle
            onToggle={() => {
              setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
            }}
            theme={theme}
          />
        </header>

        <main className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Lead Management</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              Login to open your dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Access is protected with JWT authentication. Register or login first, then the leads dashboard will load with filters, pagination, and lead details.
            </p>
          </section>

          <AuthForms
            onAuthenticated={handleAuthenticated}
            onLogout={handleLogout}
            session={null}
          />
        </main>
      </div>
    );
  }

  return (
    <DashboardShell
      onLogout={handleLogout}
      onToggleTheme={() => {
        setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
      }}
      session={session}
      theme={theme}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <SummaryMetric
              icon={metric.icon}
              key={metric.label}
              label={metric.label}
            value={metric.value}
          />
        ))}
      </div>

        <LeadsDashboard session={session} />
      </div>
    </DashboardShell>
  );
};
