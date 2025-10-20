import React, { useState } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { uploadUserFile } from "@/api/apiCalls.ts";
import { toast } from "sonner";

export function UploadFilePopup({
                                    setOpenedPopup,
                                }: {
    setOpenedPopup: (val: PopupType) => void;
}) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    /**
     * Handles file input change event.
     * Stores the selected file in local state.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
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
            const result = await toast.promise(uploadUserFile(selectedFile), {
                loading: "Uploading file...",
                success: (res) => `File uploaded successfully: ${res.name}`,
                error: "Upload failed. Please try again.",
            });

            // Optional: close popup after success
            setTimeout(() => setOpenedPopup("addAssignment"), 1000);
        } finally {
            setUploading(false);
        }
    };

    return (
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"}>Upload new file</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Upload new file</DialogTitle>
                <DialogDescription>
                    Select a file from your device and upload it to your account.
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
                    <Button
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
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
