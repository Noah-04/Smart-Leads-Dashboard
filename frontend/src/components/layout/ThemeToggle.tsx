import { Moon, Sun } from "lucide-react";

import { Button } from "../ui/Button";
import { type ThemeMode } from "../../types/ui";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle = ({ onToggle, theme }: ThemeToggleProps): JSX.Element => {
  const isDark = theme === "dark";

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      icon={
        isDark ? (
          <Sun aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Moon aria-hidden="true" className="h-4 w-4" />
        )
      }
      onClick={onToggle}
      variant="secondary"
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
};
