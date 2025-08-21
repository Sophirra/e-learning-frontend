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

export function UserSheet() {
  let [state, setState] = useState<"login" | "register">("login");
  let { user } = useUser();
  return (
    // <UserProvider>
    <Sheet onOpenChange={(open) => !open && setState("login")}>
      <SheetTrigger asChild>
        <MenubarItem onSelect={(e) => e.preventDefault()}>Login</MenubarItem>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {" "}
            {user !== null
              ? "Logged in as" + user.name
              : state === "login"
                ? "Log in"
                : "Register"}
          </SheetTitle>
        </SheetHeader>
        {user !== null ? (
          <UserSheetContentLoggedIn />
        ) : state === "register" ? (
          <UserSheetContentRegister
            onCancel={() => setState("login")}
            onRegister={() => setState("login")}
          />
        ) : (
          <UserSheetContentLogIn onRegister={() => setState("register")} />
        )}
      </SheetContent>
    </Sheet>
    // </UserProvider>
  );
}
