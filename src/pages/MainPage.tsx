import "./MainPage.css";
import { Header } from "@/components/complex/header.tsx";
import { Content } from "@/components/ui/content.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CourseCard } from "@/features/course/courseCard.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface CourseVariant {
  languageName: string;
  levelName: string;
  price: number;
}

interface Course {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  description: string;
  variants: CourseVariant[];
  teacherId: string;
  teacherName: string;
  teacherSurname: string;
}

function MainPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5249/api/Courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                      <CourseCard
                          key={course.id}
                          title={course.name}
                          imageUrl={
                              course.image ??
                              "https://www.codeguru.com/wp-content/uploads/2023/01/c-sharp-tutorials-tips-tricks-1024x683.png"
                          }
                          rating={course.rating}
                          levels={course.variants.map((v) => v.levelName.toLowerCase())}
                          language={course.variants[0]?.languageName ?? "Unknown"}
                          price={
                            course.variants[0]?.price === 0
                                ? "Free"
                                : `${course.variants[0]?.price}$/h`
                          }
                          description={course.description}
                          teacher={{
                            name: course.teacherName,
                            surname: course.teacherSurname,
                          }}
                          onClick={() => navigate(`/course/${course.id}`)}
                      />
                  ))}
                </div>
            )}
          </div>
        </Content>
      </div>
  );
}

export default MainPage;
