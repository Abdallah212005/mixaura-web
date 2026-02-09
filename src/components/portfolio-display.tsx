import type { GenerateMarketingPortfolioOutput } from "@/ai/flows/generate-marketing-portfolio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Lightbulb } from "lucide-react";
import Image from "next/image";

type PortfolioDisplayProps = {
  portfolio: GenerateMarketingPortfolioOutput | null;
  isLoading: boolean;
  error: string | null;
};

export function PortfolioDisplay({ portfolio, isLoading, error }: PortfolioDisplayProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-5/6 mt-1" />
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Generation Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
                />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
