import { Blend } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Blend className="h-7 w-7 text-accent" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Mix Aura
      </h1>
    </div>
  );
}
