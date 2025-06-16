import {Button} from "@/components/ui/button.tsx";
import type {UserSheetProps} from "@/components/user/UserSheet/UserSheet.tsx";

export function UserSheetContentLoggedIn({user, onLogout}: UserSheetProps){
    if (!user) return null;
    return (
        <div className="mt-4 space-y-4">
            <div className="text-sm">
                <p><strong>Imię:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <Button variant="destructive" onClick={onLogout}>Log out</Button>
        </div>
    )
}