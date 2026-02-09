export function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Using a standard img tag for debugging the logo path. */}
      <img src="/logo.png" alt="Mix Aura" width={28} height={28} className="rounded-sm" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Mix Aura
      </h1>
    </div>
  );
}
