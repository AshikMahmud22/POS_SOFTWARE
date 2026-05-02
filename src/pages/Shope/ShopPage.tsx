import React, { useState, useEffect } from "react";
import { PlusCircle, Filter, Loader2 } from "lucide-react";
import API from "../../api/axiosInstance";
import ShopFormModal from "./ShopFormModal";
import ShopTable, { IShopEntry } from "./ShopTable";
import { Pagination } from "../../components/Pagination/Pagination";

interface ApiResponse {
  success: boolean;
  data: IShopEntry[];
}

const ShopPage: React.FC = () => {
  const [entries, setEntries] = useState<IShopEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<IShopEntry | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<{ month: string; year: string }>({ month: "", year: "" });
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  const fetchEntries = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await API.get<ApiResponse>("/shop/get-entries");
      if (res.data.success) {
        const data = res.data.data;
        setEntries(data);
        if (data.length > 0 && filter.year === "") {
          const years = [...new Set(data.map((e: IShopEntry) => e.year))].sort().reverse();
          setFilter(prev => ({ ...prev, year: years[0] }));
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [refreshTrigger]);

  const availableYears: string[] = Array.from(new Set(entries.map((e: IShopEntry) => e.year))).sort().reverse();

  const availableMonths: string[] = Array.from(
    new Set(
      entries
        .filter((e: IShopEntry) => e.year === filter.year)
        .map((e: IShopEntry) => e.month)
    )
  );

  const filteredEntries: IShopEntry[] = entries.filter(
    (ent: IShopEntry) =>
      (filter.year === "" || ent.year === filter.year) &&
      (filter.month === "" || ent.month === filter.month)
  );

  const itemsPerPage = 10;
  const totalPages: number = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const currentData: IShopEntry[] = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const initialEmpty: IShopEntry = {
    date: new Date().toISOString().split("T")[0],
    month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date()),
    year: new Date().getFullYear().toString(),
    productDetails: "",
    quantity: 0,
    productValue: 0,
    totalCost: 0,
    previousDue: 0,
    deposit: 0,
    truckFair: 0,
    restTotalAmount: 0,
    sign: "",
    adminEmail: "",
    adminName: "",
  };

  const handleRefresh = (): void => setRefreshTrigger((prev) => !prev);

  return (
    <div className=" md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
            Shop Ledger
          </h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Manage sales and dues
          </p>
        </div>
        <button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="w-auto border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm"
        >
          <PlusCircle size={20} /> New Entry
        </button>
      </div>

      <div className="p-5 rounded-[1.5rem] border dark:border-gray-800 mb-8 flex flex-wrap items-center gap-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3 dark:text-blue-400 text-blue-950 font-black text-[10px] uppercase tracking-widest">
          <Filter size={14} /> Filters
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter.year}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter({ year: e.target.value, month: "" });
              setCurrentPage(1);
            }}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer"
          >
            <option value="">Select Year</option>
            {availableYears.map((y: string) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={filter.month}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter({ ...filter, month: e.target.value });
              setCurrentPage(1);
            }}
            disabled={!filter.year}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Months</option>
            {availableMonths.map((m: string) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm overflow-hidden border dark:border-gray-800">
          <ShopTable
            data={currentData}
            onEdit={(item: IShopEntry) => {
              setEditingData(item);
              setIsModalOpen(true);
            }}
            refreshData={async () => handleRefresh()}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ShopFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleRefresh}
        isEditing={!!editingData}
        initialData={editingData || initialEmpty}
      />
    </div>
  );
};

export default ShopPage;