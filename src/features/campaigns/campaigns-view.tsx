"use client";

import { Bell, Mail, MessageSquare, Plus, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";

import { Drawer } from "@/components/ui/drawer";
import { Field, inputCls, textareaCls } from "@/components/ui/field";
import { StatusPicker } from "@/components/ui/status-picker";
import { useToast } from "@/components/ui/toast";
import { audiences, campaigns as seed, type Campaign, type Channel } from "./data";

const channelIcon = { push: Bell, sms: MessageSquare, email: Mail } as const;
const channelName = { push: "Push", sms: "SMS", email: "Email" } as const;
const tone = { draft: "gray", scheduled: "amber", sent: "green" } as const;

function Composer({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (c: Campaign) => void;
}) {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("push");
  const [audience, setAudience] = useState(audiences[1].id);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [when, setWhen] = useState("now");
  const aud = audiences.find((a) => a.id === audience)!;
  const valid = name.trim() && body.trim() && (channel !== "email" || title.trim());

  const create = (status: Campaign["status"]) =>
    onCreate({
      id: `c${Date.now()}`,
      name: name.trim(),
      channel,
      audience: aud.label,
      status,
      when:
        status === "sent"
          ? "Just now"
          : status === "scheduled"
            ? "Tomorrow, 9:00 AM"
            : "—",
      sent: status === "sent" ? aud.count : 0,
      opened: 0,
    });

  return (
    <Drawer
      title="New campaign"
      subtitle="Compose, preview and send"
      width="max-w-[560px]"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button disabled={!valid} onClick={() => create("draft")}>
            Save draft
          </Button>
          <Button
            variant="primary"
            disabled={!valid}
            onClick={() => create(when === "now" ? "sent" : "scheduled")}
          >
            <Send className="size-4" />{" "}
            {when === "now" ? `Send to ${aud.count.toLocaleString()}` : "Schedule"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Field label="Campaign name">
          {(id) => (
            <input
              id={id}
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </Field>
        <div>
          <h3 className="mb-2 text-sm font-medium">Channel</h3>
          <StatusPicker
            value={channel}
            onChange={setChannel}
            options={[
              { id: "push", label: "Push" },
              { id: "sms", label: "SMS" },
              { id: "email", label: "Email" },
            ]}
          />
        </div>
        <Field label="Audience" hint={`${aud.count.toLocaleString()} recipients`}>
          {(id) => (
            <select
              id={id}
              className={inputCls}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              {audiences.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} ({a.count.toLocaleString()})
                </option>
              ))}
            </select>
          )}
        </Field>
        {channel !== "sms" && (
          <Field label={channel === "email" ? "Subject" : "Title"}>
            {(id) => (
              <input
                id={id}
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            )}
          </Field>
        )}
        <Field
          label="Message"
          hint={channel === "sms" ? `${body.length}/160 characters` : undefined}
        >
          {(id) => (
            <textarea
              id={id}
              rows={4}
              maxLength={channel === "sms" ? 160 : 500}
              className={textareaCls}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          )}
        </Field>
        <div>
          <h3 className="mb-2 text-sm font-medium">When</h3>
          <StatusPicker
            value={when}
            onChange={setWhen}
            options={[
              { id: "now", label: "Send now" },
              { id: "later", label: "Schedule" },
            ]}
          />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">Preview</h3>
          <div className="mx-auto w-64 rounded-[2rem] border-4 border-zinc-800 bg-zinc-100 p-3">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-zinc-800" />
            <div className="rounded-2xl bg-white p-3 text-xs shadow">
              <p className="text-brand-600 flex items-center gap-1 font-semibold">
                <Bell className="size-3" /> Cardora · now
              </p>
              {channel !== "sms" && (
                <p className="mt-1 font-semibold">
                  {title || (channel === "email" ? "Subject line" : "Notification title")}
                </p>
              )}
              <p className="mt-0.5 break-words text-zinc-600">
                {body || "Your message will appear here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function makeFilters(rows: Campaign[]): {
  filters: FilterDef<Campaign>[];
  sorts: SortDef<Campaign>[];
} {
  const rate = (c: Campaign) => (c.sent ? c.opened / c.sent : 0);
  return {
    filters: [
      {
        id: "channel",
        label: "Channel",
        allLabel: "All channels",
        options: [
          { value: "push", label: "Push" },
          { value: "sms", label: "SMS" },
          { value: "email", label: "Email" },
        ],
        test: (r, v) => r.channel === v,
      },
      {
        id: "aud",
        label: "Audience",
        allLabel: "All audiences",
        options: uniqueOptions(rows, (r) => r.audience),
        test: (r, v) => r.audience === v,
      },
    ],
    sorts: [
      { id: "new", label: "Newest first", compare: () => 0 },
      {
        id: "open",
        label: "Open rate (high → low)",
        compare: (a, b) => rate(b) - rate(a),
      },
      { id: "reach", label: "Reach (high → low)", compare: (a, b) => b.sent - a.sent },
    ],
  };
}

export function CampaignsView() {
  const [rows, setRows] = useState(seed);
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  const [composing, setComposing] = useState(false);
  const [toast, show] = useToast();
  return (
    <>
      <DataView
        rows={rows}
        rowKey={(r) => r.id}
        searchText={(r) => `${r.name} ${r.audience}`}
        searchPlaceholder="Search campaigns..."
        filters={filters}
        sorts={sorts}
        toolbar={
          <Button variant="primary" onClick={() => setComposing(true)}>
            <Plus className="size-4" /> New campaign
          </Button>
        }
        tabs={[
          { id: "all", label: "All" },
          { id: "draft", label: "Drafts", filter: (r) => r.status === "draft" },
          {
            id: "scheduled",
            label: "Scheduled",
            filter: (r) => r.status === "scheduled",
          },
          { id: "sent", label: "Sent", filter: (r) => r.status === "sent" },
        ]}
        columns={[
          {
            header: "Campaign",
            cell: (r) => {
              const I = channelIcon[r.channel];
              return (
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 text-brand-600 flex size-9 items-center justify-center rounded-full">
                    <I className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-muted text-xs">{channelName[r.channel]}</p>
                  </div>
                </div>
              );
            },
          },
          { header: "Audience", cell: (r) => r.audience },
          {
            header: "Status",
            cell: (r) => (
              <Badge tone={tone[r.status]}>
                {r.status[0].toUpperCase() + r.status.slice(1)}
              </Badge>
            ),
          },
          { header: "When", cell: (r) => <span className="text-muted">{r.when}</span> },
          {
            header: "Delivered / opened",
            cell: (r) =>
              r.sent ? (
                <>
                  {r.sent.toLocaleString()} /{" "}
                  <b>{Math.round((r.opened / r.sent) * 100)}%</b>
                </>
              ) : (
                <span className="text-muted">—</span>
              ),
          },
        ]}
      />
      {composing && (
        <Composer
          onClose={() => setComposing(false)}
          onCreate={(c) => {
            setRows((l) => [c, ...l]);
            setComposing(false);
            show(
              c.status === "sent"
                ? "Campaign sent (demo, nothing delivered)"
                : c.status === "scheduled"
                  ? "Campaign scheduled (demo)"
                  : "Draft saved",
            );
          }}
        />
      )}
      {toast}
    </>
  );
}
