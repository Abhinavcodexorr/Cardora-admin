"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputCls, textareaCls } from "@/components/ui/field";
import { TabBar } from "@/components/ui/tab-bar";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/toast";
import { ThemeSwitcher } from "./theme-switcher";

const team = [
  { name: "John Doe", email: "john.doe@cardora.ca", role: "Admin" },
  { name: "Priya Shah", email: "priya.shah@cardora.ca", role: "Staff" },
  { name: "Daniel Kim", email: "daniel.kim@cardora.ca", role: "Staff" },
  { name: "Marco Rossi", email: "marco.rossi@cardora.ca", role: "Viewer" },
];
const roleNote = {
  Admin: "Full access, including settings and team",
  Staff: "Manage customers, requests and campaigns",
  Viewer: "Read-only access",
} as const;

export function SettingsView() {
  const [tab, setTab] = useState("profile");
  const [toast, show] = useToast();
  const [sms, setSms] = useState(
    "Hi {first_name}, your {vehicle} account is ready on the Cardora app. Get started: {link}",
  );
  const [subject, setSubject] = useState("Welcome to Cardora, {first_name}");
  const [sec, setSec] = useState({ mfa: true, timeout: true, alerts: false });
  const preview = (t: string) =>
    t
      .replace("{first_name}", "Alex")
      .replace("{vehicle}", "2024 BMW X5")
      .replace("{link}", "cardora.ca/app");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    show("Settings saved (preview only)");
  };

  return (
    <Card className="p-6">
      <TabBar
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "profile", label: "Profile" },
          { id: "invites", label: "Invitation templates" },
          { id: "team", label: "Team & roles" },
          { id: "security", label: "Security" },
        ]}
      />
      <div className="mt-6 max-w-2xl">
        {tab === "profile" && (
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name="John Doe" className="size-16 text-xl" />
              <Button>Change photo</Button>
            </div>
            <ThemeSwitcher />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                {(id) => <input id={id} className={inputCls} defaultValue="John Doe" />}
              </Field>
              <Field label="Email">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    className={inputCls}
                    defaultValue="john.doe@cardora.ca"
                  />
                )}
              </Field>
              <Field label="Dealership location">
                {(id) => (
                  <select id={id} className={inputCls} defaultValue="Toronto">
                    <option>Toronto</option>
                    <option>Mississauga</option>
                    <option>Oakville</option>
                  </select>
                )}
              </Field>
              <Field label="Time zone">
                {(id) => (
                  <select id={id} className={inputCls} defaultValue="ET">
                    <option value="ET">Eastern (Toronto)</option>
                    <option value="CT">Central</option>
                    <option value="PT">Pacific</option>
                  </select>
                )}
              </Field>
            </div>
            <Button type="submit" variant="primary">
              Save profile
            </Button>
          </form>
        )}

        {tab === "invites" && (
          <form onSubmit={save} className="space-y-5">
            <p className="text-muted text-sm">
              Variables: <code>{"{first_name}"}</code>, <code>{"{vehicle}"}</code>,{" "}
              <code>{"{link}"}</code>
            </p>
            <Field label="SMS invitation" hint={`${sms.length}/160 characters`}>
              {(id) => (
                <textarea
                  id={id}
                  rows={3}
                  maxLength={160}
                  className={textareaCls}
                  value={sms}
                  onChange={(e) => setSms(e.target.value)}
                />
              )}
            </Field>
            <p className="rounded-xl bg-zinc-50 p-3 text-sm">
              <span className="text-muted block text-xs">Preview</span>
              {preview(sms)}
            </p>
            <Field label="Email subject">
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              )}
            </Field>
            <p className="rounded-xl bg-zinc-50 p-3 text-sm">
              <span className="text-muted block text-xs">Preview</span>
              {preview(subject)}
            </p>
            <Button type="submit" variant="primary">
              Save templates
            </Button>
          </form>
        )}

        {tab === "team" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Team members</h2>
              <Button
                variant="primary"
                onClick={() => show("Invite flow is not part of this preview")}
              >
                <Plus className="size-4" /> Invite member
              </Button>
            </div>
            <ul className="divide-line divide-y">
              {team.map((m) => (
                <li key={m.email} className="flex items-center gap-3 py-3">
                  <Avatar name={m.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-muted truncate text-xs">
                      {m.email} · {roleNote[m.role as keyof typeof roleNote]}
                    </p>
                  </div>
                  <Badge
                    tone={
                      m.role === "Admin" ? "green" : m.role === "Staff" ? "blue" : "gray"
                    }
                  >
                    {m.role}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "security" && (
          <ul className="divide-line divide-y">
            {(
              [
                [
                  "mfa",
                  "Two-factor authentication",
                  "Require a one-time code at sign-in for all staff.",
                ],
                [
                  "timeout",
                  "Auto sign-out after 30 minutes",
                  "Ends idle sessions on shared dealership computers.",
                ],
                [
                  "alerts",
                  "Email me on new sign-ins",
                  "Get notified when your account is used on a new device.",
                ],
              ] as const
            ).map(([k, t, d]) => (
              <li key={k} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-muted text-xs">{d}</p>
                </div>
                <Toggle
                  label={t}
                  checked={sec[k]}
                  onChange={(v) => setSec({ ...sec, [k]: v })}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {toast}
    </Card>
  );
}
