import { CarImage } from "@/components/ui/car-image";
import { cn } from "@/lib/utils";

/** Compact car picture for tables and lists. */
export function VehicleThumb({
  make,
  model,
  seed,
  color,
  className,
}: {
  make: string;
  model: string;
  seed?: string;
  color?: string;
  className?: string;
}) {
  return (
    <CarImage
      make={make}
      model={model}
      seed={seed}
      color={color}
      className={cn("h-10 w-16 shrink-0 rounded-lg", className)}
    />
  );
}
