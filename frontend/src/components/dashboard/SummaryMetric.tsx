import { type ReactNode } from "react";

interface SummaryMetricProps {
  label: string;
  value: string;
  icon: ReactNode;
}

export const SummaryMetric = ({ icon, label, value }: SummaryMetricProps): JSX.Element => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
    </section>
  );
};
