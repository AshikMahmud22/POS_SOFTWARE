import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Filter, Loader2 } from "lucide-react";
import ShopFormModal from "./ShopFormModal";
import { Pagination } from "../../components/Pagination/Pagination";
import { getShopEntries } from "../../services/shopService";
import { IShopEntry } from "../../types/shop";
import ShopTable from "./ShopTable";

const ShopPage: React.FC = () => {
  const [entries, setEntries] = useState<IShopEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<IShopEntry | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<{
    month: string;
    year: string;
    category: string;
    subcategory: string;
  }>({
    month: "",
    year: "",
    category: "",
    subcategory: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const isFirstLoad = useRef<boolean>(true);

  const fetchEntries = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getShopEntries();
      if (res.success) {
        const data = res.data;
        setEntries(data);
        if (isFirstLoad.current && data.length > 0) {
          isFirstLoad.current = false;
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

  const availableYears: string[] = Array.from(
    new Set(entries.map((e: IShopEntry) => e.year))
  )
    .sort()
    .reverse();

  const availableMonths: string[] = Array.from(
    new Set(
      entries
        .filter((e: IShopEntry) => filter.year !== "" && e.year === filter.year)
        .map((e: IShopEntry) => e.month)
    )
  );

  const availableCategories: string[] = Array.from(
    new Set(
      entries
        .filter(
          (e: IShopEntry) =>
            filter.year !== "" &&
            e.year === filter.year &&
            filter.month !== "" &&
            e.month === filter.month
        )
        .map((e: IShopEntry) => e.category)
        .filter(Boolean)
    )
  );

  const availableSubcategories: string[] = Array.from(
    new Set(
      entries
        .filter(
          (e: IShopEntry) =>
            filter.year !== "" &&
            e.year === filter.year &&
            filter.month !== "" &&
            e.month === filter.month &&
            filter.category !== "" &&
            e.category === filter.category
        )
        .map((e: IShopEntry) => e.subcategory)
        .filter(Boolean)
    )
  );

  const filteredEntries: IShopEntry[] = entries.filter(
    (ent: IShopEntry) =>
      (filter.year === "" || ent.year === filter.year) &&
      (filter.month === "" || ent.month === filter.month) &&
      (filter.category === "" || ent.category === filter.category) &&
      (filter.subcategory === "" || ent.subcategory === filter.subcategory)
  );

  const itemsPerPage = 10;
  const totalPages: number =
    Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const sortedEntries = [...filteredEntries].reverse();
const currentData: IShopEntry[] = sortedEntries.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  const initialEmpty: IShopEntry = {
    date: new Date().toISOString().split("T")[0],
    month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date()),
    year: new Date().getFullYear().toString(),
    category: "",
    subcategory: "",
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

  const hasActiveFilters = filter.year || filter.month || filter.category || filter.subcategory;



  
  return (
    <div className="md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
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
          className="w-auto dark:border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm"
        >
          <PlusCircle size={20} /> New Entry
        </button>
      </div>

      <div className="p-5 rounded-[1.5rem] border dark:border-gray-800 mb-8 flex flex-wrap items-center  gap-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3 dark:text-blue-400 text-blue-950 font-black text-[10px] uppercase tracking-widest ">
          <Filter size={14} /> Filters
        </div>
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <select
            value={filter.year}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter({ year: e.target.value, month: "", category: "", subcategory: "" });
              setCurrentPage(1);
            }}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer"
          >
            <option value="">All Years</option>
            {availableYears.map((y: string) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={filter.month}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter((prev) => ({ ...prev, month: e.target.value, category: "", subcategory: "" }));
              setCurrentPage(1);
            }}
            disabled={!filter.year}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Months</option>
            {availableMonths.map((m: string) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={filter.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter((prev) => ({ ...prev, category: e.target.value, subcategory: "" }));
              setCurrentPage(1);
            }}
            disabled={!filter.month}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {availableCategories.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filter.subcategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter((prev) => ({ ...prev, subcategory: e.target.value }));
              setCurrentPage(1);
            }}
            disabled={!filter.category}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Subcategories</option>
            {availableSubcategories.map((s: string) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilter({ year: "", month: "", category: "", subcategory: "" });
                setCurrentPage(1);
              }}
              className="text-[10px] font-semibold uppercase text-red-500 hover:text-red-700 transition-colors border px-4 py-2 rounded-xl dark:border-gray-800"
            >
              Clear Filters
            </button>
          )}
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