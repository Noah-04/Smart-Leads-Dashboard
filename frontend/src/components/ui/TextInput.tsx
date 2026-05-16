import { type InputHTMLAttributes, type ReactNode, useId } from "react";

import { cn } from "../../lib/cn";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  icon?: ReactNode | undefined;
}

export const TextInput = ({
  className,
  error,
  icon,
  id,
  label,
  ...props
}: TextInputProps): JSX.Element => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={inputId}>
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500",
            icon ? "pl-9" : "",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
            className
          )}
          id={inputId}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-300" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
