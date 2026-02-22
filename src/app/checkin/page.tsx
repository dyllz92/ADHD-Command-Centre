"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export default function CheckInPage() {
  const [eaten, setEaten] = useState(false);
  const [water, setWater] = useState(false);
  const [moved, setMoved] = useState(false);
  const [brainState, setBrainState] = useState("ok");
  const [capacity, setCapacity] = useState("med");
  const [mood, setMood] = useState("ok");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eaten, water, moved, brainState, capacity, mood })
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <PrimaryButton
        label="What now?"
        sublabel="Back to the command dashboard"
        onClick={() => (window.location.href = "/?whatnow=1")}
      />
      <SectionHeader title="Check-in" />
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Have you eaten?</span>
            <button
              type="button"
              onClick={() => setEaten((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-sm ${eaten ? "bg-calm-500 text-white" : "bg-sand-100"}`}
            >
              {eaten ? "Yes" : "No"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Water today?</span>
            <button
              type="button"
              onClick={() => setWater((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-sm ${water ? "bg-calm-500 text-white" : "bg-sand-100"}`}
            >
              {water ? "Yes" : "No"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Moved your body?</span>
            <button
              type="button"
              onClick={() => setMoved((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-sm ${moved ? "bg-calm-500 text-white" : "bg-sand-100"}`}
            >
              {moved ? "Yes" : "No"}
            </button>
          </div>
        </div>
      </Card>

      <Card title="Brain state">
        <div className="flex gap-2">
          {["foggy", "ok", "sharp"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setBrainState(value)}
              className={`rounded-full px-3 py-1 text-sm ${
                brainState === value ? "bg-ink-900 text-white" : "bg-sand-100"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Capacity">
        <div className="flex gap-2">
          {["low", "med", "high"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCapacity(value)}
              className={`rounded-full px-3 py-1 text-sm ${
                capacity === value ? "bg-ink-900 text-white" : "bg-sand-100"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Mood">
        <div className="flex gap-2">
          {["low", "ok", "good"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMood(value)}
              className={`rounded-full px-3 py-1 text-sm ${
                mood === value ? "bg-ink-900 text-white" : "bg-sand-100"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </Card>

      <SecondaryButton label="Submit check-in" onClick={handleSubmit} />

      {submitted && (
        <Card>
          <p className="text-sm text-ink-700">Nice. Want a suggestion?</p>
          <div className="mt-2">
            <SecondaryButton label="Try What now?" onClick={() => (window.location.href = "/")} />
          </div>
        </Card>
      )}
    </div>
  );
}
