import "./MainPage.css";
import { Header } from "@/components/complex/header.tsx";
import { Content } from "@/components/ui/content.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CourseCard } from "@/features/course/courseCard.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CourseWidget } from "@/api/types.ts";
import Fuse from "fuse.js";

// === PRZEDZIAŁY CENOWE ===
const PRICE_OPTIONS: { label: string; from?: number; to?: number }[] = [
  { label: "Free (0 $/h)", from: 0, to: 0 },
  { label: "1–20 $/h", from: 1, to: 20 },
  { label: "21–40 $/h", from: 21, to: 40 },
  { label: "41–60 $/h", from: 41, to: 60 },
  { label: "61–80 $/h", from: 61, to: 80 },
  { label: "81–100 $/h", from: 81, to: 100 },
  { label: "101+ $/h", from: 101 }, // brak górnego limitu
];

function MainPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWidget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dropdown data
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  // Wybrane wartości filtrów (dropdown zwraca tablice)
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]); // jedna etykieta


  //Stan wyszukiwania
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<CourseWidget[]>([]);

  useEffect(() => {
    if (!courses.length) {
      setFilteredCourses([]);
      return;
    }

    const fuse = new Fuse(courses, {
      keys: [
        "name",
        "description",
        "levelVariants",
        "languageVariants",
        "teacherName",
        "teacherSurname",
      ],
      threshold: 0.3, // dopasowanie fuzzy
    });

    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const results = fuse.search(searchQuery);
      setFilteredCourses(results.map(r => r.item));
    }
  }, [searchQuery, courses]);


  // Fetch courses (bez filtrów przy starcie)
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch categories, levels, languages
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, levelRes, langRes] = await Promise.all([
          fetch("http://localhost:5249/api/Courses/categories"),
          fetch("http://localhost:5249/api/Courses/levels"),
          fetch("http://localhost:5249/api/Courses/languages"),
        ]);

        if (!catRes.ok || !levelRes.ok || !langRes.ok) {
          throw new Error("Failed to fetch filter data");
        }

        const categoriesData = await catRes.json();
        const levelsData = await levelRes.json();
        const languagesData = await langRes.json();

        setCategories(Array.from(new Set(categoriesData.map((c: any) => c.name))));
        setLevels(Array.from(new Set(levelsData.map((l: any) => l.name))));
        setLanguages(Array.from(new Set(languagesData.map((l: any) => l.name))));
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    };

    fetchFilters();
  }, []);

  // Pobranie kursów z opcjonalnymi filtrami
  const fetchCourses = async (filters?: {
    categories?: string[];
    levels?: string[];
    languages?: string[];
    priceFrom?: number;
    priceTo?: number;
    teacherId?: string;
  }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters?.categories?.length) {
        filters.categories.forEach((c) => params.append("categories", c));
      }
      if (filters?.levels?.length) {
        filters.levels.forEach((l) => params.append("levels", l));
      }
      if (filters?.languages?.length) {
        filters.languages.forEach((lng) => params.append("languages", lng));
      }
      if (typeof filters?.priceFrom === "number") {
        params.append("priceFrom", String(filters.priceFrom));
      }
      if (typeof filters?.priceTo === "number") {
        params.append("priceTo", String(filters.priceTo));
      }
      if (filters?.teacherId) {
        params.append("teacherId", filters.teacherId);
      }

      const url = `http://localhost:5249/api/Courses${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mapowanie etykiety zakresu cen na from/to
  const mapPriceLabelToRange = (label?: string): { from?: number; to?: number } => {
    if (!label) return {};
    const found = PRICE_OPTIONS.find((opt) => opt.label === label);
    return found ? { from: found.from, to: found.to } : {};
  };

  // Apply filters
  const handleApplyFilters = () => {
    const { from: priceFrom, to: priceTo } = mapPriceLabelToRange(selectedPrice[0]);

    const filters = {
      categories: selectedCategory.length ? selectedCategory : undefined,
      levels: selectedLevel.length ? selectedLevel : undefined,
      languages: selectedLanguage.length ? selectedLanguage : undefined,
      priceFrom,
      priceTo,
    };

    console.log("Applying filters:", filters);
    fetchCourses(filters);
  };

  return (
      <div>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Content>
          <div className="flex flex-col gap-8 p-8">
            <Label className="text-2xl font-bold">Promoted courses</Label>

            <div className="flex flex-row gap-4 items-end">
              <FilterDropdown
                  label="Category"
                  placeholder="Select category"
                  searchPlaceholder="Search category..."
                  emptyMessage="No category found."
                  items={categories}
                  multiselect={false}
                  onSelectionChange={setSelectedCategory}
              />
              <FilterDropdown
                  label="Level"
                  placeholder="Select level"
                  searchPlaceholder="Search level..."
                  emptyMessage="No level found."
                  items={levels}
                  multiselect={false}
                  onSelectionChange={setSelectedLevel}
              />
              <FilterDropdown
                  label="Price"
                  placeholder="Select price range"
                  searchPlaceholder="Search price..."
                  emptyMessage="No price range found."
                  items={PRICE_OPTIONS.map((p) => p.label)}
                  multiselect={false} // pojedynczy zakres -> ładne mapowanie na priceFrom/priceTo
                  onSelectionChange={setSelectedPrice}
              />
              <FilterDropdown
                  label="Language"
                  placeholder="Select language"
                  searchPlaceholder="Search language..."
                  emptyMessage="No language found."
                  items={languages}
                  multiselect={false}
                  onSelectionChange={setSelectedLanguage}
              />
              <Button onClick={handleApplyFilters}>Apply filters</Button>
            </div>

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => (
                      <CourseCard
                          key={course.id}
                          title={course.name}
                          imageUrl={
                              course.image ??
                              "https://www.codeguru.com/wp-content/uploads/2023/01/c-sharp-tutorials-tips-tricks-1024x683.png"
                          }
                          rating={course.rating}
                          levels={course.levelVariants ?? []}
                          language={course.languageVariants ?? []}
                          price={`${course.minimumCoursePrice ?? 0}-${
                              course.maximumCoursePrice ?? 0
                          }$/h`}
                          description={course.description ?? ""}
                          teacher={{
                            name: course.teacherName ?? "Unknown",
                            surname: course.teacherSurname ?? "",
                          }}
                          onClick={() =>
                              navigate(`/course/${course.id}`, {
                                state: { teacherId: course.teacherId ?? "" },
                              })
                          }
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
