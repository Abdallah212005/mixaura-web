"use client";

import { useState } from "react";
import Link from "next/link";
import { collection } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PortfolioDisplay, type PortfolioItem } from "@/components/portfolio-display";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const firestore = useFirestore();
  const portfolioQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "portfolioItems");
  }, [firestore]);
  const { data: portfolioItems, isLoading } = useCollection<PortfolioItem>(portfolioQuery);

  const handleShowPortfolio = () => {
    setShowPortfolio(true);
  };

  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center justify-center text-center space-y-12">
            <Hero />
            {!showPortfolio && (
              <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                <Button onClick={handleShowPortfolio} size="lg" className="btn-animated bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-base">
                  <Eye className="h-5 w-5" />
                  Our Portfolio
                </Button>
                <Button asChild size="lg" className="btn-animated rounded-full px-8 py-6 text-base">
                  <Link href="https://wa.me/201020117504" target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {showPortfolio && (
             <div className="mt-16 md:mt-24 animate-fade-in">
               <Separator className="my-8 bg-border/20" />
               <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Our Work
               </h2>
               {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                      <Skeleton className="h-[250px] w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
               )}
               {portfolioItems && <PortfolioDisplay portfolio={{ portfolioItems }} />}
             </div>
          )}

        </main>
        <Footer />
      </div>
    </>
  );
}
