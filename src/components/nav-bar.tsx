"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function NavBar() {
    const router = useRouter();
    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserProfile() {
            const token = sessionStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("/api/users/info", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok && data.payload?.profilePicUrl) {
                    setProfilePic(data.payload.profilePicUrl);
                } else {
                    setProfilePic(null); // Use fallback image
                }
            } catch (error) {
                console.error("Failed to fetch profile image:", error);
            }
        }

        fetchUserProfile();
    }, []);

    return (
        <nav className="flex justify-between items-center px-4 pt-3 pb-5 bg-[var(--background)] h-20">
            {/* Left Side: Icon Placeholder */}
            <div className="text-xl font-bold">ICON</div>

            {/* Middle Section: Navigation Links */}
            <div className="space-x-14 ">
                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/">Dashboard</Link>
                </Button>
                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/friends">Friends</Link>
                </Button>
                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/community">Community</Link>
                </Button>
                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/competitions">Competition</Link>
                </Button>
            </div>

            {/* Right Side: Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={profilePic || "/globe.svg"} alt="Profile" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            sessionStorage.removeItem("gym-sync-jwt-token");
                            router.push("/login");
                        }}
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
}
