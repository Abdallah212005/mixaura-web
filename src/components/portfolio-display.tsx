import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import Image from "next/image";

export type PortfolioItem = {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Portfolio = {
  portfolioItems: PortfolioItem[];
};

type PortfolioDisplayProps = {
  portfolio: Portfolio | null;
};

export function PortfolioDisplay({ portfolio }: PortfolioDisplayProps) {
  if (!portfolio) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {portfolio.portfolioItems.map((item, index) => (
        <Card key={index} className="bg-card/70 backdrop-blur-sm border-border/50 hover:border-accent/50 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-accent flex-shrink-0 mt-1"/>
              <div>
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">{item.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 mt-auto">
            <div className="aspect-video relative w-full rounded-lg overflow-hidden border border-border">
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={item.imageHint}
                />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
