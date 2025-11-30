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
import { toast } from "sonner";
import { LoadingTile } from "@/components/complex/tiles/loadingTile.tsx";

export function ClassPaymentPopup({
  onSuccess,
  disabled,
}: {
  onSuccess: () => void;
  disabled: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} disabled={disabled}>
          Confirm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Class payment</DialogTitle>
          <DialogDescription>
            Please pay for you class to finish the process.
          </DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <LoadingTile text={"Here will be payment options"} />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                toast.success("Mockup payment successful");
                onSuccess();
              }}
            >
              Pay
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
