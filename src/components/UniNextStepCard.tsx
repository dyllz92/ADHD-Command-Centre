"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

type AppStateResponse = {
  id: string;
  uniNextStep: string;
};

export const UniNextStepCard = () => {
  const [state, setState] = useState<AppStateResponse | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetch("/api/appstate")
      .then((res) => res.json())
      .then((data) => {
        setState(data);
        setValue(data.uniNextStep);
      });
  }, []);

  const handleSave = async () => {
    if (!state) return;
    const response = await fetch("/api/appstate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniNextStep: value })
    });
    if (response.ok) {
      const updated = await response.json();
      setState(updated);
      setEditing(false);
    }
  };

  return (
    <Card
      title="Uni: Next step"
      rightAction={<SecondaryButton label="Edit" onClick={() => setEditing(true)} />}
    >
      <p className="text-sm text-ink-700">{state?.uniNextStep ?? "Set a tiny next step"}</p>
      {editing && (
        <div className="mt-3 space-y-2">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-2xl border border-sand-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <SecondaryButton label="Cancel" onClick={() => setEditing(false)} />
            <SecondaryButton label="Save" onClick={handleSave} />
          </div>
        </div>
      )}
    </Card>
  );
};
