"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./globals.css";
import "../styles/custom-theme-based.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("gym-sync-jwt-token");

        if (!token && pathname !== "/login") {
            router.push("/login"); // Redirect to login if no token is found
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname]);

    if (pathname === "/login") {
        return (
            <html lang="en">
            <body style={{ margin: 0, padding: 0, height: "100vh", width: "100vw" }}>{children}</body>
            </html>
        );
    }

    return isAuthenticated ? (
        <html lang="en">
        <body style={{ margin: 0, padding: 0, height: "100vh", width: "100vw" }}>
        <Navbar />
        <main className="p-6">{children}</main>
        </body>
        </html>
    ) : null;
}
