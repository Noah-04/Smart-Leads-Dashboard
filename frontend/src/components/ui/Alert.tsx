import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { type ReactNode } from "react";

import { cn } from "../../lib/cn";

type AlertTone = "error" | "success" | "info";

interface AlertProps {
  title: string;
  children?: ReactNode | undefined;
  tone?: AlertTone;
}

const toneClasses: Record<AlertTone, string> = {
  error:
    "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100",
  info:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100"
};

const iconMap: Record<AlertTone, JSX.Element> = {
  error: <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />,
  success: <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />,
  info: <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
};

export const Alert = ({ children, title, tone = "info" }: AlertProps): JSX.Element => {
  return (
    <div className={cn("flex gap-3 rounded-md border p-3 text-sm", toneClasses[tone])} role="alert">
      {iconMap[tone]}
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        {children ? <div className="mt-1 leading-6 opacity-90">{children}</div> : null}
      </div>
    </div>
  );
};
