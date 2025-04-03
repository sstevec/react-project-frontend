"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import axios from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Upload } from "lucide-react";

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

export default function FriendZonePage() {
    const [content, setContent] = useState("");
    const [access, setAccess] = useState<"public" | "friend_only">("friend_only");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const mountedRef = useRef(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        if (!content.trim()) return;

        const formData = new FormData();
        formData.append("content", content);
        formData.append("access", access);
        if (imageFile) {
            formData.append("postImage", imageFile);
        }

        try {
            await axios.post("/api/posts/create", formData);

            // Reset form and reload
            setContent("");
            setAccess("friend_only");
            setImageFile(null);
            setImagePreview(null);
            setPage(1);
            setPosts([]);
            setHasMore(true);
            fetchPosts(1);
        } catch (err) {
            console.error("Failed to create post:", err);
            setHasMore(false);
        }
    };

    const fetchPosts = useCallback(
        async (targetPage: number = page) => {
            if (loading || !hasMore) return;
            setLoading(true);

            try {
                const { data } = await axios.get("/api/posts/friends", {
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
                console.error("Failed to load posts:", err);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [page, loading, hasMore]
    );

    // Initial Load (only once)
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        setPage(1);
        setPosts([]);
        setHasMore(true);
        fetchPosts(1);
    }, []);

    // Infinite Scroll Observer
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
        <div className="mx-auto py-6 w-[60%] min-w-[632px] max-w-[800px] space-y-6">
            {/* New Post Card */}
            <Card className="p-4 space-y-4">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                />

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto rounded-lg object-contain"
                    />
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                        </Button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">Friend Only</label>
                        <Checkbox
                            checked={access === "friend_only"}
                            onCheckedChange={(checked) =>
                                setAccess(checked ? "friend_only" : "public")
                            }
                        />
                        <Button size="sm" onClick={handlePublish} disabled={!content.trim()}>
                            Publish
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Friend Posts Feed */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <Card key={post.id} className="p-4 space-y-2">
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
                                className="w-full rounded-lg object-contain"
                            />
                        )}
                    </Card>
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
                <div ref={observerRef} className="h-10 flex justify-center items-center">
                    <span className="text-muted-foreground text-sm">Loading more...</span>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center text-muted-foreground text-sm">
                    You've reached the end!
                </div>
            )}
        </div>
    );
}
