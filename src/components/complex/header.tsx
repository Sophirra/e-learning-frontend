import { Button } from "../ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { UserSheet } from "@/features/user/UserSheet/UserSheet.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { Link } from "react-router-dom";
import { SpectatorListPopup } from "@/components/complex/popups/spectators/spectatorListPopup.tsx";

export function Header() {
  let { user, changeRole } = useUser();
  return (
    <header>
      <div className="px-26 py-6 flex justify-between items-left bg-white">
        <Link key={"switch"} to={"/"}>
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
                {user ? (
                  <>
                    <MenubarItem>
                      <Link key={"home"} to={"/home"}>
                        To your courses
                      </Link>
                    </MenubarItem>
                    <SpectatorListPopup />
                  </>
                ) : null}
                {user && user.roles.length > 1 && (
                  <MenubarItem
                    onClick={() => {
                      changeRole(
                        user.roles.filter((r) => r !== user?.activeRole)[0],
                      );
                    }}
                  >
                    Change to {user.roles.filter((r) => r !== user?.activeRole)}
                  </MenubarItem>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <Divider />
    </header>
  );
}
