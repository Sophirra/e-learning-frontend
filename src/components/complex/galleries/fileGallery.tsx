import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import type { FileBrief, FileData, FileFilter } from "@/types.ts";
import { UploadFilePopup } from "@/components/complex/popups/files/uploadFilePopup.tsx";
import { formatDate } from "date-fns";
import { EditFilePopup } from "@/components/complex/popups/files/editFilePopup.tsx";
import { DeleteFilePopup } from "@/components/complex/popups/files/deleteFilePopup.tsx";
import { DownloadButton } from "@/components/ui/downloadButton.tsx";
import {
  getFiles,
  getUserFileExtensions,
  getUserFileOwners,
  getUserFileTags,
} from "@/api/api calls/apiFiles.ts";
import { toast } from "sonner";

type SortField = "title" | "dateCreated" | "sharedBy" | "course";
type SortOrder = "none" | "asc" | "desc";

const DEFAULT_PAGE_SIZE = 7;

export function FileGallery({
  courseId,
  studentId,
  setSelectedFileParent,
  slim,
}: {
  courseId?: string;
  studentId?: string;
  setSelectedFileParent?: (file: FileBrief) => void;
  slim?: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField | null;
    order: SortOrder;
  }>({ field: "dateCreated", order: "desc" });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<SelectableItem[]>(
    [],
  );
  const [selectedType, setSelectedType] = useState<SelectableItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<SelectableItem[]>([]);

  const [availableOwners, setAvailableOwners] = useState<SelectableItem[]>([]);
  const [availableExtensions, setAvailableExtensions] = useState<
    SelectableItem[]
  >([]);
  const [availableTags, setAvailableTags] = useState<SelectableItem[]>([]);

  // stan paginacji
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadFilters() {
      try {
        const owners = await getUserFileOwners();
        setAvailableOwners(
          owners.map((o) => ({ name: `${o.name} ${o.surname}`, value: o.id })),
        );

        const extensions = await getUserFileExtensions();
        setAvailableExtensions(
          extensions.map((ext) => ({ name: ext, value: ext.toLowerCase() })),
        );

        const tags = await getUserFileTags();
        setAvailableTags(
          tags.map((t) => ({ name: t.name, value: t.id })), // zakładam że masz FileTag { id, name }
        );
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    }

    loadFilters();
  }, []);

  const [activeFilters, setActiveFilters] = useState<FileFilter>({
    createdBy: [],
    type: [],
    tags: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  } as FileFilter);

  const handleSort = (field: SortField) => {
    setSortConfig((current) => {
      if (current.field !== field) return { field, order: "asc" };
      if (current.order === "none") return { field, order: "asc" };
      if (current.order === "asc") return { field, order: "desc" };
      return { field: null, order: "none" };
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles(
    overrideFilters?: Partial<FileFilter>,
    overridePage?: number,
  ) {
    setLoading(true);
    try {
      const nextPage = overridePage ?? page;

      const mergedFilters: FileFilter = {
        ...activeFilters, // stan filtrów
        ...overrideFilters, // ewentualne nadpisania
        ...(studentId ? { studentId } : {}), // <- props
        ...(courseId ? { courseId } : {}), // <- props
        page: nextPage,
        pageSize,
      };

      const data = await getFiles(mergedFilters);

      setFiles(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / data.pageSize));
      setPage(data.page);

      setActiveFilters((prev) => ({
        ...prev,
        ...overrideFilters,
      }));
    } catch (err: any) {
      toast.error("Error fetching files: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleApplyFilters = () => {
    const newFilters: FileFilter = {
      ...(studentId && { studentId }),
      ...(courseId && { courseId }),
      ...(selectedCreatedBy.length && {
        createdBy: selectedCreatedBy.map((i) => i.value),
      }),
      ...(selectedType.length && { type: selectedType.map((i) => i.value) }),
      ...(selectedTags.length && { tags: selectedTags.map((i) => i.value) }),
    };
    fetchFiles(newFilters, 1);
  };

  function resetFilters() {
    setSelectedCreatedBy([]);
    setSelectedType([]);
    setSelectedTags([]);
    fetchFiles({}, 1);
  }

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && page > 1) {
      fetchFiles(undefined, page - 1);
    } else if (direction === "next" && page < totalPages) {
      fetchFiles(undefined, page + 1);
    }
  };

  const SortableTableHead = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead onClick={() => handleSort(field)} className="cursor-pointer">
      <div className={"cursor-pointer flex items-center justify-between"}>
        {children}
        <icons.Sort
          className={
            sortConfig.field === field ? "text-neutral-950" : "text-slate-400"
          }
        />
      </div>
    </TableHead>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <FilterDropdown
          reset={true}
          label={"Created by"}
          placeholder={"Who shared the file"}
          emptyMessage={"empty"}
          items={availableOwners}
          onSelectionChange={setSelectedCreatedBy}
        />
        <FilterDropdown
          reset={true}
          label={"Type"}
          placeholder={"Type of the file"}
          emptyMessage={"Origin"}
          items={availableExtensions}
          onSelectionChange={setSelectedType}
        />
        <FilterDropdown
          reset={true}
          label={"Tags"}
          placeholder={"Tags associated"}
          emptyMessage={"Origin"}
          items={availableTags}
          onSelectionChange={setSelectedTags}
        />
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => resetFilters()}
        >
          <icons.Reset />
        </Button>
        {slim ? (
          <Button onClick={handleApplyFilters} size={"icon"}>
            <icons.Check />
          </Button>
        ) : (
          <Button onClick={handleApplyFilters}>Apply filters</Button>
        )}
        {!slim && (
          <div className="w-1/1 text-right">
            <UploadFilePopup />
          </div>
        )}
      </div>
      <Table className={"w-full"}>
        <TableHeader>
          <TableRow>
            <SortableTableHead field="title">Title</SortableTableHead>
            <SortableTableHead field="dateCreated">Created</SortableTableHead>
            <SortableTableHead field="sharedBy">Shared by</SortableTableHead>
            <SortableTableHead field="course">Course</SortableTableHead>
            <TableHead>Tags</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"justify-start"}>
          {files.map((file) => (
            <TableRow
              key={file.id}
              className={cn(
                "cursor-pointer",
                selectedFile?.id === file.id && "font-semibold",
                "h-10 text-start",
              )}
              onClick={() => {
                setSelectedFile(file);
                setSelectedFileParent &&
                  setSelectedFileParent({
                    id: file.id,
                    name: file.fileName,
                    path: file.relativePath,
                  });
              }}
            >
              <TableCell>{file.fileName}</TableCell>
              <TableCell>
                {formatDate(file.uploadedAt, "hh:mm E dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                {file.ownerInfo.name + " " + file.ownerInfo.surname}
              </TableCell>
              <TableCell>
                {file.courses.map((c) => c.name).join(", ")}
              </TableCell>
              <TableCell>
                <ScrollArea className="w-[200px]">
                  <div className="flex gap-2 whitespace-nowrap">
                    {file.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm bg-secondary rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </ScrollArea>
              </TableCell>
              <TableCell>
                {selectedFile?.id === file.id ? (
                  <div className={"flex flex-row align-right"}>
                    <EditFilePopup
                      file={selectedFile}
                      onFileUpdated={() => fetchFiles()}
                    />
                    <DeleteFilePopup file={selectedFile} />
                    <DownloadButton file={selectedFile} />
                  </div>
                ) : (
                  <div className={"h-8"} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          disabled={page <= 1 || loading}
          onClick={() => handlePageChange("prev")}
        >
          Previous
        </Button>

        <span>
          Page {page} of {totalPages}{" "}
          {totalCount > 0 && (
            <>
              ({totalCount} file{totalCount === 1 ? "" : "s"})
            </>
          )}
        </span>

        <Button
          disabled={page >= totalPages || loading}
          onClick={() => handlePageChange("next")}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
