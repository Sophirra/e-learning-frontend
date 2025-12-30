import { Button } from "../../ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Header } from "@/components/complex/bars/header.tsx";

interface SearchBarProps {
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
}
export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 ">
      <Header />
      <div className="flex items-center justify-between py-6 px-26 bg-slate-200">
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/public">
              <icons.House />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <icons.ArrowBigLeft />
          </Button>
        </div>
        <div className="flex gap-4 stick-center">
          <Input
            placeholder="Search for courses"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery ? setSearchQuery(e.target.value) : null
            }
          />
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <icons.Search />
          </Button>
        </div>
      </div>
      <Divider />
    </header>
  );
}
