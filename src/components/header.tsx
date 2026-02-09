"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { useAdmin } from "@/hooks/useAdmin";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User as UserIcon, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const isAdmin = useAdmin();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (email?: string | null) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <header className="fixed top-0 left-0 right-0 p-4 md:p-6 z-10 backdrop-blur-sm bg-background/30 animate-fade-in" style={{ animationDuration: '1s' }}>
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          {isUserLoading ? (
            <div className="h-10 w-24 rounded-md animate-pulse bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="btn-animated bg-accent hover:bg-accent/90">
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
