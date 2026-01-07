"use client";

import { useEffect, useState } from "react";
import type { FollowUp, Template } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type FollowUpItem = Omit<FollowUp, "scheduledAt" | "createdAt"> & {
  scheduledAt: string;
  createdAt: string;
};

type TemplateItem = Template;
type FollowUpWithTemplate = FollowUpItem & { template: TemplateItem | null };

export default function WorkPage() {
  const [followUps, setFollowUps] = useState<FollowUpWithTemplate[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/followups").then((res) => res.json()),
      fetch("/api/templates").then((res) => res.json())
    ]).then(([followUpData, templateData]) => {
      setFollowUps(followUpData);
      setTemplates(templateData);
    });
  }, []);

  const updateFollowUp = async (id: string, data: Partial<FollowUpItem>) => {
    const response = await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data })
    });
    return response.json() as Promise<FollowUpWithTemplate>;
  };

  const handleCopy = async (body: string) => {
    await navigator.clipboard.writeText(body);
    if (navigator.share) {
      await navigator.share({ text: body });
    }
  };

  const handleTemplateUpdate = async (id: string, data: Partial<TemplateItem>) => {
    const response = await fetch(`/api/templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json() as Promise<TemplateItem>;
  };

  return (
    <div className="space-y-6">
      <PrimaryButton
        label="What now?"
        sublabel="Back to the command dashboard"
        onClick={() => (window.location.href = "/?whatnow=1")}
      />
      <SectionHeader title="Work" />
      <Card>
        <p className="text-sm text-ink-500">Follow-ups generated from recent appointments.</p>
        <div className="mt-3">
          <SecondaryButton label="Edit templates" onClick={() => setShowTemplates(true)} />
        </div>
      </Card>

      <div className="space-y-4">
        {followUps.length === 0 && (
          <Card>
            <p className="text-sm text-ink-500">No follow-ups queued yet.</p>
          </Card>
        )}
        {["Today", "This week"].map((label) => {
          const isToday = label === "Today";
          const items = followUps.filter((followUp) => {
            const date = new Date(followUp.scheduledAt);
            const now = new Date();
            const isSameDay = date.toDateString() === now.toDateString();
            return isToday ? isSameDay : !isSameDay;
          });

          if (items.length === 0) return null;

          return (
            <div key={label} className="space-y-3">
              <h3 className="text-sm font-semibold text-ink-700">{label}</h3>
              {items.map((followUp) => (
                <Card key={followUp.id} title="Follow-up">
                  <div className="space-y-3">
                    <select
                      value={followUp.templateId ?? ""}
                      onChange={async (event) => {
                        const updated = await updateFollowUp(followUp.id, {
                          templateId: event.target.value
                        });
                        setFollowUps((prev) =>
                          prev.map((item) => (item.id === followUp.id ? updated : item))
                        );
                      }}
                      className="w-full rounded-2xl border border-sand-200 px-3 py-2 text-sm"
                    >
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <div className="rounded-2xl border border-sand-200 bg-sand-50 p-3 text-sm">
                      {followUp.template?.body ?? ""}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <SecondaryButton
                        label="Copy + Share"
                        onClick={() => handleCopy(followUp.template?.body ?? "")}
                      />
                      <SecondaryButton
                        label="Snooze"
                        onClick={async () => {
                          const snoozed = await updateFollowUp(followUp.id, {
                            status: "snoozed",
                            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                          });
                          setFollowUps((prev) =>
                            prev.map((item) => (item.id === followUp.id ? snoozed : item))
                          );
                        }}
                      />
                      <SecondaryButton
                        label="Skip"
                        onClick={async () => {
                          await updateFollowUp(followUp.id, { status: "skipped" });
                          setFollowUps((prev) => prev.filter((item) => item.id !== followUp.id));
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      {showTemplates && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4">
            <div className="mb-3 text-lg font-semibold">Templates</div>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="space-y-2 rounded-2xl border border-sand-200 p-3">
                  <input
                    value={template.name}
                    onChange={(event) =>
                      setTemplates((prev) =>
                        prev.map((item) =>
                          item.id === template.id ? { ...item, name: event.target.value } : item
                        )
                      )
                    }
                    className="w-full rounded-2xl border border-sand-200 px-3 py-2 text-sm"
                  />
                  <textarea
                    value={template.body}
                    onChange={(event) =>
                      setTemplates((prev) =>
                        prev.map((item) =>
                          item.id === template.id ? { ...item, body: event.target.value } : item
                        )
                      )
                    }
                    className="w-full rounded-2xl border border-sand-200 px-3 py-2 text-sm"
                    rows={3}
                  />
                  <SecondaryButton
                    label="Save template"
                    onClick={async () => {
                      const updated = await handleTemplateUpdate(template.id, {
                        name: template.name,
                        body: template.body,
                        channel: template.channel
                      });
                      setTemplates((prev) =>
                        prev.map((item) => (item.id === template.id ? updated : item))
                      );
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <SecondaryButton label="Close" onClick={() => setShowTemplates(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
