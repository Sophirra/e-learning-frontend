import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { MenubarItem } from "@/components/ui/menubar.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { SpectatorSendInvite } from "@/components/complex/spectatorSendInvite";

interface Spectator {
  name: string;
  email: string;
  active: boolean;
}

export function SpectatorDialog() {
  let spectatorList: Spectator[] = [
    {
      name: "John Doe",
      email: "example@hotmail.com",
      active: true,
    },
  ];
  return (
    <Dialog>
      <DialogTrigger>
        <MenubarItem onSelect={(e) => e.preventDefault()}>
          Spectators
        </MenubarItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your spectators</DialogTitle>
          <DialogDescription>
            These are your active spectators.
          </DialogDescription>
        </DialogHeader>
        <div>
          {spectatorList.map(
            (spectator: Spectator) =>
              spectator.active && (
                <div key={spectator.email} className="flex items-center gap-2">
                  {spectator.name}
                  <Button size="icon" variant="ghost">
                    <icons.Trash />
                  </Button>
                </div>
              ),
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <SpectatorSendInvite />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
