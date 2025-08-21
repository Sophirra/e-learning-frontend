import "./MainPage.css";
import { Header } from "@/components/complex/header.tsx";
import { Content } from "@/components/ui/content.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CourseCard } from "@/features/course/courseCard.tsx";
import { useNavigate } from "react-router-dom";

function MainPage() {
  let navigate = useNavigate();
  return (
    <div>
      <Header />
      <Content>
        <div className="flex flex-col gap-8 p-8">
          <Label className="text-2xl font-bold">Promoted courses</Label>

          <div className="flex flex-row gap-4 items-end">
            <FilterDropdown
              label="Category"
              placeholder="Select category"
              searchPlaceholder="Search category..."
              emptyMessage="No category found."
              items={["Programming", "Design", "Business"]}
            />
            <FilterDropdown
              label="Level"
              placeholder="Select level"
              searchPlaceholder="Search level..."
              emptyMessage="No level found."
              items={["Beginner", "Intermediate", "Advanced"]}
            />
            <FilterDropdown
              label="Price"
              placeholder="Select price range"
              searchPlaceholder="Search price..."
              emptyMessage="No price range found."
              items={["Free", "Paid"]}
            />
            <FilterDropdown
              label="Language"
              placeholder="Select language"
              searchPlaceholder="Search language..."
              emptyMessage="No language found."
              items={["English", "Polish", "German"]}
            />
            <Button>Apply filters</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <CourseCard
                key={i}
                title={"Sample course.tsx"}
                imageUrl={
                  "https://i.guim.co.uk/img/media/327aa3f0c3b8e40ab03b4ae80319064e401c6fbc/377_133_3542_2834/master/3542.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=34d32522f47e4a67286f9894fc81c863"
                }
                rating={4}
                levels={["intermediate", "beginner"]}
                language={"english"}
                price={"50/h"}
                description={"intermediate course.tsx"}
                teacher={{ name: "John", surname: "Doe" }}
                onClick={() => navigate(`/course/${i}`)}
              />
            ))}
          </div>
        </div>
      </Content>
    </div>
  );
}

export default MainPage;
