import { type ReactNode } from "react";

import { cn } from "../../lib/cn";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export const Panel = ({ children, className }: PanelProps): JSX.Element => {
  return (
    <section
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </section>
  );
};
