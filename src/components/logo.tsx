import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="https://placehold.co/28x28/7C3AED/FFFFFF/png?text=M" alt="Mix Aura" width={28} height={28} className="rounded-sm" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Mix Aura
      </h1>
    </div>
  );
}
