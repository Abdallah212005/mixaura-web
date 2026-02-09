"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Loader2 } from "lucide-react";
import type { GenerateMarketingPortfolioOutput } from "@/ai/flows/generate-marketing-portfolio";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { handleGeneratePortfolio } from "@/app/actions";
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  industry: z.string().min(3, { message: "Industry must be at least 3 characters." }).max(50),
  marketingStrategy: z.string().min(10, { message: "Marketing strategy must be at least 10 characters." }).max(200),
});

type PortfolioGeneratorProps = {
  setIsLoading: (isLoading: boolean) => void;
  setPortfolio: (portfolio: GenerateMarketingPortfolioOutput | null) => void;
  setError: (error: string | null) => void;
  setIsGenerated: (isGenerated: boolean) => void;
  isLoading: boolean;
};

export function PortfolioGenerator({
  setIsLoading,
  setPortfolio,
  setError,
  setIsGenerated,
  isLoading,
}: PortfolioGeneratorProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      marketingStrategy: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setPortfolio(null);
    setIsGenerated(true);
    setOpen(false);

    const result = await handleGeneratePortfolio(values);

    if (result.error) {
      setError(result.error);
      toast({
        title: "Generation Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setPortfolio(result.portfolio);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="btn-animated bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-base">
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Your AI Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Describe Your Vision</DialogTitle>
          <DialogDescription>
            Tell us about your business, and our AI will generate a sample marketing portfolio for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sustainable Fashion, SaaS, Local Coffee Shop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketingStrategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Marketing Goal or Idea</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 'A viral social media campaign on TikTok', 'A content marketing strategy to attract B2B clients'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Portfolio"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
