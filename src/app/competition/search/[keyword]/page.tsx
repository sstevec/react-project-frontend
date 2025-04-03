"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface User {
    name: string;
}

interface Competition {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string | null;
    creator: User;
}

const randomColors = [
    "bg-red-200", "bg-green-200", "bg-blue-200",
    "bg-yellow-200", "bg-purple-200", "bg-pink-200"
];

export default function CompetitionSearchPage() {
    const router = useRouter();
    const params = useParams();
    const initialKeyword = decodeURIComponent(params.keyword as string);

    const [keyword, setKeyword] = useState(initialKeyword || "");
    const [results, setResults] = useState<Competition[]>([]);
    const [page, setPage] = useState(1);
    const [totalFetched, setTotalFetched] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchResults = async () => {
        if (!initialKeyword.trim()) return;
        setLoading(true);
        try {
            const { data } = await axios.get("/api/competitions/search/match", {
                params: { keyword: initialKeyword, page },
            });
            setResults(data || []);
            setTotalFetched(data.length);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [page, initialKeyword]);

    const handleSearch = () => {
        if (keyword.trim()) {
            router.push(`/competitions/search/${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <div className="w-[70%] max-w-[1000px] min-w-[800px] mx-auto py-6 space-y-6">
            {/* Title */}
            <h1 className="text-2xl font-bold">Search Results</h1>

            {/* Search Bar */}
            <div className="flex gap-2">
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter keyword..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <Button onClick={handleSearch} disabled={!keyword.trim()}>
                    Search
                </Button>
            </div>

            {/* Result List */}
            <div className="space-y-4 w-full">
                {results.map((comp, index) => (
                    <Card
                        key={comp.id}
                        className="group w-full cursor-pointer overflow-hidden hover:shadow-md p-0 hover:scale-101"
                        onClick={() => router.push(`/competition/${comp.id}`)}
                    >
                        <div className="grid h-[200px] grid-cols-[40%_minmax(30%,300px)] gap-4 w-full justify-between">
                            {/* Text Content */}
                            <div className="flex h-full flex-col justify-between px-6 pt-6 pb-2">
                                <div className="space-y-2">
                                    <h2 className="line-clamp-1 text-xl font-semibold">{comp.title}</h2>
                                    <p className="line-clamp-2 text-muted-foreground">
                                        {comp.description}
                                    </p>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p>
                                        {format(new Date(comp.startDate), "yyyy-MM-dd")} → {format(new Date(comp.endDate), "yyyy-MM-dd")}
                                    </p>
                                    <p className="text-muted-foreground">By {comp.creator.name}</p>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative h-full w-full overflow-hidden p-0 right-0">
                                {comp.imageUrl ? (
                                    <img
                                        src={comp.imageUrl}
                                        alt="Competition"
                                        className="size-full object-cover transition-all"
                                    />
                                ) : (
                                    <div
                                        className={`size-full ${randomColors[index % randomColors.length]}`}
                                    />
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {results.length > 0 && (
                <div className="flex justify-center gap-4 items-center mt-6">
                    <Button
                        variant="outline"
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                        Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {page}</span>
                    <Button
                        variant="outline"
                        disabled={totalFetched < 10 || loading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
