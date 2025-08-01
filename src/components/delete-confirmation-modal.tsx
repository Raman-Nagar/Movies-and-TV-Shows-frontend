import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { apiRequest } from "../lib/queryClient";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Entry } from "../types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry | null;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  entry,
}: DeleteConfirmationModalProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === "/api/entries",
      });
      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === "/api/stats",
      });
      toast.success("Entry deleted successfully");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete entry");
    },
  });

  const handleConfirmDelete = () => {
    if (entry) {
      mutation.mutate(entry.id.toString());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Entry
              </h3>
              <p className="text-sm text-slate-500">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-slate-700 mb-6">
            Are you sure you want to delete "
            <span className="font-medium">{entry?.title}</span>"? This will
            permanently remove this entry from your collection.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={mutation.isPending}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
