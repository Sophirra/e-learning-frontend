import { Button } from "../ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Input } from "@/components/ui/input.tsx";
import { UserSheet } from "@/features/user/UserSheet/UserSheet.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { Link } from "react-router-dom";
// import { SpectatorDialog } from "@/components/complex/spectatorDialog.tsx";

//TODO: przegadać to: po co search w headerze? Wystarczy tylko setSearch na PRZYCISK
interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
}
export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  let { user } = useUser();
  return (
    <header className="fixed top-0 left-0 w-full z-50 ">
      <div className="px-26 py-6 flex justify-between items-left bg-white">
        <Link key={"into"} to={"/home"}>
          <Button variant="secondary">
            Welcome {user?.name} {user?.surname}
          </Button>
        </Link>
        <div className="flex justify-start items-start gap-4">
          {user && (
            <Button size="icon" variant="outline">
              <icons.Bell />
            </Button>
          )}
          <Menubar className="border-0 p-0 bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="p-0">
                <Button size="icon" variant="default">
                  <icons.UserIcon />
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                <UserSheet />
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-between py-6 px-26 bg-slate-200">
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/">
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
