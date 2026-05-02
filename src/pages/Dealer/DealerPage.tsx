import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Pagination } from "../../components/Pagination/Pagination";
import DealerTable from "./DealerTable";
import DealerFormModal from "./DealerFormModal";
import { getDealerEntries, deleteDealerEntry, IDealerEntry } from "../../services/dealerService";

const DealerPage: React.FC = () => {
  const [entries, setEntries] = useState<IDealerEntry[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<IDealerEntry | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchEntries = useCallback(async (
    page: number,
    searchVal: string,
    filterVal: { month: string; year: string },
    isInitial = false
  ) => {
    try {
      if (isInitial) setInitialLoading(true);
      const response = await getDealerEntries({
        page,
        search: searchVal,
        month: filterVal.month,
        year: filterVal.year,
        limit: 10
      });
      if (response.success) {
        setEntries(response.data);
        setTotalPages(response.totalPages);
        setAvailableYears(response.availableYears);
        setAvailableMonths(response.availableMonths || []);
      }
    } catch {
      toast.error("Failed to load records");
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(1, "", { month: "", year: "" }, true);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchEntries(1, search, filter);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleYearChange = (year: string) => {
    const newFilter = { year, month: "" };
    setFilter(newFilter);
    setCurrentPage(1);
    fetchEntries(1, search, newFilter);
  };

  const handleMonthChange = (month: string) => {
    const newFilter = { ...filter, month };
    setFilter(newFilter);
    setCurrentPage(1);
    fetchEntries(1, search, newFilter);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEntries(page, search, filter);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteDealerEntry(id);
      if (res.success) {
        toast.success(res.message);
        fetchEntries(currentPage, search, filter);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item: IDealerEntry) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleAfterSave = () => {
    setCurrentPage(1);
    fetchEntries(1, search, filter);
  };

  return (
    <div className="md:p-8 mt-10 min-h-screen">
      <div className="flex flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-blue-950 dark:text-white uppercase italic tracking-tighter">
            Dealer Details
          </h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            Lifting & Delivery Management
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-950 dark:bg-transparent dark:border border-gray-700 text-white px-10 py-4 rounded-2xl font-black uppercase italic hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center"
        >
          <Plus size={20} strokeWidth={3} /> Entry
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Party or DO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:border-gray-800 bg-transparent dark:text-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div className="p-2 rounded-2xl border dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900 shadow-sm justify-center">
          <div className="flex items-center gap-2 pl-2 text-blue-900 dark:text-white font-black text-[10px] uppercase italic">
            <Filter size={14} /> Filters
          </div>
          <select
            value={filter.year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl font-bold dark:text-white text-xs outline-none cursor-pointer"
          >
            <option value="">All Years</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={filter.month}
            onChange={(e) => handleMonthChange(e.target.value)}
            disabled={!filter.year}
            className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl font-bold text-xs outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed dark:text-white"
          >
            <option value="">All Months</option>
            {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {initialLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-blue-950" size={40} />
        </div>
      ) : (
        <>
          <DealerTable
            entries={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      <DealerFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        refreshData={handleAfterSave}
      />
    </div>
  );
};

export default DealerPage;