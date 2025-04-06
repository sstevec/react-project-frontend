"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import axios from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface User {
    id: string;
    name: string;
    profilePicUrl: string | null;
}

interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    access: string;
    createdAt: string;
    user: User;
}

export default function ExplorePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const mountedRef = useRef(false);

    const fetchPosts = useCallback(
        async (targetPage: number = page) => {
            if (loading || !hasMore) return;
            setLoading(true);

            try {
                const { data } = await axios.get("/api/posts/public", {
                    params: { page: targetPage },
                });

                if (Array.isArray(data.payload)) {
                    setPosts((prev) =>
                        targetPage === 1 ? data.payload : [...prev, ...data.payload]
                    );
                    setHasMore(data.payload.length === 10);
                    setPage(targetPage + 1);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [page, loading, hasMore]
    );

    // Initial load (once)
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        setPage(1);
        setPosts([]);
        setHasMore(true);
        fetchPosts(1);
    }, []);

    // Infinite scroll
    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchPosts(page);
                }
            },
            { rootMargin: "300px" }
        );

        const currentRef = observerRef.current;
        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
    }, [fetchPosts, hasMore, page]);

    return (
        <div className="w-[80%] mx-auto py-6">
            <h1 className="text-2xl font-semibold mb-6">Explore Community</h1>

            {/* Masonry-style column layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {posts.map((post) => (
                    <Card key={post.id} className="break-inside-avoid p-4 space-y-2 mb-6 card-dark">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={post.user.profilePicUrl || "/globe.svg"} />
                                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">{post.user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(post.createdAt), {
                                        addSuffix: true,
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm whitespace-pre-line">{post.content}</div>

                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt="Post image"
                                className="w-full rounded-lg object-cover"
                            />
                        )}
                    </Card>
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
                <div ref={observerRef} className="h-10 mt-10 flex justify-center items-center">
                    <span className="text-muted-foreground text-sm">Loading more...</span>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center text-muted-foreground mt-10 text-sm">
                    You've reached the end!
                </div>
            )}
        </div>
    );
}
