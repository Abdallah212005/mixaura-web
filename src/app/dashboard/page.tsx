"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
                <div className="w-full max-w-lg space-y-4">
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Card className="w-full bg-card/70 backdrop-blur-sm">
                        <CardHeader>
                            <Skeleton className="h-8 w-1/3" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
          <Card className="w-full max-w-lg bg-card/70 backdrop-blur-sm text-center">
            <CardHeader>
              <CardTitle className="text-2xl">User Dashboard</CardTitle>
              <CardDescription>Welcome to your personal space.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You are logged in as {user.email}.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
