"use server";

import { generateMarketingPortfolio, GenerateMarketingPortfolioInput, GenerateMarketingPortfolioOutput } from "@/ai/flows/generate-marketing-portfolio";

export async function handleGeneratePortfolio(
  data: GenerateMarketingPortfolioInput
): Promise<{ portfolio: GenerateMarketingPortfolioOutput | null; error: string | null }> {
  try {
    const portfolio = await generateMarketingPortfolio(data);
    if (!portfolio || !portfolio.portfolioItems || portfolio.portfolioItems.length === 0) {
      return { portfolio: null, error: "Failed to generate portfolio. The AI returned an empty result." };
    }
    return { portfolio, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { portfolio: null, error: `An unexpected error occurred while generating the portfolio: ${errorMessage}. Please try again.` };
  }
}
