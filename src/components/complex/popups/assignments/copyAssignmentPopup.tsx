import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@radix-ui/react-label";

export function CopyAssignmentPopup() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Copy assignment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose assignment from library</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className={"flex flex-col gap-4 pt-2"}>
          <Label>Here will be assignments library</Label>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant={"outline"} onSelect={() => {}}>
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
