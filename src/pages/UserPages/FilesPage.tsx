import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
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
import { useState, useMemo, useEffect} from "react";
import { cn } from "@/lib/utils.ts";
import { Content } from "@/components/ui/content.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import {getFiles} from "@/api/apiCalls.ts";
import type {FileData} from "@/api/types.ts"

type SortField = "title" | "dateCreated" | "dateShared" | "course";
type SortOrder = "none" | "asc" | "desc";

export function FilesPage() {
  const { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField | null;
    order: SortOrder;
  }>({ field: null, order: "none" });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<SelectableItem[]>([]);
  const [selectedSharedBy, setSelectedSharedBy] = useState<SelectableItem[]>(
    [],
  );
  const [selectedType, setSelectedType] = useState<SelectableItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<SelectableItem[]>([]);

  const [filters, setFilters] = useState<>({
    student: "",
    course: "",
    origin: [],
    sharedBy: [],
    type: [],
    tags: [],
  });

  // Przykładowe dane
  const mockFiles: FileData[] = [
    {
      id: "1",
      name: "Wykład 1",
      uploadedAt: "12/09/2025",
      uploadedBy: "Jane Doe",
      url: "https://example.com/file1.pdf",
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

  const sortedFiles = useMemo(() => {
    if (!sortConfig.field || sortConfig.order === "none") return mockFiles;

    return [...mockFiles].sort((a, b) => {
      const aValue = a[sortConfig.field!];
      const bValue = b[sortConfig.field!];
      const modifier = sortConfig.order === "asc" ? 1 : -1;

      if (aValue === null) return 1;
      if (bValue === null) return -1;
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });
  }, [mockFiles, sortConfig]);

  useEffect(() => {
    fetchFiles();
  }, [])

  async function fetchFiles  (filters?: Parameters<typeof getFiles[0]>) {
    setLoading(true);
    try{
      const data = await getFiles(filters);
      setFiles(data);

    }
  }

  const handleApplyFilters = () => {
    const newFilters = {
      student: selectedStudentId || "",
      course: selectedCourseId || "",
      ...(selectedOrigin.length && {
        origin: selectedOrigin.map((item) => item.value),
      }),
      ...(selectedSharedBy.length && {
        sharedBy: selectedSharedBy.map((item) => item.value),
      }),
      ...(selectedType.length && {
        type: selectedType.map((item) => item.value),
      }),
      ...(selectedTags.length && {
        tags: selectedTags.map((item) => item.value),
      }),
    };

    fetchFiles(newFilters);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <div className={"flex flex-col gap-2"}>
          <CourseFilter
            student={user?.activeRole === "student"}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            setupClassButton={false}
          />
          {/* Filters */}
          <div className="flex items-center gap-4">
            <FilterDropdown
              reset={true}
              label={"Origin"}
              placeholder={"Where file was created"}
              emptyMessage={"Origin"}
              items={[
                { name: "Uploaded", value: "uploaded" },
                { name: "Generated", value: "generated" },
              ]}
              onSelectionChange={setSelectedOrigin}
            />
            <FilterDropdown
              reset={true}
              label={"Shared by"}
              placeholder={"Who shared the file"}
              emptyMessage={"Shared by"}
              items={[
                { name: "Me", value: "user" },
                { name: "Teacher A", value: "teacher1" },
                { name: "Teacher B", value: "teacher2" },
                { name: "Student A", value: "student1" },
                { name: "Student B", value: "student2" },
              ]}
              onSelectionChange={setSelectedSharedBy}
            />
            <FilterDropdown
              reset={true}
              label={"Type"}
              placeholder={"Type of the file"}
              emptyMessage={"Origin"}
              items={[
                { name: "PDF", value: "pdf" },
                { name: "Word", value: "word" },
                { name: "JPG", value: "jpg" },
              ]}
              onSelectionChange={setSelectedType}
            />
            <FilterDropdown
              reset={true}
              label={"Tags"}
              placeholder={"Tags associated"}
              emptyMessage={"Origin"}
              items={[
                { name: "Vocabulary", value: "vocabulary" },
                { name: "Grammar", value: "grammar" },
                { name: "Exam", value: "exam" },
                { name: "Obligatory", value: "obligatory" },
              ]}
              onSelectionChange={setSelectedTags}
            />
            <Button onClick={handleApplyFilters}>Apply filters</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("title")}
                className="cursor-pointer"
              >
                Title
                {/*<ArrowUpDown className="inline h-4 w-4 ml-1" />*/}
              </TableHead>
              <TableHead
                onClick={() => handleSort("dateCreated")}
                className="cursor-pointer"
              >
                Date Created
                {/*<ArrowUpDown className="inline h-4 w-4 ml-1" />*/}
              </TableHead>
              <TableHead
                onClick={() => handleSort("dateShared")}
                className="cursor-pointer"
              >
                Date Shared
                {/*<ArrowUpDown className="inline h-4 w-4 ml-1" />*/}
              </TableHead>
              <TableHead
                onClick={() => handleSort("course")}
                className="cursor-pointer"
              >
                Course
                {/*<ArrowUpDown className="inline h-4 w-4 ml-1" />*/}
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFiles.map((file) => (
              <TableRow
                key={file.id}
                className={cn(
                  "cursor-pointer",
                  selectedFile === file.id && "border-l-2 border-l-primary",
                )}
                onClick={() => setSelectedFile(file.id)}
              >
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.uploadedAt}</TableCell>
                <TableCell>
                  {file.uploadedBy}
                </TableCell>
                <TableCell>{file.courseName}</TableCell>
                <TableCell>
                  <ScrollArea className="w-[200px]">
                    <div className="flex gap-2 whitespace-nowrap">
                      {file.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm bg-secondary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ScrollArea>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <icons.ArrowBigLeft/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <icons.Link/>
                        Open in new tab
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <icons.CheckIcon/>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <icons.Edit/>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <icons.Trash/>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Content>
    </div>
  );
}
