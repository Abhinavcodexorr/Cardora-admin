"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { Field, inputCls } from "@/components/ui/field";

/** Static preview: no authentication happens; "Sign in" simply opens the dashboard. */
export function LoginForm() {
  const [show, setShow] = useState(false);
  return (
    <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
      <Field label="Work email">
        {(id) => (
          <div className="relative">
            <Mail className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              id={id}
              type="email"
              autoComplete="username"
              defaultValue="john.doe@cardora.ca"
              className={`${inputCls} h-11 pl-9`}
            />
          </div>
        )}
      </Field>
      <Field label="Password">
        {(id) => (
          <div className="relative">
            <Lock className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              id={id}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              defaultValue="preview-only"
              className={`${inputCls} h-11 px-9`}
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((s) => !s)}
              className="text-muted absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 hover:bg-zinc-100"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        )}
      </Field>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="accent-brand-500 size-4" />{" "}
          Keep me signed in
        </label>
        <button type="button" className="text-brand-600 font-medium hover:underline">
          Forgot password?
        </button>
      </div>
      <Link
        href="/dashboard"
        className={buttonStyles(
          "primary",
          "shadow-brand-500/25 h-11 w-full text-base shadow-lg",
        )}
      >
        Sign in
      </Link>
      <p className="text-muted text-center text-xs">
        Preview build: no real sign-in is performed.
      </p>
    </form>
  );
}
