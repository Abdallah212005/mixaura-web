"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth, useFirestore, useAdmin, useStorage } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  imageFile: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Image is required.")
    .refine((files) => files?.[0]?.type.startsWith("image/"), "Must be an image file."),
  imageHint: z.string().min(1, "Image hint is required."),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAdmin();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      imageHint: "",
    },
  });

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/dashboard");
    } else if (isAdmin === true) {
      setIsCheckingAdmin(false);
    }
  }, [isAdmin, router]);


  const onSubmit = async (data: PortfolioFormValues) => {
    if (!auth.currentUser) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add a portfolio item." });
        return;
    }
    setIsLoading(true);
    try {
        const imageFile = data.imageFile[0];
        const storageRef = ref(storage, `portfolio-images/${Date.now()}_${imageFile.name}`);

        const uploadTask = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadTask.ref);

        await addDoc(collection(firestore, "portfolioItems"), {
            title: data.title,
            description: data.description,
            imageUrl: imageUrl,
            imageHint: data.imageHint,
            adminId: auth.currentUser.uid,
        });
        toast({
            title: "Portfolio Item Added",
            description: `${data.title} has been added to the portfolio.`,
        });
        form.reset();
    } catch (error: any) {
        console.error("Error adding portfolio item:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not add portfolio item. Check console for details.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
            <div className="w-full max-w-2xl space-y-4">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Card className="w-full bg-card/70 backdrop-blur-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
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
          <Card className="w-full max-w-2xl bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription>Add a new item to the portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Project description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                            onChange={(e) => onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="imageHint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Hint</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. abstract tech" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full btn-animated" disabled={isLoading}>
                    {isLoading ? "Adding Item..." : "Add Portfolio Item"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
