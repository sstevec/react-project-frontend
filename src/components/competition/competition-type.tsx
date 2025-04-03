export interface Competition {
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
    objective: string;
    rankMethod: "ascending" | "descending";
    access: "public" | "friend_only";
    startDate: string;
    endDate: string;
    createdAt: string;
    creator?: {
        name: string;
        profilePicUrl: string | null;
    };
}