import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";

export function SpectatorSendInvitePopup() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Invite new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite new spectator</DialogTitle>
          <DialogDescription>
            Invite someone to become your Spectator – they’ll be able to follow
            your learning progress.
          </DialogDescription>
        </DialogHeader>
        <Label>
          <span>Spectator email:</span>
          <Input type="email" />
        </Label>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button> Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
