import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface FilterSidebarProps {
  categories: string[];
  provinces: string[];
  selectedCategory: string;
  selectedProvince: string;
  onCategoryChange: (category: string) => void;
  onProvinceChange: (province: string) => void;
}

const FilterSidebar = ({
  categories,
  provinces,
  selectedCategory,
  selectedProvince,
  onCategoryChange,
  onProvinceChange,
}: FilterSidebarProps) => {
  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-soft">
      <div>
        <h3 className="mb-3 font-semibold">หมวดหมู่สินค้า</h3>
        <div className="space-y-2">
          <Button
            variant={selectedCategory === "" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCategoryChange("")}
          >
            ทั้งหมด
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-semibold">จังหวัด</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            <Button
              variant={selectedProvince === "" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onProvinceChange("")}
            >
              ทั้งหมด
            </Button>
            {provinces.map((province) => (
              <Button
                key={province}
                variant={selectedProvince === province ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onProvinceChange(province)}
              >
                {province}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default FilterSidebar;
