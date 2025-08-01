import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { apiRequest } from "../lib/queryClient";
import { Check } from "lucide-react";
import { insertEntrySchema, type Entry, type InsertEntry } from "../types";

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: Entry | null;
}

export default function AddEditModal({
  isOpen,
  onClose,
  entry,
}: AddEditModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!entry;

  const form = useForm<InsertEntry>({
    resolver: zodResolver(insertEntrySchema),
    defaultValues: {
      title: "",
      type: "movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: "",
    },
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        title: entry.title,
        type: entry.type,
        director: entry.director,
        budget: entry.budget?.toString(),
        location: entry.location,
        duration: entry.duration,
        year: entry.year?.toString(),
      });
    } else {
      form.reset();
    }
  }, [entry, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertEntry) => {
      if (isEditing && entry) {
        return await apiRequest("PUT", `/entries/${entry.id}`, data);
      } else {
        return await apiRequest("POST", "/entries", data);
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === "/api/entries",
      });
      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === "/api/stats",
      });

      toast.success("Entry saved!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.message || `Failed to ${isEditing ? "update" : "create"} entry`
      );
    },
  });

  const onSubmit = (data: InsertEntry) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Edit Entry" : "Add New Entry"}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Title *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        {...field}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Type *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="tv-show">TV Show</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Director *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter director name"
                        {...field}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Budget *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1000000"
                        {...field}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Location *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Filming location"
                        {...field}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Duration *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 148 min or 49 min/episode"
                        {...field}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Year/Time *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2010"
                        {...field}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{isEditing ? "Update Entry" : "Save Entry"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
