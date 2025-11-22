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
import { toast } from "sonner";

export function CopyExercisePopup({
  classId,
  closeParent,
}: {
  classId: string;
  closeParent: (open: false) => void;
}) {
  function addExercise() {
    try {
      //TODO: backend magic - copy exercise to chosen class
      toast.success("Exercise copied successfully");
      closeParent(false);
    } catch (e: any) {
      toast.error("Failed to copy exercise: " + e.message);
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Copy exercise</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose exercise from library</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className={"flex flex-col gap-4 pt-2"}>
          <Label>Here will be exercise library</Label>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant={"outline"} onClick={() => addExercise()}>
              Copy
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
