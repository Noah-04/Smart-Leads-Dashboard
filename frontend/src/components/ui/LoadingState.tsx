import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  label: string;
}

export const LoadingState = ({ label }: LoadingStateProps): JSX.Element => {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
      {label}
    </div>
  );
};
