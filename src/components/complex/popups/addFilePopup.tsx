import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { PopupType } from "@/components/complex/popups/assignments/addTaskPopup.tsx";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export function AddFilePopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <icons.Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle>Add new file to class</DialogTitle>
      </DialogHeader>
      <div className={"flex flex-col gap-4 pt-2"}>
        <Button variant={"outline"}>Choose from library</Button>
        <Button
          variant={"outline"}
          onClick={() => setOpenedPopup("uploadFile")}
        >
          Upload new file
        </Button>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <Button onClick={() => setOpenedPopup("addTask")}>Cancel</Button>
          <Button
            variant={"outline"}
            onSelect={() => {
              setOpenedPopup("addTask");
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
