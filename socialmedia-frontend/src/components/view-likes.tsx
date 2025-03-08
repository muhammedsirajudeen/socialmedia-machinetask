import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/app/types";

interface ViewLikesInterface {
  likes: IUser[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ViewLikes({ likes, open, setOpen }: ViewLikesInterface) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {likes.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
