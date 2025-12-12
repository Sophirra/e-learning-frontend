import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog.tsx";

import { apiSpectators } from "@/api/api calls/apiSpectators.ts";

/**
 * Popup dialog that allows a student to invite a new spectator by email.
 *
 * Uses the `/api/spectators` POST endpoint.
 * Displays toast messages based on server responses.
 */

export function SpectatorSendInvitePopup({
  onInvited,
}: {
  onInvited?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSendInvite = async () => {
    if (!email.trim()) {
      toast.error("Please provide an email address.");
      return;
    }

    try {
      setLoading(true);
      await apiSpectators(email.trim());
      toast.success("Spectator invitation sent successfully!");
      setEmail("");
      onInvited?.();
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to send spectator invite:", error);
      const message =
        error.response?.data ||
        "An unexpected error occurred. Please try again later.";

      switch (error.response?.status) {
        case 400:
          toast.error(message || "Invalid email or request data.");
          break;
        case 401:
          toast.error("You must be logged in to send invitations.");
          break;
        case 403:
          toast.error("Only students can invite spectators.");
          break;
        case 404:
          toast.error(
            message || "Spectator not found or relation already exists.",
          );
          break;
        case 409:
          toast.error(message || "Invite already exists.");
          break;
        case 500:
          toast.error(
            message || "Something went wrong while creating the invite.",
          );
          break;
        default:
          toast.error(message);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Invite new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite new spectator</DialogTitle>
          <DialogDescription>
            Invite someone to become your Spectator they ll be able to follow
            your learning progress.
          </DialogDescription>
        </DialogHeader>
        <Label>
          <span>Spectator email:</span>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Label>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSendInvite} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
