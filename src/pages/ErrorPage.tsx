import { Header } from "@/components/complex/header.tsx";
import { Content } from "@/components/ui/content.tsx";

export default function ErrorPage() {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>
      <Content>Error</Content>
    </div>
  );
}
