"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import axios from "@/lib/axios";

export default function NavBar() {
    const router = useRouter();
    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        const userId = sessionStorage.getItem("gym-sync-id");
        if (!userId) return;

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get("/api/users/info");
                const profileUrl = res.data.profilePicUrl;
                setProfilePic(profileUrl || null);
            } catch (err) {
                console.error("Failed to fetch profile image:", err);
                setProfilePic(null);
            }
        };

        fetchUserProfile();
    }, []);


    return (
        <nav className="flex justify-between items-center px-4 pt-3 pb-5 bg-[var(--background)] h-20 min-w-[1000px]">
            {/* Left Side: Icon Placeholder */}
            <img src="/logo8.png" alt="Icon" className="h-16 w-30 object-contain cursor-pointer" onClick={() => router.push("/")}/>

            {/* Middle Section: Navigation Links */}
            <div className="space-x-14 ">
                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/">Dashboard</Link>
                </Button>
                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/friends">Friends</Link>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="btn-highlight w-30 h-12 cursor-pointer">Community</Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="center"
                        className="w-40"
                    >
                        <DropdownMenuItem onClick={() => router.push("/community/explore")}>
                            Explore
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/community/friends")}>
                            Friend Zone
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button className="btn-highlight w-30 h-12" asChild>
                    <Link href="/competition">Competition</Link>
                </Button>
            </div>

            {/* Right Side: Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={profilePic || "/globe.svg"} alt="Profile"/>
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
