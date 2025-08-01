import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { List, Film, Tv } from "lucide-react";
import { apiRequest } from "../lib/queryClient";

interface Stats {
  total: number;
  movies: number;
  tv_shows: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => await apiRequest("GET", "/stats"),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Entries
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <List className="text-blue-600 h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Movies</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.movies || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Film className="text-green-600 h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">TV Shows</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.tv_shows || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tv className="text-purple-600 h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
