import { Button } from "../ui/button.tsx";
import { ArrowBigLeft, Bell, House, Search } from "lucide-react";
import { Divider } from "@/components/ui/divider.tsx";
import { Input } from "@/components/ui/input.tsx";
import { UserSheet } from "@/features/user/UserSheet/UserSheet.tsx";
import { useUser } from "@/features/user/UserContext.tsx";

export function Header() {
  let { user } = useUser();
  return (
    <header className="fixed top-0 left-0 w-full z-50 ">
      <div className="px-26 py-6 flex justify-between items-left bg-white">
        <Button variant="secondary">Logo</Button>
        <div className="flex justify-start items-start gap-4">
          {user && (
            <Button size="icon" variant="outline">
              <Bell />
            </Button>
          )}
          <UserSheet />
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-between py-6 px-26 bg-slate-200">
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/">
              <House />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowBigLeft />
          </Button>
        </div>
        <div className="flex gap-4 stick-center">
          <Input placeholder="Search for courses" />
          <Button variant="ghost" size="icon">
            <Search />
          </Button>
        </div>
      </div>
      <Divider />
    </header>
  );
}
