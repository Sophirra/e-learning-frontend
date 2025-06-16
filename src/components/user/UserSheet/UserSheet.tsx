"use client"

import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "../../ui/sheet.tsx";
import { UserIcon} from "lucide-react";
import type {User} from "@/types/user.ts";
import {useState} from "react";
import {UserSheetContentLogIn} from "@/components/user/UserSheet/UserSheetContentLogIn.tsx";
import {UserSheetContentLoggedIn} from "@/components/user/UserSheet/UserSheetContentLoggedIn.tsx";
import {UserSheetContentRegister} from "@/components/user/UserSheet/UserSheetContentRegister.tsx";

export type UserSheetProps = {
    user: User | null
    onLogout: () => void
}

export function UserSheet({user, onLogout}: UserSheetProps) {
    let [state, setState] = useState<"login" | "register" | "logged-in">("login");
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="default">
                    <UserIcon/>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0">
                <SheetHeader>
                    <SheetTitle> {user ? "Logged in as" + user.name :
                        state === "login" ? "Log in" : "Register"}</SheetTitle>
                </SheetHeader>{
                    state === "login" ?
                    <UserSheetContentLogIn onRegister={() => setState("register")}/>
                    : state === "register" ? <UserSheetContentRegister onCancel={() => setState("login")} onRegister={() => setState("login")}/>
                    : <UserSheetContentLoggedIn user={user} onLogout={() => onLogout()}/>
            }
            </SheetContent>
        </Sheet>
    )
}


