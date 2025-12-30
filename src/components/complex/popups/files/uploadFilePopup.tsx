import React, { useState } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import type { FileBrief } from "@/types.ts";
import { uploadUserFile } from "@/api/api calls/apiFiles.ts";

export function UploadFilePopup({
  setChosenFile,
}: {
  setChosenFile?: (file: FileBrief) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * Handles file input change event.
   * Stores the selected file in local state.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || undefined);
  };

  /**
   * Uploads the selected file using the backend API.
   * Displays toast notifications via sonner on success or error.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file before uploading.");
      return;
    }

    try {
      setUploading(true);
      // toast.promise automatycznie obsługuje loading / success / error
      // const result = await toast.promise(uploadUserFile(selectedFile), {
      //   loading: "Uploading file...",
      //   success: (res) => `File uploaded successfully: ${res.name}`,
      //   error: "Upload failed. Please try again.",
      // });
      const result = await uploadUserFile(selectedFile);
      setChosenFile && setChosenFile(result);
      setOpen(false);
    } catch (e: any) {
      toast.error("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={"outline"}>Upload new file</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new file</DialogTitle>
          <DialogDescription>
            Select a file from your device and upload it to your account. Max
            size: 50MB.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <Label htmlFor="fileInput">Choose file:</Label>
          <Input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <DialogFooter className="flex flex-row gap-4 sm:justify-center pt-2">
            <DialogClose>
              <Button disabled={uploading}>Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="outline"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
