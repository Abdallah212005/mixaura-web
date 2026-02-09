"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <>
      <AnimatedBackground />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
            <div className="w-full max-w-lg space-y-4">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
