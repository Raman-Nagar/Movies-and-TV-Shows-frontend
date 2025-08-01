import { useState } from "react";
import StatsCards from "../components/stats-cards";
import SearchFilters from "../components/search-filters";
import DataTable from "../components/data-table";
import AddEditModal from "../components/add-edit-modal";
import DeleteConfirmationModal from "../components/delete-confirmation-modal";
import type { Entry } from "../types";
import Header from "../components/header";

export default function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
  };

  const handleDelete = (entry: Entry) => {
    setDeletingEntry(entry);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setEditingEntry(null);
    setDeletingEntry(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <Header setShowAddModal={setShowAddModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards />

        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onResetFilters={handleResetFilters}
        />

        <DataTable
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modals */}
      <AddEditModal
        isOpen={showAddModal || !!editingEntry}
        onClose={handleCloseModals}
        entry={editingEntry}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingEntry}
        onClose={handleCloseModals}
        entry={deletingEntry}
      />
    </div>
  );
}
