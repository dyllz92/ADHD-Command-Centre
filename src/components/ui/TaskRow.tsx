import clsx from "clsx";
import type { Task } from "@prisma/client";

export type TaskRowProps = {
  task: Task;
  onToggleDone?: (task: Task) => void;
  onSnooze?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  showMeta?: boolean;
};

export const TaskRow = ({ task, onToggleDone, onSnooze, onEdit, showMeta = true }: TaskRowProps) => {
  const isDone = task.status === "done";

  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-3 shadow-sm",
        isDone && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={() => onToggleDone?.(task)}
        className={clsx(
          "mt-1 h-6 w-6 rounded-full border-2",
          isDone ? "border-calm-500 bg-calm-500" : "border-sand-200"
        )}
        aria-label={isDone ? "Mark as not done" : "Mark as done"}
      />
      <div className="flex-1 space-y-2">
        <button
          type="button"
          onClick={() => onEdit?.(task)}
          className="text-left text-base font-medium text-ink-900"
        >
          {task.title}
        </button>
        {showMeta && (
          <div className="text-xs text-ink-500">
            {task.estimateMinutes ? `${task.estimateMinutes} min` : "No estimate"} · {task.energy}
            · {task.mode}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSnooze?.(task)}
            className="text-xs font-medium text-calm-500"
          >
            Snooze
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="text-xs font-medium text-calm-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
