import { BarChart3, Gift, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Brand } from "@/components/layout/brand";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

const points = [
  { icon: ShieldCheck, text: "Manage protection contracts and documents in one place" },
  { icon: Gift, text: "Rewards, referrals and service credit, always in sync" },
  { icon: BarChart3, text: "Know exactly how customers engage after delivery" },
];

export default function LoginPage() {
  return (
    <>
      <section className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#06241a] to-[#005c37] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-24 -bottom-24 size-[36rem] opacity-30"
        >
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#00af66"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray="620 400"
            transform="rotate(-40 200 200)"
          />
          <circle
            cx="200"
            cy="200"
            r="95"
            fill="none"
            stroke="#33c285"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="300 400"
            transform="rotate(140 200 200)"
          />
        </svg>
        <span
          aria-hidden
          className="bg-brand-500/25 pointer-events-none absolute top-1/4 -left-20 size-72 rounded-full blur-3xl"
        />
        <Image
          src="/brand/cardora-logo-dark.png"
          alt="Cardora — A Robinson Motor Company"
          width={600}
          height={250}
          priority
          className="relative h-auto w-48 self-start"
        />
        <div className="relative max-w-lg">
          <h2 className="text-4xl leading-tight font-bold tracking-tight">
            Every customer, every vehicle, every reward. Beautifully organized.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/85">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/50">
          © Cardora. A Robinson Motor Company.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center p-6">
        <div className="animate-fade-up w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted mt-1 text-sm">Sign in to manage your customers.</p>
          <LoginForm />
        </div>
      </section>
    </>
  );
}
