import "../MainPage.css";
import { Content } from "@/components/ui/content.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CourseCard } from "@/features/course/courseCard.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CourseWidget } from "@/api/types.ts";
import { SearchBar } from "@/components/complex/searchBar.tsx";
import {getCourseCategories, getCourseLanguages, getCourseLevels, getCourses} from "@/api/apiCalls.ts";
import {toast} from "sonner";

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
  const [, setCourses] = useState<CourseWidget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dropdown data
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  // Wybrane wartości filtrów (dropdown zwraca tablice)
  const [selectedCategory, setSelectedCategory] = useState<SelectableItem[]>(
    [],
  );
  const [selectedLanguage, setSelectedLanguage] = useState<SelectableItem[]>(
    [],
  );
  const [selectedLevel, setSelectedLevel] = useState<SelectableItem[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<SelectableItem[]>([]);

  //Stan wyszukiwania
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<CourseWidget[]>([]);

  /*useEffect(() => {
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
  }, [searchQuery, courses]);*/

  //TODO: opisać do czego to służy i dlaczego są dwa
  useEffect(() => {
    fetchCourses({ query: searchQuery });
  }, [searchQuery]);

  // Fetch courses (bez filtrów przy starcie)
  useEffect(() => {
    fetchCourses();
  }, []);



  //TODO: same calle przenieść do innego pliku i wykorzystać api.ts
  //odp: przeniesione wszystkie calle do pliku apiCalls.ts
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categories, levels, languages] = await Promise.all([
          getCourseCategories(),
          getCourseLevels(),
          getCourseLanguages(),
        ]);

        setCategories([...new Set(categories)]);
        setLevels([...new Set(levels)]);
        setLanguages([...new Set(languages)]);
      } catch (err) {
        console.error("Error fetching filter data:", err);
        toast.error("Could not load filter data.");
      }
    };

    loadFilters();
  }, []);


  const fetchCourses = async (filters?: Parameters<typeof getCourses>[0]) => {
    setLoading(true);
    try {
      const data = await getCourses(filters);
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mapowanie etykiety zakresu cen na from/to
  const mapPriceLabelToRange = (
    label?: string,
  ): { from?: number; to?: number } => {
    if (!label) return {};
    const found = PRICE_OPTIONS.find((opt) => opt.label === label);
    return found ? { from: found.from, to: found.to } : {};
  };

  // Apply filters
  const handleApplyFilters = () => {
    const { from: priceFrom, to: priceTo } = mapPriceLabelToRange(
      selectedPrice[0]?.value,
    );

    const filters = {
      ...(selectedCategory.length && {
        categories: selectedCategory.map((c) => c.value),
      }),
      ...(selectedLevel.length && {
        levels: selectedLevel.map((l) => l.value),
      }),
      ...(selectedLanguage.length && {
        languages: selectedLanguage.map((l) => l.value),
      }),
      ...(priceFrom !== undefined && { priceFrom }),
      ...(priceTo !== undefined && { priceTo }),
      ...(searchQuery && { query: searchQuery }),
    };

    fetchCourses(filters);
  };

  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Content>
        <div className="p-8 w-full z-1 shadow-lg left-0 flex flex-col gap-4">
          <Label className="text-2xl font-bold">Our courses</Label>
          <div className="flex flex-row gap-4 items-end">
            <FilterDropdown
              label="Category"
              placeholder="Select category"
              searchPlaceholder="Search category..."
              emptyMessage="No category found."
              items={categories.map((c) => {
                return { name: c, value: c };
              })}
              multiselect={true}
              onSelectionChange={setSelectedCategory}
            />
            <FilterDropdown
              label="Level"
              placeholder="Select level"
              searchPlaceholder="Search level..."
              emptyMessage="No level found."
              items={levels.map((l) => {
                return { name: l, value: l };
              })}
              multiselect={false}
              onSelectionChange={setSelectedLevel}
            />
            <FilterDropdown
              label="Price"
              placeholder="Select price range"
              searchPlaceholder="Search price..."
              emptyMessage="No price range found."
              items={PRICE_OPTIONS.map((p) => {
                return {
                  name: p.label,
                  value: p.label,
                };
              })}
              multiselect={false}
              onSelectionChange={setSelectedPrice}
            />
            <FilterDropdown
              label="Language"
              placeholder="Select language"
              searchPlaceholder="Search language..."
              emptyMessage="No language found."
              items={languages.map((l) => {
                return { name: l, value: l };
              })}
              multiselect={false}
              onSelectionChange={setSelectedLanguage}
            />
            <Button onClick={handleApplyFilters}>Apply filters</Button>
          </div>
        </div>
        <div className="flex flex-col gap-8 p-8">
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.name}
                  imageUrl={
                    course.profilePictureUrl ??
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
