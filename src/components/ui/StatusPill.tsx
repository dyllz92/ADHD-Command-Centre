import type { ReactNode } from "react";
import clsx from "clsx";

export type StatusPillProps = {
  label: string;
  state: "good" | "neutral" | "attention";
  icon?: ReactNode;
};

export const StatusPill = ({ label, state, icon }: StatusPillProps) => {
  const stateClass = {
    good: "bg-calm-100 text-calm-500",
    neutral: "bg-sand-100 text-ink-700",
    attention: "bg-amber-100 text-amber-700"
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        stateClass[state]
      )}
    >
      {icon}
      {label}
    </span>
  );
};
