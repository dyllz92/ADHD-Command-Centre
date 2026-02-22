import type { ReactNode } from "react";
import clsx from "clsx";

export type CardProps = {
  title?: string;
  rightAction?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const Card = ({ title, rightAction, children, className }: CardProps) => {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-sand-200 bg-white/80 p-4 shadow-sm",
        className
      )}
    >
      {(title || rightAction) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {rightAction}
        </div>
      )}
      {children}
    </section>
  );
};
