"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "@/lib/axios";
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

interface MyRecentPostsProps {
    userId: string;
}

export default function MyRecentPosts({ userId }: MyRecentPostsProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    const loadMorePosts = useCallback(() => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        axios.get(`/api/posts/user/${userId}?page=${page}`)
            .then(res => {
                const newPosts = res.data || [];
                setPosts(prev => [...prev, ...newPosts]);
                setHasMore(newPosts.length === 3); // if less than 3, no more data
                setPage(prev => prev + 1);
            })
            .catch(err => console.error("Failed to load posts", err))
            .finally(() => setIsLoading(false));
    }, [userId, page, isLoading, hasMore]);

    useEffect(() => {
        if (!userId) return;
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [userId]);

    // Initial load
    useEffect(() => {
        if (!userId || page !== 1) return;
        loadMorePosts();
    }, [userId, page, loadMorePosts]);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (!container || isLoading || !hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMorePosts();
            }
        };

        const container = containerRef.current;
        container?.addEventListener("scroll", handleScroll);

        return () => container?.removeEventListener("scroll", handleScroll);
    }, [loadMorePosts, isLoading, hasMore]);

    return (
        <Card
            ref={containerRef}
            className="w-full h-full p-4 space-y-4 card-dark overflow-y-auto no-scrollbar"
        >
            {posts.length === 0 && !isLoading ? (
                <div className="text-sm text-muted-foreground italic">No recent posts available.</div>
            ) : (
                posts.map(post => (
                    <Card key={post.id} className="px-6 py-4 space-y-2 card-light">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm whitespace-pre-line">{post.content}</div>

                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt="Post"
                                className="w-full h-auto max-h-80 object-contain rounded-lg"
                            />
                        )}
                    </Card>
                ))
            )}

            {isLoading && (
                <div className="text-sm text-muted-foreground italic text-center">Loading...</div>
            )}
        </Card>
    );
}
