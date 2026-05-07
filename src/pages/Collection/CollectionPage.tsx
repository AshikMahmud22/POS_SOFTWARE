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
  totalCost: 0,
  truckFairType: "party",
  truckFair: 0,
  previousDue: 0,
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

  useEffect(() => {
    fetchEntries();
  }, []);

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

  const handleRefresh = async (): Promise<void> => {
    await fetchEntries();
  };

  return (
    <div className="md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10 overflow-x-hidden">
      <div className="flex flex-wrap flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
            Collection
          </h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Manage party ledger entries
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="w-auto dark:border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white  p-4 rounded-full sm:flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm hidden sm:block"
        >
          <PlusCircle size={20} /> new entry
        </button>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="w-auto dark:border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white  p-4 rounded-full flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm sm:hidden"
        >
          <PlusCircle size={20} />
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by party name or date..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-black text-xs uppercase"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <>
          <CollectionTable
            data={paginatedEntries}
            onEdit={(item) => {
              setEditingData(item);
              setIsModalOpen(true);
            }}
            refreshData={handleRefresh}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <CollectionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSubmitSuccess={handleRefresh}
        isEditing={!!editingData}
        initialData={editingData || EMPTY}
      />
    </div>
  );
};

export default CollectionPage;