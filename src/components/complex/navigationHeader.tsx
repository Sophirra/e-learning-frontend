import { Button } from "../ui/button.tsx";
import {
  Bell,
  Home,
  Users,
  Calendar,
  ClipboardList,
  FolderOpen,
  MessageSquare,
  Brain,
  Eye,
} from "lucide-react";
import { Divider } from "@/components/ui/divider.tsx";
import { UserSheet } from "@/features/user/UserSheet/UserSheet.tsx";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/features/user/UserContext.tsx";
import { Label } from "@/components/ui/label.tsx";

export function NavigationHeader() {
  let { user } = useUser();
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="px-26 py-6 flex justify-between items-left bg-white">
        <Button variant="secondary">Logo</Button>
        <div className="flex justify-start items-start gap-4">
          <Button size="icon" variant="outline">
            {user && <Bell />}
          </Button>
          <UserSheet />
        </div>
      </div>
      <Divider />
      {/*{!user ? (*/}
      {/*  <Label>You are not supposed to see this</Label>*/}
      {/*) : (*/}
      <div className="flex items-center justify-center py-6 px-26 bg-slate-200">
        <nav className="flex gap-6">
          {[
            { to: "/", icon: Home, label: "Home" },
            { to: "/students", icon: Users, label: "Students" },
            { to: "/calendar", icon: Calendar, label: "Calendar" },
            { to: "/assignments", icon: ClipboardList, label: "Assignments" },
            { to: "/files", icon: FolderOpen, label: "Files" },
            { to: "/chats", icon: MessageSquare, label: "Chats" },
            { to: "/quizzes", icon: Brain, label: "Quizzes" },
            { to: "/spectating", icon: Eye, label: "Spectating" },
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
                  className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-500"}`}
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
