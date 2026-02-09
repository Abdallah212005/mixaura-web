import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="Mix Aura" width={28} height={28} />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Mix Aura
      </h1>
    </div>
  );
}
