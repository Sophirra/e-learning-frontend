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

export function SpectatorConfirmDeletePopup({
  spectatorName,
}: {
  spectatorName: string;
}) {
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
            You are about to remove {spectatorName} from your spectator list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button> Remove</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
