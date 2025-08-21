import { Button } from "../ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { UserSheet } from "@/features/user/UserSheet/UserSheet.tsx";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/features/user/UserContext.tsx";
import {
  Menubar,
  MenubarItem,
  MenubarTrigger,
  MenubarContent,
  MenubarMenu,
} from "@/components/ui/menubar.tsx";
import { SpectatorDialog } from "@/components/complex/spectatorDialog.tsx";

export function NavigationHeader() {
  let { user } = useUser();
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="px-26 py-6 flex justify-between items-left bg-white">
        <Button variant="secondary">Logo</Button>
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
                <SpectatorDialog />
                <MenubarItem>Logout</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <Divider />
      {/*{!user ? (*/}
      {/*  <Label>You are not supposed to see this</Label>*/}
      {/*) : (*/}
      <div className="flex items-center justify-center py-6 px-26 bg-slate-200">
        <nav className="flex gap-6">
          {[
            { to: "/", icon: icons.Home, label: "Home" },
            { to: "/students", icon: icons.Users, label: "Students" },
            { to: "/calendar", icon: icons.Calendar, label: "Calendar" },
            {
              to: "/assignments",
              icon: icons.ClipboardList,
              label: "Assignments",
            },
            { to: "/files", icon: icons.FolderOpen, label: "Files" },
            { to: "/chats", icon: icons.MessageSquare, label: "Chats" },
            { to: "/quizzes", icon: icons.Brain, label: "Quizzes" },
          ].map(({ to, icon: Icon, label }) => {
            const isActive = useLocation().pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 transition-all border-b-2 ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon
                  className={`${isActive ? "text-primary" : "text-gray-500"}`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/*)}*/}
      <Divider />
    </header>
  );
}
