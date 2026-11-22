import Image from "next/image";
import { cn } from "@/lib/utils";

const ALT = "Cardora — A Robinson Motor Company";

/** Light logo on light theme, white-wordmark logo on dark theme (swapped with CSS, no flash). */
export function Brand({ className }: { className?: string }) {
  return (
    <div className="inline-block">
      <Image
        src="/brand/cardora-logo.png"
        alt={ALT}
        width={600}
        height={250}
        priority
        className={cn("h-auto w-44 dark:hidden", className)}
      />
      <Image
        src="/brand/cardora-logo-dark.png"
        alt={ALT}
        width={600}
        height={250}
        priority
        className={cn("hidden h-auto w-44 dark:block", className)}
      />
    </div>
  );
}
