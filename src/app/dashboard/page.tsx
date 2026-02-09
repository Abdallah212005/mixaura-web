"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { useUser } from "@/firebase";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const isAdmin = useAdmin();

  useEffect(() => {
    // Wait until we have definitive user and admin status
    if (isUserLoading || isAdmin === null) {
      return; // Still loading, do nothing. The page shows a loading skeleton.
    }

    if (!user) {
      // If user is not logged in for any reason, send to login page.
      router.replace("/login");
      return;
    }
    
    // We have a logged in user, now check for admin status
    if (isAdmin) {
      router.replace("/admin");
    } else {
      router.replace("/");
    }
  }, [user, isUserLoading, isAdmin, router]);

  // Render a loading state while checks are in progress
  return (
    <>
      <AnimatedBackground />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
            <div className="w-full max-w-lg space-y-4 text-center">
                <h1 className="text-2xl font-bold">Please wait</h1>
                <p className="text-muted-foreground">Verifying credentials and redirecting...</p>
                 <div className="w-full max-w-lg space-y-4 pt-8">
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
            </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
