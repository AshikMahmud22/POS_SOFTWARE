import React, { useState, useEffect } from "react";
import { PlusCircle, Loader2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { ICollection } from "../../types/collection";
import { getCollections } from "../../services/collectionService";
import CollectionTable from "./CollectionTable";
import CollectionFormModal from "./CollectionFormModal";
import { Pagination } from "../../components/Pagination/Pagination";

const ITEMS_PER_PAGE = 10;

const EMPTY: ICollection = {
  date: new Date().toISOString().split("T")[0],
  month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date()),
  year: new Date().getFullYear().toString(),
  partyId: "",
  partyName: "",
  bag: 0,
  rate: 0,
  rateType: "factory",
  totalCost: 0,
  truckFairType: "dealer",
  truckFair: 0,
  previousDue: 0,
  cashCollection: 0,
  totalDeposit: 0,
  partyBalance: 0,
  adminName: "",
  adminEmail: "",
};

const CollectionPage: React.FC = () => {
  const [entries, setEntries] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<ICollection | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchEntries = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getCollections();
      if (res.success) setEntries(res.data);
    } catch {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const filteredEntries = entries.filter((e) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return e.partyName.toLowerCase().includes(q) || e.date.includes(q);
  });

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRefresh = async (): Promise<void> => { await fetchEntries(); };

  return (
    <div className="md:p-8 p-4 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
      <div className="max-w-[1700px] mx-auto space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
              Collection
            </h1>
            <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
              Manage retailer collection entries
            </p>
          </div>
          <button
            onClick={() => { setEditingData(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl dark:bg-transparent bg-blue-950 dark:border border-gray-700 text-white font-black text-xs uppercase tracking-widest  transition-all"
          >
            <PlusCircle size={16} /> New Entry
          </button>
        </div>

        <div className="space-y-px rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40">
          <div className="bg-white dark:bg-[#0c1525] p-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by party name or date..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 dark:text-white rounded-lg font-bold outline-none text-xs border border-slate-200 dark:border-slate-700/50 focus:border-blue-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-black text-[9px] uppercase"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <CollectionTable
              data={paginatedEntries}
              onEdit={(item) => { setEditingData(item); setIsModalOpen(true); }}
              refreshData={handleRefresh}
            />
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <CollectionFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingData(null); }}
        onSubmitSuccess={handleRefresh}
        isEditing={!!editingData}
        initialData={editingData || EMPTY}
      />
    </div>
  );
};

export default CollectionPage;