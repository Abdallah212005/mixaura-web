'use server';

/**
 * @fileOverview A marketing portfolio generator AI agent.
 *
 * - generateMarketingPortfolio - A function that handles the marketing portfolio generation process.
 * - GenerateMarketingPortfolioInput - The input type for the generateMarketingPortfolio function.
 * - GenerateMarketingPortfolioOutput - The return type for the generateMarketingPortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingPortfolioInputSchema = z.object({
  marketingStrategy: z
    .string()
    .describe('The marketing strategy to generate a portfolio for.'),
  industry: z.string().describe('The industry the marketing strategy is for.'),
});
export type GenerateMarketingPortfolioInput = z.infer<
  typeof GenerateMarketingPortfolioInputSchema
>;

const GenerateMarketingPortfolioOutputSchema = z.object({
  portfolioItems: z.array(
    z.object({
      title: z.string().describe('The title of the portfolio item.'),
      description: z.string().describe('A description of the portfolio item.'),
      imageUrl: z
        .string()
        .describe(
          'The URL of the image for the portfolio item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'        ),
    })
  ),
});
export type GenerateMarketingPortfolioOutput = z.infer<
  typeof GenerateMarketingPortfolioOutputSchema
>;

export async function generateMarketingPortfolio(
  input: GenerateMarketingPortfolioInput
): Promise<GenerateMarketingPortfolioOutput> {
  return generateMarketingPortfolioFlow(input);
}

const portfolioItemSchema = z.object({
  title: z.string().describe('The title of the portfolio item.'),
  description: z.string().describe('A description of the portfolio item.'),
});

const prompt = ai.definePrompt({
  name: 'generateMarketingPortfolioPrompt',
  input: {schema: GenerateMarketingPortfolioInputSchema},
  output: {schema: GenerateMarketingPortfolioOutputSchema},
  prompt: `You are an expert marketing portfolio generator.  You are creative and innovative, and you are able to generate realistic marketing portfolio items given a marketing strategy and industry.

  Generate 3 portfolio items for the following marketing strategy and industry:

  Marketing Strategy: {{{marketingStrategy}}}
  Industry: {{{industry}}}

  Each portfolio item should have a title, description, and image URL. The image URL should be a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'. Use the googleai/imagen-4.0-fast-generate-001 model to generate the images.

  Here is an example of the format you should use:
  {
    "portfolioItems": [
      {
        "title": "Example Title",
        "description": "Example Description",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+r8JxqFI050AAAQJAA9+cZyJAAAAABJRU5ErkJggg=="
      },
      {
        "title": "Example Title 2",
        "description": "Example Description 2",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+r8JxqFI050AAAQJAA9+cZyJAAAAABJRU5ErkJggg=="
      },
      {
        "title": "Example Title 3",
        "description": "Example Description 3",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+r8JxqFI050AAAQJAA9+cZyJAAAAABJRU5ErkJggg=="
      }
    ]
  }

  Make sure the image URLs are valid and the images are relevant to the portfolio item.
  `,
});

const generateMarketingPortfolioFlow = ai.defineFlow(
  {
    name: 'generateMarketingPortfolioFlow',
    inputSchema: GenerateMarketingPortfolioInputSchema,
    outputSchema: GenerateMarketingPortfolioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Ensure that images are generated for each portfolio item
    if (output && output.portfolioItems) {
      for (const item of output.portfolioItems) {
        try {
          const {media} = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `Generate an image for a portfolio item with the title '${item.title}' and description '${item.description}'.`,
          });
          if (media) {
            item.imageUrl = media.url;
          } else {
            console.warn('Failed to generate image for portfolio item:', item);
          }
        } catch (error) {
          console.error('Error generating image:', error);
        }
      }
    }

    return output!;
  }
);
