"use client";

import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useAlert} from "@/components/alert/alert-provider";
import {Bell, Check, MoreVertical, Plus, X} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

interface Friend {
    id: string;
    receiver: {
        id: string;
        name: string;
        email: string;
        profilePicUrl?: string;
    }
}

interface FriendRequest {
    id: string;
    sender: {
        name: string;
        email: string;
        profilePicUrl?: string;
    };
}

interface FriendListProps {
    onFriendSelect: (friendId: string) => void;
}

export default function FriendList({onFriendSelect}: FriendListProps) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showRequestsDialog, setShowRequestsDialog] = useState(false);
    const [newFriendEmail, setNewFriendEmail] = useState<string>("");
    const {showAlert} = useAlert();

    useEffect(() => {
        const uid = sessionStorage.getItem("gym-sync-id");
        if (!uid) return;
        setUserId(uid);

        axios
            .get(`/api/users/friends/${uid}`)
            .then(({data}) => {
                setFriends(data.payload)
                if(data.payload && data.payload.length > 0){
                    onFriendSelect(data.payload[0].receiver.id);
                }
            })
            .catch(() => showAlert("Failed to load friends", "error"));

        fetchFriendRequests(uid)
    }, []);

    const fetchFriendRequests = (uid: string) => {
        axios
            .get(`/api/users/friend-requests/${uid}`)
            .then(({data}) => {
                setFriendRequests(data.payload)
            })
            .catch(() => showAlert("Failed to load friend requests", "error"));
    };

    const handleAddFriend = () => {
        if (!newFriendEmail) return;
        axios
            .post(`/api/users/send-friend-request/${userId}`, {email: newFriendEmail})
            .then(() => {
                showAlert("Friend request sent!", "success");
                setShowAddDialog(false);
            })
            .catch(() => showAlert("Failed to send friend request", "error"));
    };

    const handleAcceptRequest = (requestId: string) => {
        axios.post(`/api/users/accept-friend-request/${requestId}`)
            .then(() => {
                showAlert("Friend request accepted!", "success");
                setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
            })
            .catch(() => showAlert("Failed to accept friend request", "error"));
    };

    const handleDenyRequest = (requestId: string) => {
        axios.post(`/api/users/remove-friend-request/${requestId}`)
            .then(() => {
                showAlert("Friend request denied!", "success");
                setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
            })
            .catch(() => showAlert("Failed to deny friend request", "error"));
    };

    const handleDeleteFriend = (friendId: string) => {
        if (!userId) return;

        if (!confirm("Are you sure you want to delete this friend?")) return;

        axios.post(`/api/users/remove-friendship`, {userId1: userId, userId2: friendId})
            .then(() => {
                showAlert("Friend deleted successfully", "success");
                setFriends((prev) => prev.filter((friend) => friend.receiver.id !== friendId));
            })
            .catch(() => showAlert("Failed to delete friend", "error"));
    };

    return (
        <Card className="w-full h-full p-6 flex flex-col min-w-[350px] card-inline">
            {/* Header Row */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Friends</h1>
                <div className="flex space-x-2">
                    <Button className="relative cursor-pointer hover:bg-white" size="icon" variant="outline"
                            onClick={() => setShowRequestsDialog(true)}>
                        <Bell/>
                        {friendRequests.length > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{friendRequests.length}</span>
                        )}
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setShowAddDialog(true)} className="cursor-pointer hover:bg-white">
                        <Plus/>
                    </Button>
                </div>
            </div>

            {/* Friend List */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 gap-1">
                {friends.length === 0 ? (
                    <p className="text-gray-500">You have no friends yet.</p>
                ) : (
                    friends.map((friend, index) => (
                        <Card
                            key={friend.id || `friend-${index}`}
                            className="h-[60px] flex items-center py-2 px-2 justify-center card-dark"
                            onClick={() => onFriendSelect(friend.receiver.id)}
                        >
                            <CardContent className="flex items-center justify-between w-full px-1">
                                <div className="flex items-center">
                                    <img
                                        src={friend.receiver.profilePicUrl || "/vercel.svg"}
                                        alt={friend.receiver.name}
                                        className="w-10 h-10 rounded-full object-cover mr-4"
                                    />
                                    <span>{friend.receiver.name}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <MoreVertical/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleDeleteFriend(friend.receiver.id)}>Delete
                                            Friend</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Friend Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a Friend</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter friend's email"
                        value={newFriendEmail}
                        onChange={(e) => setNewFriendEmail(e.target.value)}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAddFriend}>Add Friend</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Friend Requests Dialog */}
            <Dialog open={showRequestsDialog} onOpenChange={setShowRequestsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Friend Requests</DialogTitle>
                    </DialogHeader>
                    {friendRequests.length === 0 ? (
                        <p className="text-gray-500">No pending friend requests.</p>
                    ) : (
                        <div className="grid gap-1">
                            {friendRequests.map((request) => (
                                <Card key={request.id}
                                      className="h-[60px] flex items-center py-2 px-2 justify-center card-dark">
                                    <CardContent className="flex items-center justify-between w-full px-1">
                                        <div className="flex items-center">
                                            <img
                                                src={request.sender.profilePicUrl || "/globe.svg"}
                                                alt={request.sender.name}
                                                className="w-10 h-10 rounded-full object-cover mr-4"
                                            />
                                            <span>{request.sender.name}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button size="icon" variant="outline"
                                                    onClick={() => handleAcceptRequest(request.id)}><Check/></Button>
                                            <Button size="icon" variant="destructive"
                                                    onClick={() => handleDenyRequest(request.id)}><X/></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
