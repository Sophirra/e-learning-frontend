import {Button} from "../button.tsx";
import {ArrowBigLeft, Bell, House, Search} from "lucide-react"
import type {User} from "@/types/user.ts";
import {Divider} from "@/components/ui/divider.tsx";
import {Input} from "@/components/ui/input.tsx";
import {UserSheet} from "@/components/user/UserSheet/UserSheet.tsx";

export function Header({user}: { user: User | null }) {
    return (
        <header className="fixed top-0 left-0 w-full">
            <div className="z-50 px-26 py-6 flex justify-between items-left">
                <Button variant="secondary">Logo</Button>
                <div className="flex justify-start items-start gap-4">
                    <Button size="icon" variant="outline">
                        <Bell/>
                    </Button>
                    <UserSheet user={user} onLogout={() => console.log("Logged out")}/>
                </div>

            </div>
            <Divider/>
            <div className="flex items-center justify-between py-6 px-26 bg-slate-200">
                <div className="flex gap-4">
                    <Button variant="ghost" size="icon">
                        <House/>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <ArrowBigLeft/>
                    </Button>
                </div>
                <div className="flex gap-4 stick-center">
                    <Input placeholder="Search for courses"/>
                    <Button variant="ghost" size="icon">
                        <Search/>
                    </Button>
                </div>
            </div>
            <Divider/>
        </header>
    );
}