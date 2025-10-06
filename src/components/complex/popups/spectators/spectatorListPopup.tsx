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
import { MenubarItem } from "@/components/ui/menubar.tsx";
import { SpectatorSendInvitePopup } from "@/components/complex/popups/spectators/spectatorSendInvitePopup.tsx";
import { SpectatorConfirmDeletePopup } from "@/components/complex/popups/spectators/spectatorConfirmDeletePopup.tsx";
import { Label } from "@radix-ui/react-label";

interface Spectator {
  name: string;
  email: string;
  active: boolean;
}

export function SpectatorListPopup() {
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
            {spectatorList && spectatorList.length == 0
              ? "No active spectators."
              : "These are your active spectators."}
          </DialogDescription>
        </DialogHeader>
        <div>
          {spectatorList &&
            spectatorList.map(
              (spectator: Spectator) =>
                spectator.active && (
                  <div
                    key={spectator.email}
                    className="flex items-center gap-2"
                  >
                    <Label
                      className="text-muted-foreground font-semibold"
                      htmlFor="name"
                    >
                      {spectator.name}
                    </Label>
                    <Label className="text-muted-foreground" htmlFor="email">
                      {spectator.email}
                    </Label>
                    <SpectatorConfirmDeletePopup
                      spectatorName={spectator.name}
                    />
                  </div>
                ),
            )}
        </div>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <SpectatorSendInvitePopup />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
