import { type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { type SelectOption } from "../../types/domain";

interface SegmentedControlProps<TValue extends string> {
  label: string;
  value: TValue;
  options: readonly SelectOption<TValue>[];
  onChange: (value: TValue) => void;
  renderIcon?: (value: TValue) => ReactNode;
}

export const SegmentedControl = <TValue extends string>({
  label,
  onChange,
  options,
  renderIcon,
  value
}: SegmentedControlProps<TValue>): JSX.Element => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
      <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition",
                isSelected
                  ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {renderIcon ? renderIcon(option.value) : null}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
