import React from "react";
import { Button } from "@/components/ui/button";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import type { FileData } from "@/api/types.ts";

interface DownloadButtonProps {
    file: FileData;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ file }) => {
    if (!file) return null;
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const cleanPath = file.relativePath.replace(/^\//, "");
    const fileUrl = `${apiUrl}/${cleanPath}`;
    return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost">
                <icons.Download />
                {"Download"}
            </Button>
        </a>
    );
};
