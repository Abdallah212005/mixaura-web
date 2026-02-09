"use client";

import { useState } from "react";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PortfolioDisplay, type Portfolio } from "@/components/portfolio-display";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const mixAuraPortfolio: Portfolio = {
  portfolioItems: [
    {
      title: "Stratos-Launch for Nebula Notes",
      description: "Developed a viral social media campaign using AI-generated visuals and targeted influencer collaborations to propel Nebula Notes, a productivity app, to #1 on the app store within 3 months of launch.",
      imageUrl: "https://picsum.photos/seed/nebulanotes/600/400",
      imageHint: "abstract data",
    },
    {
      title: "Quantum Leap Branding for Fusion Fintech",
      description: "Executed a complete brand overhaul for Fusion Fintech, including a new logo, brand voice, and website design. Our AI-driven market analysis identified key differentiators, resulting in a 250% increase in user trust and engagement.",
      imageUrl: "https://picsum.photos/seed/fusionfintech/600/400",
      imageHint: "modern finance",
    },
    {
      title: "Echo Chamber Content Strategy for Echo AI",
      description: "Crafted a content marketing strategy that established Echo AI as a thought leader in the conversational AI space. Our AI-powered content engine produced 50+ high-ranking articles and whitepapers, driving a 400% increase in organic traffic.",
      imageUrl: "https://picsum.photos/seed/echoai/600/400",
      imageHint: "ai content",
    },
  ],
};


export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleShowPortfolio = () => {
    setShowPortfolio(true);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center justify-center text-center space-y-12">
            <Hero />
            {!showPortfolio && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                <Button onClick={handleShowPortfolio} size="lg" className="btn-animated bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-base">
                  <Eye className="mr-2 h-5 w-5" />
                  Our Portfolio
                </Button>
              </div>
            )}
          </div>
          
          {showPortfolio && (
             <div className="mt-16 md:mt-24 animate-fade-in">
               <Separator className="my-8 bg-border/20" />
               <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Our AI-Powered Work
               </h2>
              <PortfolioDisplay
                portfolio={mixAuraPortfolio}
              />
             </div>
          )}

        </main>
        <Footer />
      </div>
    </>
  );
}
