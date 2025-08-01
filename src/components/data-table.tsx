import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { Film, Tv, Edit, Trash2, Loader2 } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import type { Entry } from "../types";
import { useDebounce } from "../hooks/use-debounce";

interface DataTableProps {
  searchQuery: string;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

interface EntriesResponse {
  entries: Entry[];
  total: number;
}

export default function DataTable({
  searchQuery,
  onEdit,
  onDelete,
}: DataTableProps) {
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      limit: "20",
    });

    if (debouncedSearch) params.append("search", debouncedSearch);
    return params;
  }, [debouncedSearch]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["/api/entries", debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams(queryParams);
      params.set("offset", pageParam.toString());
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/entries?${params}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch entries");

      return res.json() as Promise<EntriesResponse>;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.entries.length,
        0
      );
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    initialPageParam: 0,
  });

  // Invalidate query on filter/search change
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["/api/entries"],
    });
  }, [debouncedSearch, queryClient]);

  // Intersection observer to auto-load more
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allEntries = data?.pages.flatMap((page) => page.entries) ?? [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-500">Loading entries...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-600">
            Failed to load entries. Please try again.
          </p>
        </div>
      );
    }

    if (allEntries.length === 0) {
      return (
        <div className="p-8 text-center">
          <Film className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-500">
            No entries found. Add your first movie or TV show!
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                {[
                  "Title",
                  "Type",
                  "Director",
                  "Budget",
                  "Location",
                  "Duration",
                  "Year",
                  "Actions",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="py-3 px-4 text-left font-medium text-slate-900"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-slate-50">
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                        {entry.type === "movie" ? (
                          <Film className="h-5 w-5 text-slate-500" />
                        ) : (
                          <Tv className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <p className="font-medium text-slate-900">
                        {entry.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.type === "movie"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {entry.type === "movie" ? "Movie" : "TV Show"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-slate-900">
                    {entry.director}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-slate-900">
                    {entry.budget}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-slate-500">
                    {entry.location}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-slate-900">
                    {entry.duration}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-slate-900">
                    {entry.year}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        className="text-slate-500 hover:text-primary hover:bg-primary/10 p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(entry)}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div
          ref={loadMoreRef}
          className="p-6 text-center border-t border-slate-200"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more entries...</span>
            </div>
          ) : hasNextPage ? (
            <div className="h-4" />
          ) : (
            <p className="text-slate-500">No more entries to load</p>
          )}
        </div>
      </>
    );
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      {renderContent()}
    </Card>
  );
}
