import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/app/types";

interface FollowInfoDialogProps {
  followers: IUser[];
  following: IUser[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FollowInfoDialog({ followers, following, open, setOpen }: FollowInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers & Following</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger value="followers" className="w-1/2">Followers</TabsTrigger>
            <TabsTrigger value="following" className="w-1/2">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="followers">
            <UserList users={followers} />
          </TabsContent>

          <TabsContent value="following">
            <UserList users={following} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function UserList({ users }: { users: IUser[] }) {
  return (
    <div className="space-y-3">
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{user.username}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  );
}
