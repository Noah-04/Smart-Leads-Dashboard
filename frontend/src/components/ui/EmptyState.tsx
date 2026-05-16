import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ description, title }: EmptyStateProps): JSX.Element => {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-950">
      <Inbox aria-hidden="true" className="mx-auto h-5 w-5 text-slate-400" />
      <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
};
