"use client";

import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import NavBar from "@/components/nav-bar";
import "./globals.css";
import "../styles/custom-theme-based.css"
import {AlertProvider} from "@/components/alert/alert-provider";

export default function RootLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = sessionStorage.getItem("gym-sync-jwt-token");

        let isAuthenticated = false;
        if(!token || token === "" || token === "undefined") {
        } else {
            isAuthenticated = true
        }

        if (!isAuthenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [pathname]);

    if (pathname === "/login") {
        return (
            <html lang="en">
            <body style={{margin: 0, padding: 0, height: "100vh", width: "100vw"}}>
            <AlertProvider>
                {children}
            </AlertProvider>
            </body>
            </html>
        );
    }

    return (
        <html lang="en" className="h-full">
        <body className="h-full m-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full w-full">
            <NavBar/>
            <AlertProvider>
                <main className="flex-1 overflow-auto">{children}</main>
            </AlertProvider>
        </div>
        </body>
        </html>
    );
}
