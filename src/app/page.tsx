"use client";

import { useState } from "react";
import type { GenerateMarketingPortfolioOutput } from "@/ai/flows/generate-marketing-portfolio";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PortfolioGenerator } from "@/components/portfolio-generator";
import { PortfolioDisplay } from "@/components/portfolio-display";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [portfolio, setPortfolio] = useState<GenerateMarketingPortfolioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <>
      <AnimatedBackground />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center justify-center text-center space-y-12">
            <Hero />
            <PortfolioGenerator
              setIsLoading={setIsLoading}
              setPortfolio={setPortfolio}
              setError={setError}
              setIsGenerated={setIsGenerated}
              isLoading={isLoading}
            />
          </div>
          
          {isGenerated && (
             <div className="mt-16 md:mt-24">
               <Separator className="my-8 bg-border/20" />
               <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Our AI-Generated Vision for You
               </h2>
              <PortfolioDisplay
                portfolio={portfolio}
                isLoading={isLoading}
                error={error}
              />
             </div>
          )}

        </main>
        <Footer />
      </div>
    </>
  );
}
