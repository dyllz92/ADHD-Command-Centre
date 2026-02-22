"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Heart, Briefcase, Calendar, Settings } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/todo", label: "To-Do", icon: ListChecks },
  { href: "/checkin", label: "Check-in", icon: Heart },
  { href: "/work", label: "Work", icon: Briefcase },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings }
];

export const BottomTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-sand-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-2 pb-[calc(env(safe-area-inset-bottom)_+_8px)] pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "flex min-w-[48px] flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs",
                isActive ? "text-ink-900" : "text-ink-500"
              )}
            >
              <Icon className={clsx("h-5 w-5", isActive && "text-calm-500")} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
