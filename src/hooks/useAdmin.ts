"use client";

import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';

export function useAdmin(): boolean | null {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    // Create a stable reference to the admin role document.
    const adminDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'roles_admin', user.uid);
    }, [user, firestore]);
    
    // useDoc will now use this stable reference.
    const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

    useEffect(() => {
        if (isUserLoading) {
            setIsAdmin(null);
            return;
        }

        if (!user) {
            setIsAdmin(false);
            return;
        }

        if (isAdminDocLoading) {
            setIsAdmin(null);
        } else {
            setIsAdmin(adminDoc !== null);
        }

    }, [user, isUserLoading, adminDoc, isAdminDocLoading]);

    return isAdmin;
}
