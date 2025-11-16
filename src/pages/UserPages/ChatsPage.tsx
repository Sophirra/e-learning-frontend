import { Content } from "@/components/ui/content.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";

export function ChatsPage() {
  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <p className={"text-2xl"}>Placeholder</p>
      </Content>
    </div>
  );
}
