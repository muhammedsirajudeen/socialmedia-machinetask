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
    password:string;
}
  