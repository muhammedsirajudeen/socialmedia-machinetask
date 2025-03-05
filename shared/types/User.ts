export interface User {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    followers: string[]; // Array of user IDs
    following: string[]; // Array of user IDs
    createdAt: Date;
    updatedAt: Date;
    password: string;
}

export interface Comment {
    id: string;
    authorId: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    likes: string[]; // Array of user IDs who liked the comment
    likeCount: number;
    dislikeCount: number;
    dislikes: string[];
}
export interface Post {
    id: string;
    authorId: string;
    content: string;
    media?: { type: "image" | "video"; url: string }[];
    createdAt: Date;
    updatedAt?: Date;
    likes: string[];
    likeCount: number;
    dislikeCount: number;
    commentsCount: number;
    comments: Comment[];
}

