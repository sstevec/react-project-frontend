"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import CompetitionCreateModal from "@/components/competition/competition-create-modal";
import CompetitionActive from "@/components/competition/competition-active";
import CompetitionPaged from "@/components/competition/competition-paged";

export default function CompetitionMainPage() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [tab, setTab] = useState<"joined" | "held">("joined");
    const [refresh, setRefresh] = useState(false);

    const userId = typeof window !== "undefined" ? sessionStorage.getItem("gym-sync-id") ?? "" : "";

    const handleSearch = () => {
        if (searchKeyword.trim()) {
            window.location.href = `/competition/search/${encodeURIComponent(searchKeyword.trim())}`;
        }
    };

    return (
        <div className="w-[80%] min-w-[1200px] mx-auto py-6 space-y-10">
            {/* Top Section: Search + Add */}
            <div className="flex justify-between items-center gap-4">
                <Input
                    placeholder="Search competitions..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full max-w-md"
                />
                <Button onClick={() => setShowCreateModal(true)}>New Competition</Button>
            </div>


            {/* Middle Section: Active Competitions */}
            <CompetitionActive userId={userId} key={refresh ? "1" : "0"}/>

            <div className="space-y-8 border-t pt-6 border-gray-300">
                {/* Bottom Section: Joined / Held Tabs */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button variant={tab === "joined" ? "default" : "outline"}
                                onClick={() => setTab("joined")}>Joined</Button>
                        <Button variant={tab === "held" ? "default" : "outline"}
                                onClick={() => setTab("held")}>Held</Button>
                    </div>
                    <CompetitionPaged userId={userId} type={tab}/>
                </div>
            </div>

            {/* Create Modal */}
            <CompetitionCreateModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={() => {
                    setShowCreateModal(false);
                    setRefresh((r) => !r); // trigger active refresh
                }}
            />
        </div>
    );
}
