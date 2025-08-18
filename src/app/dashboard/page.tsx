
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page now acts as a router/dispatcher based on the user's role.
// The actual content for each dashboard is in its respective page.
export default function DashboardPage() {
    const { loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // The logic in DashboardLayout should handle the redirection.
        // This is a fallback.
        if (!loading) {
            router.replace('/dashboard/clients'); // Default redirect
        }
    }, [loading, router]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
            <p className="ml-4 text-muted-foreground">Carregando seu painel...</p>
        </div>
    );
}
