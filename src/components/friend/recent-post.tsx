"use client";

import { useEffect, useState } from "react";
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

interface FriendRecentPostsProps {
    friendId: string;
}

export default function FriendRecentPosts({ friendId }: FriendRecentPostsProps) {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (!friendId) return;

        axios.get(`/api/posts/user/${friendId}`)
            .then(res => setPosts(res.data || []))
            .catch(err => console.error("Failed to load friend's recent posts", err));
    }, [friendId]);

    return (
        <Card className="w-full h-full p-4 space-y-4 card-dark overflow-y-auto no-scrollbar">
            {posts.length === 0 ? (
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
        </Card>
    );
}
