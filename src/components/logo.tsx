import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      {/* Using a standard img tag for debugging the logo path. */}
      <img src="/logo.png" alt="Mix Aura" width={192} height={192} className="rounded-sm" />
    </Link>
  );
}
