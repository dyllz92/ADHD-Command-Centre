"use client";

import { useEffect, useState } from "react";
import type { SuggestionOutput } from "@/lib/suggestNextAction";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const WhatNowPanel = ({ suggestion }: { suggestion: SuggestionOutput }) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("whatnow") === "1") {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="space-y-3">
      <PrimaryButton
        label="What now?"
        sublabel="One clear next step"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="rounded-2xl border border-sand-200 bg-white p-4 text-sm shadow-sm">
          <div className="text-xs uppercase tracking-wide text-ink-500">Recommended</div>
          <div className="mt-2 text-base font-semibold text-ink-900">
            {suggestion.recommended.title}
          </div>
          <div className="mt-1 text-xs text-ink-500">{suggestion.recommended.duration}</div>
          {suggestion.recommended.actionLink && (
            <Link
              href={suggestion.recommended.actionLink}
              className="mt-3 inline-block text-sm font-medium text-calm-500"
            >
              Go there
            </Link>
          )}
          <div className="mt-4 space-y-2">
            <div className="text-xs uppercase tracking-wide text-ink-500">Alternatives</div>
            {suggestion.alternatives.map((alt) => (
              <div key={alt.title} className="flex items-center justify-between">
                <span className="text-sm text-ink-700">{alt.title}</span>
                {alt.actionLink && (
                  <Link href={alt.actionLink} className="text-xs font-medium text-calm-500">
                    Open
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
