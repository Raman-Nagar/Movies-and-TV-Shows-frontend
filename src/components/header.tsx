import { Film, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { UserPopover } from "../components/user-popover";

const Header = ({
  setShowAddModal,
}: {
  setShowAddModal: (v: boolean) => void;
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Film className="text-white text-lg h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Movies & TV Shows
              </h1>
              <p className="text-sm text-slate-500">Manage your favorites</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </Button>
            <UserPopover />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
