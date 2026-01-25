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
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { toast } from "sonner";

import { removeSpectator } from "@/api/api calls/apiSpectators.ts";

interface SpectatorConfirmDeletePopupProps {
  spectatorEmail: string;
  spectatorId: string;
  onRemoved?: () => void;
}

export function SpectatorConfirmDeletePopup({
  spectatorEmail,
  spectatorId,
  onRemoved,
}: SpectatorConfirmDeletePopupProps) {
  const handleRemove = async () => {
    try {
      await removeSpectator(spectatorId);
      toast.success(`Removed spectator ${spectatorEmail} successfully.`);
      if (onRemoved) onRemoved();
    } catch (err) {
      toast.error("Failed to remove spectator. Please try again.");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" variant="ghost">
          <icons.Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to remove {spectatorEmail} from your spectator list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleRemove}> Remove</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
