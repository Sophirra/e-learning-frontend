import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@radix-ui/react-label";
import { QuizGallery } from "@/features/quiz/quizGallery.tsx";

export function CopyQuizPopup() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Copy quiz</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose quiz from library</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <Label>Here will be quiz library</Label>
          {/*<QuizGallery />*/}
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
