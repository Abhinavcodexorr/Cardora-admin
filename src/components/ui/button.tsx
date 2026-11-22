import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  dark: "bg-inverse text-white hover:bg-inverse-hover",
  outline: "border border-line bg-surface hover:bg-zinc-50",
  ghost: "hover:bg-zinc-100",
} as const;

export type ButtonVariant = keyof typeof variants;

/** Class names so links (next/link) can look like buttons. */
export function buttonStyles(variant: ButtonVariant = "outline", className?: string) {
  return cn(
    "focus-visible:ring-brand-500 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "outline",
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />;
}
