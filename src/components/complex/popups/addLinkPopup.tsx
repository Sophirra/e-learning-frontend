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
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { toast } from "sonner";
import {addClassLink} from "@/api/apiCalls.ts";


export function AddLinkPopup(classId?: string) {
  const [link, setLink] = useState<string>("");
  const [isMeeting, setIsMeeting] = useState<boolean>(false);

  // function apiAddLink(link: string, isMeeting: boolean, classId: string) {
  //   //TODO: add link via api
  // }



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={!classId}>
          <icons.Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new link</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <div className={"flex flex-row gap-4"}>
            <Label className={"w-20"}>URL:</Label>
            <Input
              key={"link"}
              type={"url"}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className={"flex flex-row gap-4"}>
            <Label className={"w-20"}>Is meeting?:</Label>
            <Checkbox
              key={"isMeeting"}
              checked={isMeeting}
              onCheckedChange={(checked) => setIsMeeting(!!checked)}
            />
          </div>

          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                if (classId != null) {
                  addClassLink(classId,link,isMeeting);
                } else {
                  toast.error("Class id is not defined");
                }
              }}
              disabled={link.length == 0}
            >
              Upload
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
