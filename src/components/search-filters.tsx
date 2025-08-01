import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetFilters: () => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  onResetFilters,
}: SearchFiltersProps) {
  return (
    <Card className="bg-white shadow-sm border border-slate-200 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-wrap lg:items-center lg:justify-end gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            />
          </div>

          <Button
            variant="outline"
            onClick={onResetFilters}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
