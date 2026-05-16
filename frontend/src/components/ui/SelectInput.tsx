import { type SelectHTMLAttributes, useId } from "react";

import { cn } from "../../lib/cn";
import { type SelectOption } from "../../types/domain";

interface SelectInputProps<TValue extends string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: readonly SelectOption<TValue>[];
  error?: string | undefined;
}

export const SelectInput = <TValue extends string>({
  className,
  error,
  id,
  label,
  options,
  ...props
}: SelectInputProps<TValue>): JSX.Element => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={selectId}>
        {label}
      </label>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50",
          error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
          className
        )}
        id={selectId}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-300" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
