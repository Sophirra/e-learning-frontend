"use client"

import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "../../ui/sheet.tsx";
import { UserIcon} from "lucide-react";
import { useState} from "react";
import {UserSheetContentLogIn} from "@/components/user/UserSheet/UserSheetContentLogIn.tsx";
import {UserSheetContentLoggedIn} from "@/components/user/UserSheet/UserSheetContentLoggedIn.tsx";
import {UserSheetContentRegister} from "@/components/user/UserSheet/UserSheetContentRegister.tsx";
import {UserProvider, useUser} from "@/components/user/UserContext.tsx";


export function UserSheet() {
    let [state, setState] = useState<"login" | "register">("login");
    let {user} = useUser();
    return(
        <UserProvider>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="default">
                        <UserIcon/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="gap-0">
                    <SheetHeader>
                        <SheetTitle> {user !== null ? "Logged in as" + user.name :
                            state === "login" ? "Log in" : "Register"}</SheetTitle>
                    </SheetHeader>{
                    user !== null ? <UserSheetContentLoggedIn/>
                    : state === "register" ? <UserSheetContentRegister onCancel={() => setState("login")} onRegister={() => setState("login")}/>
                    : <UserSheetContentLogIn onRegister={() => setState("register")}/>
                }
                </SheetContent>
            </Sheet>
        </UserProvider>
    )
}


