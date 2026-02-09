"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminSetupPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
    if (user && user.email?.toLowerCase() !== 'admin@mixaura.com') {
        router.push("/");
    }
  }, [user, isUserLoading, router]);

  const copyToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      toast({
        title: "Copied!",
        description: "User UID copied to clipboard.",
      });
    }
  };

  if (isUserLoading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
                 <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-4 w-1/4" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-stretch gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                 </Card>
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
          <Card className="w-full max-w-2xl bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Final Admin Setup Step</CardTitle>
              <CardDescription>To complete your admin access, you must perform one manual action in your Firebase Console.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                This is a required security measure to ensure only the project owner can grant admin privileges.
              </p>
              <div className="space-y-4">
                <ol className="list-decimal list-inside space-y-4">
                  <li>
                    Go to your Firestore Database in a new tab.
                    <Button asChild variant="link" className="p-1 h-auto ml-1">
                        <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                           Open Firebase Console
                        </a>
                    </Button>
                  </li>
                  <li>Click <strong>+ Start collection</strong> and enter the Collection ID: <code className="bg-muted text-foreground p-1 rounded-md text-xs">roles_admin</code></li>
                  <li>
                    For the <strong>Document ID</strong>, paste your User UID:
                    <div className="flex items-center gap-2 mt-2 p-3 rounded-md bg-muted border">
                        <span className="font-mono text-xs text-foreground flex-1 break-all">{user.uid}</span>
                        <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                  </li>
                  <li>Leave the fields empty and click <strong>Save</strong>.</li>
                </ol>
              </div>
              <p className="text-sm pt-4">Once you've done this, you'll have full admin access after you log in again.</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/">I've completed this step, take me to the app!</Link>
                </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
