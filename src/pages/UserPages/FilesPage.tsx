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
import {
  Files,
  MoreHorizontal,
  RefreshCw,
  ArrowUpDown,
  ExternalLink,
  Share2,
  Trash2,
  Pen,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils.ts";
import { Content } from "@/components/ui/content.tsx";

interface FileData {
  id: string;
  title: string;
  dateCreated: Date;
  dateShared: Date | null;
  course: string;
  tags: string[];
}

type SortField = "title" | "dateCreated" | "dateShared" | "course";
type SortOrder = "none" | "asc" | "desc";

interface Filter {
  course: string;
  origin: string;
  sharedBetween: string;
  type: string;
  tags: string[];
}

export function FilesPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField | null;
    order: SortOrder;
  }>({ field: null, order: "none" });

  const [filters, setFilters] = useState<Filter>({
    course: "",
    origin: "",
    sharedBetween: "",
    type: "",
    tags: [],
  });

  // Przykładowe dane
  const mockFiles: FileData[] = [
    {
      id: "1",
      title: "Wykład 1",
      dateCreated: new Date(2025, 6, 1),
      dateShared: new Date(2025, 6, 2),
      course: "Mathematics",
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

  const resetFilters = () => {
    setFilters({
      course: "",
      origin: "",
      sharedBetween: "",
      type: "",
      tags: [],
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        {/* Filters */}
        <div className="fixed top left-0 right-0 bg-white border-b z-20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Select
                value={filters.course}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, course: value }))
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[150px]",
                    filters.course && "border-primary text-primary",
                  )}
                >
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.origin}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, origin: value }))
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[150px]",
                    filters.origin && "border-primary text-primary",
                  )}
                >
                  <SelectValue placeholder="Origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sharedBetween}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sharedBetween: value }))
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[150px]",
                    filters.sharedBetween && "border-primary text-primary",
                  )}
                >
                  <SelectValue placeholder="Shared between" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All students</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[150px]",
                    filters.type && "border-primary text-primary",
                  )}
                >
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">DOC</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.tags.join(",")}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, tags: [value] }))
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[150px]",
                    filters.tags.length > 0 && "border-primary text-primary",
                  )}
                >
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="homework">Homework</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="h-[64px]" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Files className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Files</h1>
        </div>
        <Separator className="mb-6" />

        {/* Files Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("title")}
                className="cursor-pointer"
              >
                Title <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => handleSort("dateCreated")}
                className="cursor-pointer"
              >
                Date Created <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => handleSort("dateShared")}
                className="cursor-pointer"
              >
                Date Shared <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => handleSort("course")}
                className="cursor-pointer"
              >
                Course <ArrowUpDown className="inline h-4 w-4 ml-1" />
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
                <TableCell>{file.title}</TableCell>
                <TableCell>{file.dateCreated.toLocaleDateString()}</TableCell>
                <TableCell>
                  {file.dateShared?.toLocaleDateString() || "-"}
                </TableCell>
                <TableCell>{file.course}</TableCell>
                <TableCell>
                  <ScrollArea className="w-[200px]">
                    <div className="flex gap-2 whitespace-nowrap">
                      {file.tags.map((tag, index) => (
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
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pen className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
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
