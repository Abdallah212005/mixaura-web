"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Image from "next/image";
import { useAuth, useFirestore, useStorage, useCollection, useMemoFirebase, type WithId } from "@/firebase";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@/components/portfolio-display";

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAdmin();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [editingItem, setEditingItem] = useState<WithId<PortfolioItem> | null>(null);
  
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WithId<PortfolioItem> | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);
  
  const portfolioSchema = z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
    imageFile: z.custom<FileList>().optional(),
    imageHint: z.string().min(1, "Image hint is required."),
  }).refine((data) => {
    if (!editingItem && (!data.imageFile || data.imageFile.length === 0)) {
        return false;
    }
    return true;
  }, {
      message: "Image is required when creating a new item.",
      path: ["imageFile"],
  }).refine((data) => {
      if (data.imageFile?.[0] && !data.imageFile[0].type.startsWith("image/")) {
          return false;
      }
      return true;
  }, {
      message: "File must be an image.",
      path: ["imageFile"],
  });

  type PortfolioFormValues = z.infer<typeof portfolioSchema>;

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      imageHint: "",
    },
  });

  useEffect(() => {
    form.trigger("imageFile");
  }, [editingItem, form]);

  const portfolioQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "portfolioItems");
  }, [firestore]);

  const { data: portfolioItems, isLoading: isLoadingPortfolio } = useCollection<PortfolioItem>(portfolioQuery);
  
  useEffect(() => {
    if (isAdmin === false) {
      router.push("/");
    } else if (isAdmin === true) {
      setIsCheckingAdmin(false);
    }
  }, [isAdmin, router]);

  const handleEditClick = (item: WithId<PortfolioItem>) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      description: item.description,
      imageHint: item.imageHint,
      imageFile: undefined,
    });
    editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    form.reset();
  };

  const handleDeleteClick = (item: WithId<PortfolioItem>) => {
    setItemToDelete(item);
    setShowDeleteAlert(true);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete || !storage || !firestore) return;
    
    setIsLoading(true);
    try {
        const docRef = doc(firestore, "portfolioItems", itemToDelete.id);
        await deleteDoc(docRef);

        const imageRef = ref(storage, itemToDelete.imageUrl);
        await deleteObject(imageRef);

        toast({ title: "Success", description: "Portfolio item deleted." });
    } catch (error: any) {
        console.error("Error deleting item:", error);
        toast({
            variant: "destructive",
            title: "Error deleting item",
            description: "Could not delete portfolio item. Check console for details.",
        });
    } finally {
        setIsLoading(false);
        setShowDeleteAlert(false);
        setItemToDelete(null);
    }
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    if (!auth.currentUser) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add a portfolio item." });
        return;
    }
    setIsLoading(true);

    try {
      let imageUrl = editingItem?.imageUrl;
      const imageFile = data.imageFile?.[0];

      if (imageFile) {
        if (editingItem?.imageUrl) {
          try {
            const oldImageRef = ref(storage, editingItem.imageUrl);
            await deleteObject(oldImageRef);
          } catch (e: any) {
            if (e.code !== 'storage/object-not-found') {
              console.warn("Could not delete old image, continuing.", e);
            }
          }
        }
        const newImageRef = ref(storage, `portfolio-images/${Date.now()}_${imageFile.name}`);
        const uploadTask = await uploadBytes(newImageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }
      
      if (!imageUrl) {
        toast({ variant: "destructive", title: "Image Error", description: "Image is required." });
        setIsLoading(false);
        return;
      }
      
      const portfolioData = {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
          imageHint: data.imageHint,
          adminId: auth.currentUser.uid,
      };

      if (editingItem) {
        const docRef = doc(firestore, "portfolioItems", editingItem.id);
        await updateDoc(docRef, portfolioData);
        toast({ title: "Portfolio Item Updated", description: `'${data.title}' has been updated.` });
      } else {
        await addDoc(collection(firestore, "portfolioItems"), portfolioData);
        toast({ title: "Portfolio Item Added", description: `'${data.title}' has been added to the portfolio.` });
      }
      
      form.reset();
      setEditingItem(null);

    } catch (error: any) {
        console.error("Error saving portfolio item:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not save portfolio item. Check console for details.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
                <div className="space-y-4 mb-12">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-2">
                                    <Skeleton className="h-16 w-28 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                    <div className="flex gap-2">
                                      <Skeleton className="h-10 w-10" />
                                      <Skeleton className="h-10 w-10" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                         <CardHeader>
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
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
        <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
          <div className="space-y-2 mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/60">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Manage your agency's portfolio content here.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Manage Portfolio</CardTitle>
                <CardDescription>View, edit, or delete existing portfolio items.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingPortfolio && [...Array(3)].map((_, i) => (
                        <TableRow key={`skl-${i}`}>
                          <TableCell><Skeleton className="h-16 w-28 rounded-md" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Skeleton className="h-9 w-9" />
                              <Skeleton className="h-9 w-9" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!isLoadingPortfolio && portfolioItems?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No portfolio items yet. Add one to get started!
                          </TableCell>
                        </TableRow>
                      )}
                      {portfolioItems?.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={112}
                              height={64}
                              className="rounded-md object-cover aspect-video"
                            />
                          </TableCell>
                          <TableCell className="font-medium align-top py-4">{item.title}</TableCell>
                          <TableCell className="hidden md:table-cell align-top py-4 text-muted-foreground">
                            <p className="line-clamp-2">{item.description}</p>
                          </TableCell>
                          <TableCell className="text-right align-top py-4">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(item)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card ref={editFormRef} className="lg:col-span-2 sticky top-24">
              <CardHeader>
                <CardTitle>{editingItem ? "Edit Portfolio Item" : "Add New Item"}</CardTitle>
                <CardDescription>{editingItem ? "Update the details for this item." : "Fill out the form to add a new project."}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <Textarea placeholder="Project description..." {...field} className="min-h-[100px]" />
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
                      {isLoading ? (editingItem ? "Saving..." : "Adding...") : (editingItem ? "Save Changes" : "Add Portfolio Item")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              {editingItem && (
                <CardFooter className="border-t pt-6">
                  <Button variant="outline" className="w-full" onClick={cancelEdit}>
                    Cancel Edit
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the portfolio item and its image from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
