import { Header } from "@/components/complex/header.tsx";
import { Content } from "@/components/ui/content.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function ErrorPage() {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>
      <Content>
        <div className="flex flex-col items-center justify-center gap-7 h-1/2">
          <p className="text-center text-3xl font-semibold">
            Error: page not found
          </p>
          <Button
            variant={"outline"}
            size={"lg"}
            onClick={() => window.history.back()}
          >
            Go back
          </Button>
        </div>
      </Content>
    </div>
  );
}
