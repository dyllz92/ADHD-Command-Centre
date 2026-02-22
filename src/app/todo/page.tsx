"use client";

import { useEffect, useMemo, useState } from "react";
import type { Task } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TaskRow } from "@/components/ui/TaskRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { parseTags } from "@/lib/taskUtils";

const filters = ["Today", "Upcoming", "Inbox", "Waiting on…"] as const;

type Filter = (typeof filters)[number];

type TimerState = {
  taskId: string;
  duration: number;
  startedAt: number;
};

type TaskItem = Omit<Task, "dueAt" | "createdAt" | "updatedAt"> & {
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const createTask = async (title: string) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status: "todo", tags: [] })
  });
  return response.json() as Promise<TaskItem>;
};

const updateTask = async (id: string, data: Partial<TaskItem>) => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return response.json() as Promise<TaskItem>;
};

export default function TodoPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<Filter>("Today");
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<TaskItem | null>(null);
  const [timer, setTimer] = useState<TimerState | null>(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "Inbox":
        return tasks.filter((task) => task.status === "inbox");
      case "Upcoming":
        return tasks.filter((task) => task.dueAt && task.status !== "done");
      case "Waiting on…":
        return tasks.filter((task) => parseTags(task).includes("waiting"));
      default:
        return tasks.filter((task) => task.status !== "done");
    }
  }, [tasks, filter]);

  const handleQuickAdd = async () => {
    if (!title.trim()) return;
    const newTask = await createTask(title.trim());
    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
  };

  const handleToggleDone = async (task: TaskItem) => {
    const updated = await updateTask(task.id, {
      status: task.status === "done" ? "todo" : "done"
    });
    setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
  };

  const handleSnooze = async (task: TaskItem) => {
    const choice = window.prompt("Snooze to: later today, tomorrow, next week", "tomorrow");
    const base = new Date();
    if (choice === "later today") {
      base.setHours(base.getHours() + 3);
    } else if (choice === "next week") {
      base.setDate(base.getDate() + 7);
    } else {
      base.setDate(base.getDate() + 1);
    }
    const updated = await updateTask(task.id, { dueAt: base.toISOString() });
    setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
  };

  const handleMakeDoable = async (task: TaskItem) => {
    const subTasks = ["Step 1", "Step 2", "Step 3"];
    const created = await Promise.all(
      subTasks.map((label) =>
        createTask(`${task.title}: ${label}`).then((newTask) =>
          updateTask(newTask.id, { parentId: task.id })
        )
      )
    );
    setTasks((prev) => [...created, ...prev]);
  };

  const handleStartTimer = (duration: number) => {
    if (!selected) return;
    setTimer({ taskId: selected.id, duration, startedAt: Date.now() });
  };

  const remainingMinutes = timer
    ? Math.max(0, Math.ceil((timer.duration * 60 * 1000 - (Date.now() - timer.startedAt)) / 60000))
    : null;

  return (
    <div className="space-y-6">
      <PrimaryButton
        label="What now?"
        sublabel="Back to the command dashboard"
        onClick={() => (window.location.href = "/?whatnow=1")}
      />
      <SectionHeader title="To-Do" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === item ? "bg-ink-900 text-white" : "bg-white text-ink-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Quick add a task"
            className="flex-1 rounded-2xl border border-sand-200 px-4 py-3 text-sm"
          />
          <SecondaryButton label="Add" onClick={handleQuickAdd} />
        </div>
      </Card>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggleDone={handleToggleDone}
            onSnooze={handleSnooze}
            onEdit={setSelected}
          />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4">
            <div className="mb-3 text-lg font-semibold">{selected.title}</div>
            <div className="space-y-2 text-sm text-ink-700">
              <label className="block">
                Estimate (minutes)
                <input
                  type="number"
                  value={selected.estimateMinutes ?? ""}
                  onChange={(event) =>
                    setSelected({
                      ...selected,
                      estimateMinutes: Number(event.target.value)
                    })
                  }
                  className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
                />
              </label>
              <label className="block">
                Energy
                <select
                  value={selected.energy}
                  onChange={(event) => setSelected({ ...selected, energy: event.target.value as Task["energy"] })}
                  className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="med">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="block">
                Mode
                <select
                  value={selected.mode}
                  onChange={(event) => setSelected({ ...selected, mode: event.target.value as Task["mode"] })}
                  className="mt-1 w-full rounded-2xl border border-sand-200 px-3 py-2"
                >
                  <option value="calls">Calls</option>
                  <option value="admin">Admin</option>
                  <option value="out">Out</option>
                  <option value="deep">Deep</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.pinnedToday}
                  onChange={(event) => setSelected({ ...selected, pinnedToday: event.target.checked })}
                />
                Pin to Top 3
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <SecondaryButton label="Make this doable" onClick={() => handleMakeDoable(selected)} />
              <SecondaryButton label="Start 15" onClick={() => handleStartTimer(15)} />
              <SecondaryButton label="Start 25" onClick={() => handleStartTimer(25)} />
              <SecondaryButton label="Start 45" onClick={() => handleStartTimer(45)} />
            </div>
            {timer?.taskId === selected.id && remainingMinutes !== null && (
              <p className="mt-3 text-xs text-ink-500">Focus timer: {remainingMinutes} min left</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <SecondaryButton label="Close" onClick={() => setSelected(null)} />
              <SecondaryButton
                label="Save"
                onClick={async () => {
                  const updated = await updateTask(selected.id, selected);
                  setTasks((prev) => prev.map((item) => (item.id === selected.id ? updated : item)));
                  setSelected(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
