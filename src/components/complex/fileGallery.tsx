import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils.ts";
import { useUser } from "@/features/user/UserContext.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import { getFiles } from "@/api/apiCalls.ts";
import type { FileData, FileFilter } from "@/api/types.ts";
import { UploadFilePopup } from "@/components/complex/popups/files/uploadFilePopup.tsx";
import { formatDate } from "date-fns";
import { EditFilePopup } from "@/components/complex/popups/files/editFilePopup.tsx";
import { Edit } from "lucide-react";
import { DeleteFilePopup } from "@/components/complex/popups/files/deleteFilePopup.tsx";
import { getUserFileOwners, getUserFileExtensions, getUserFileTags } from "@/api/apiCalls.ts";

type SortField = "title" | "dateCreated" | "sharedBy" | "course";
type SortOrder = "none" | "asc" | "desc";

export function FileGallery({
  courseId,
  studentId,
  setSelectedFileProp,
  slim,
}: {
  courseId?: string;
  studentId?: string;
  setSelectedFileProp?: (file: FileData) => void;
  slim?: boolean;
}) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField | null;
    order: SortOrder;
  }>({ field: "dateCreated", order: "desc" });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<SelectableItem[]>([]);
  const [selectedSharedBy, setSelectedSharedBy] = useState<SelectableItem[]>(
    [],
  );
  const [selectedType, setSelectedType] = useState<SelectableItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<SelectableItem[]>([]);

  const [availableOwners, setAvailableOwners] = useState<SelectableItem[]>([]);
  const [availableExtensions, setAvailableExtensions] = useState<SelectableItem[]>([]);
  const [availableTags, setAvailableTags] = useState<SelectableItem[]>([]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const owners = await getUserFileOwners();
        setAvailableOwners(
            owners.map(o => ({ name: `${o.name} ${o.surname}`, value: o.id }))
        );

        const extensions = await getUserFileExtensions();
        setAvailableExtensions(
            extensions.map(ext => ({ name: ext, value: ext.toLowerCase() }))
        );

        const tags = await getUserFileTags();
        setAvailableTags(
            tags.map(t => ({ name: t.name, value: t.id })) // zakładam że masz FileTag { id, name }
        );
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    }

    loadFilters();
  }, []);


  const [filters, setFilters] = useState<FileFilter>({
    studentId: studentId ? studentId : "",
    courseId: courseId ? courseId : "",
    origin: [],
    createdBy: [],
    type: [],
    tags: [],
  });

  // Przykładowe dane
  const mockFiles: FileData[] = [
    {
      id: "1",
      fileName: "Wykład 1",
      uploadedAt: "12/09/2025",
      uploadedBy: "Jane Doe",
      relativePath: "https://example.com/file1.pdf",
      courseId: "1",
      courseName: "Mathematics",
      tags: ["lecture", "pdf"],
    },
    // Dodaj więcej przykładowych plików
  ];

  const handleSort = (field: SortField) => {
    setSortConfig((current) => {
      if (current.field !== field) return { field, order: "asc" };
      if (current.order === "none") return { field, order: "asc" };
      if (current.order === "asc") return { field, order: "desc" };
      return { field: null, order: "none" };
    });
  };

  // const sortedFiles = useMemo(() => {
  //   if (!sortConfig.field || sortConfig.order === "none") return mockFiles;
  //
  //   return [...mockFiles].sort((a, b) => {
  //     const aValue = a[sortConfig.field!];
  //     const bValue = b[sortConfig.field!];
  //     const modifier = sortConfig.order === "asc" ? 1 : -1;
  //
  //     if (aValue === null) return 1;
  //     if (bValue === null) return -1;
  //     if (aValue < bValue) return -1 * modifier;
  //     if (aValue > bValue) return 1 * modifier;
  //     return 0;
  //   });
  // }, [mockFiles, sortConfig]);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles(filters?: Parameters<typeof getFiles>[0]) {
    setLoading(true);
    try {
      const data = await getFiles(filters);
      setFiles(data);
    } catch (e) {
      console.error("Error fetching files:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleApplyFilters = () => {
    const newFilters = {
      student: studentId || "",
      course: courseId || "",
      ...(selectedOrigin.length && {
        origin: selectedOrigin.map((item) => item.value),
      }),
      ...(selectedSharedBy.length && {
        createdBy: selectedSharedBy.map((item) => item.value),
      }),
      ...(selectedType.length && {
        type: selectedType.map((item) => item.value),
      }),
      ...(selectedTags.length && {
        tags: selectedTags.map((item) => item.name),
      }),
    };

    fetchFiles(newFilters);
  };

  function resetFilters() {
    setSelectedOrigin([]);
    setSelectedSharedBy([]);
    setSelectedType([]);
    setSelectedTags([]);
  }
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
        {/*<FilterDropdown*/}
        {/*  reset={true}*/}
        {/*  label={"Origin"}*/}
        {/*  placeholder={"Where file was created"}*/}
        {/*  emptyMessage={"Origin"}*/}
        {/*  items={[*/}
        {/*    { name: "Uploaded", value: "uploaded" },*/}
        {/*    { name: "Generated", value: "generated" },*/}
        {/*  ]}*/}
        {/*  onSelectionChange={setSelectedOrigin}*/}
        {/*/>*/}
        <FilterDropdown
          reset={true}
          label={"Shared by"}
          placeholder={"Who shared the file"}
          emptyMessage={"empty"}
          items={availableOwners}
          onSelectionChange={setSelectedSharedBy}
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
                setSelectedFileProp && setSelectedFileProp(file);
              }}
            >
              <TableCell>{file.fileName}</TableCell>
              <TableCell>
                {formatDate(file.uploadedAt, "hh:mm E dd/MM/yyyy")}
              </TableCell>
              <TableCell>{file.ownerInfo.name + " " + file.ownerInfo.surname}</TableCell>
              <TableCell>{file.courseName}</TableCell>
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
                    <EditFilePopup file={selectedFile} />
                    <DeleteFilePopup file={selectedFile} />
                  </div>
                ) : (
                  // <DropdownMenu>
                  //   <DropdownMenuTrigger asChild>
                  //     <Button variant="ghost" size="icon">
                  //       <icons.MoreHorizontalIcon />
                  //     </Button>
                  //   </DropdownMenuTrigger>
                  //   <DropdownMenuContent align="end">
                  //     <DropdownMenuItem>
                  //       <icons.Link />
                  //       Open in new tab
                  //     </DropdownMenuItem>
                  //     <DropdownMenuItem>
                  //       <icons.Share />
                  //       Share
                  //     </DropdownMenuItem>
                  //     <DropdownMenuItem>
                  //       {/*<EditFilePopup />*/}
                  //       {/*file={selectedFile} />*/}
                  //     </DropdownMenuItem>
                  //     <DropdownMenuItem className="text-destructive">
                  //       <icons.Trash />
                  //       Delete
                  //     </DropdownMenuItem>
                  //   </DropdownMenuContent>
                  // </DropdownMenu>
                  <div className={"h-8"} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
