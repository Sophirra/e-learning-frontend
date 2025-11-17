import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import type { FileData } from "@/api/types.ts";
import { deleteFile } from "@/api/apiCalls.ts";
import {toast} from "sonner";

export function DeleteFilePopup({ file }: { file: FileData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <icons.Trash />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deleting {file.fileName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {file.fileName}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant={"outline"}
            onClick={async () => {
              try {
                await deleteFile(file.id);

                 toast.success("Plik usunięty");
              } catch (err) {
                 toast.error("Nie udało się usunąć pliku");
              }
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
