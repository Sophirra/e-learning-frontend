import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/features/user/UserContext.tsx";
import { Header } from "@/components/complex/header.tsx";

export function NavigationBar() {
  let { user } = useUser();
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <Header />
      <div className="flex items-center justify-center py-6 px-26 bg-slate-200">
        <nav className="flex gap-6">
          {[
            { to: "/home", icon: icons.Home, label: "Home" },
            //students tab only visible to teachers
            user?.activeRole === "teacher"
              ? { to: "/students", icon: icons.Users, label: "Students" }
              : null,
            { to: "/calendar", icon: icons.Calendar, label: "Calendar" },
            {
              to: "/exercise",
              icon: icons.ClipboardList,
              label: "Exercises",
            },
            { to: "/chats", icon: icons.MessageSquare, label: "Chats" },
            { to: "/quizzes", icon: icons.Brain, label: "Quizzes" },
            { to: "/files", icon: icons.FolderOpen, label: "Files" },
          ]
            //filter to remove null from list
            .filter(Boolean)
            //ignore warnings - null is filtered out
            // @ts-ignore
            .map(({ to, icon: Icon, label }) => {
              let isActive = useLocation().pathname === to;
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
