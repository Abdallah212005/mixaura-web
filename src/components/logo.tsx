import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      {/* Using a standard img tag for debugging the logo path. */}
      <img src="/logo.png" alt="Mix Aura" width={64} height={64} className="rounded-sm" />
    </Link>
  );
}
