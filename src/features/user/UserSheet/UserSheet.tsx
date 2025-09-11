"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet.tsx";
import { useState } from "react";
import { UserSheetContentLogIn } from "@/features/user/UserSheet/UserSheetContentLogIn.tsx";
import { UserSheetContentLoggedIn } from "@/features/user/UserSheet/UserSheetContentLoggedIn.tsx";
import { UserSheetContentRegister } from "@/features/user/UserSheet/UserSheetContentRegister.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { MenubarItem } from "@/components/ui/menubar.tsx";
import { logoutUser } from "@/api/auth.ts";

export function UserSheet() {
  let [state, setState] = useState<"login" | "register">("login");
  let { user, setUser } = useUser();
  let logout = () => {
    logoutUser();
    setUser(null);
    setState("login");
  };
  return (
    <Sheet onOpenChange={(open) => !open && setState("login")}>
      <SheetTrigger asChild>
        <MenubarItem onSelect={(e) => e.preventDefault()}>
          {user === null
            ? "Login"
            : "Logged in as " + user?.name + " " + user?.surname}
        </MenubarItem>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {" "}
            {user !== null
              ? "Logged in as " + user.name
              : state === "login"
                ? "Log in"
                : "Register"}
          </SheetTitle>
        </SheetHeader>
        {user !== null ? (
          <UserSheetContentLoggedIn onLogout={() => logout()} />
        ) : state === "register" ? (
          <UserSheetContentRegister
            onCancel={() => setState("login")}
            onRegister={() => setState("login")} //TODO: registration logic
          />
        ) : (
          <UserSheetContentLogIn
            switchToRegister={() => setState("register")}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
