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
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

import { uploadExerciseSolution } from "@/api/api calls/apiExercises.ts";

export function AddSolutionFilePopup({
  setChosenFile,
  exerciseId,
}: {
  setChosenFile?: (file: FileBrief) => void;
  exerciseId: string;
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

      const result = await uploadExerciseSolution(exerciseId, selectedFile);

      setChosenFile && setChosenFile(result);

      toast.success(`File "${selectedFile.name}" was uploaded successfully.`);

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
        <Button variant="ghost" className="flex items-center gap-2">
          Add
          <icons.Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload solution</DialogTitle>
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
