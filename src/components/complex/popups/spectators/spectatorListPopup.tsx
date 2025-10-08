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
import {useEffect, useState} from "react";
import {getSpectators} from "@/api/apiCalls.ts";
import {toast} from "sonner";

export interface Spectator {
  id: string;
  email: string;
  status: boolean;
}

export function SpectatorListPopup() {
  const [spectators, setSpectators] = useState<Spectator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  /**
   * Fetches the list of spectators for the currently authenticated user.
   *
   * Uses the `/api/spectators` endpoint and updates component state.
   * Displays a toast notification on success or failure.
   */
  const fetchSpectators = async () => {
    try {
      setLoading(true);
      const data = await getSpectators();
      setSpectators(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSpectators([]);
        return;
      }
      console.error(" Error fetching spectators:", err);
      toast.error("Failed to load spectators. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpectators();
  }, []);

  const hasAny = spectators.length > 0;

  return (
      <Dialog>
        <DialogTrigger asChild>
          <MenubarItem onSelect={(e) => e.preventDefault()}>
            Spectators
          </MenubarItem>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your spectators</DialogTitle>
            <DialogDescription>
              {loading
                  ? "Loading spectators..."
                  : hasAny
                      ? "These are your spectators."
                      : "No spectators found."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {!loading &&
                spectators.map((spectator) => (
                    <div key={spectator.id} className="flex items-center gap-3">
                      <Label className="text-muted-foreground font-semibold" htmlFor={`email-${spectator.email}`}>
                        {spectator.email}
                      </Label>
                      {spectator.status && (
                          <span className="text-xs text-muted-foreground">({spectator.status})</span>
                      )}
                      <div className="ml-auto">
                        <SpectatorConfirmDeletePopup
                            spectatorEmail={spectator.email}
                            spectatorId={spectator.id}
                            onRemoved={fetchSpectators}
                        />
                      </div>
                    </div>
                ))}
          </div>

          <DialogFooter className="flex flex-row gap-4 sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            <SpectatorSendInvitePopup onInvited={fetchSpectators} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
