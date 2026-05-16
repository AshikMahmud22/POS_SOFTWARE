import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Pagination } from "../../components/Pagination/Pagination";
import { getRetailerEntries } from "../../services/retailerService";
import { IRetailerEntry } from "../../types/retailer";
import RetailerTable from "./RetailerTable";

const RetailerPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<IRetailerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<{
    month: string;
    year: string;
    companyName: string;
    category: string;
    subcategory: string;
  }>({ month: "", year: "", companyName: "", category: "", subcategory: "" });
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const isFirstLoad = useRef<boolean>(true);

  const fetchEntries = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getRetailerEntries();
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

  const availableYears: string[] = Array.from(new Set(entries.map((e) => e.year))).sort().reverse();

  const availableMonths: string[] = Array.from(
    new Set(
      entries
        .filter((e) => filter.year !== "" && e.year === filter.year)
        .map((e) => e.month)
    )
  );

  const availableCompanyNames: string[] = Array.from(
    new Set(
      entries
        .filter(
          (e) =>
            filter.year !== "" && e.year === filter.year &&
            filter.month !== "" && e.month === filter.month
        )
        .map((e) => e.companyName)
        .filter(Boolean)
    )
  );

  const availableCategories: string[] = Array.from(
    new Set(
      entries
        .filter(
          (e) =>
            filter.year !== "" && e.year === filter.year &&
            filter.month !== "" && e.month === filter.month &&
            filter.companyName !== "" && e.companyName === filter.companyName
        )
        .map((e) => e.category)
        .filter(Boolean)
    )
  );

  const availableSubcategories: string[] = Array.from(
    new Set(
      entries
        .filter(
          (e) =>
            filter.year !== "" && e.year === filter.year &&
            filter.month !== "" && e.month === filter.month &&
            filter.companyName !== "" && e.companyName === filter.companyName &&
            filter.category !== "" && e.category === filter.category
        )
        .map((e) => e.subcategory)
        .filter(Boolean)
    )
  );

  const filteredEntries: IRetailerEntry[] = entries.filter(
    (ent) =>
      (filter.year === "" || ent.year === filter.year) &&
      (filter.month === "" || ent.month === filter.month) &&
      (filter.companyName === "" || ent.companyName === filter.companyName) &&
      (filter.category === "" || ent.category === filter.category) &&
      (filter.subcategory === "" || ent.subcategory === filter.subcategory)
  );

  const itemsPerPage = 10;
  const totalPages: number = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const currentData: IRetailerEntry[] = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = (): void => setRefreshTrigger((prev) => !prev);
  const hasActiveFilters = filter.year || filter.month || filter.companyName || filter.category || filter.subcategory;

  return (
    <div className="md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
            Retailer Ledger
          </h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Manage retailer sales and dues
          </p>
        </div>
        <button
          onClick={() => navigate("/retailer/new")}
          className="w-auto dark:border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm"
        >
          <PlusCircle size={20} /> New Entry
        </button>
      </div>

      <div className="p-5 rounded-[1.5rem] border dark:border-gray-800 mb-8 flex flex-wrap items-center gap-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3 dark:text-blue-400 text-blue-950 font-black text-[10px] uppercase tracking-widest">
          <Filter size={14} /> Filters
        </div>
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <select
            value={filter.year}
            onChange={(e) => {
              setFilter({ year: e.target.value, month: "", companyName: "", category: "", subcategory: "" });
              setCurrentPage(1);
            }}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer"
          >
            <option value="">All Years</option>
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={filter.month}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, month: e.target.value, companyName: "", category: "", subcategory: "" }));
              setCurrentPage(1);
            }}
            disabled={!filter.year}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={filter.companyName}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, companyName: e.target.value, category: "", subcategory: "" }));
              setCurrentPage(1);
            }}
            disabled={!filter.month}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Companies</option>
            {availableCompanyNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filter.category}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, category: e.target.value, subcategory: "" }));
              setCurrentPage(1);
            }}
            disabled={!filter.companyName}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filter.subcategory}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, subcategory: e.target.value }));
              setCurrentPage(1);
            }}
            disabled={!filter.category}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold outline-none text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">All Subcategories</option>
            {availableSubcategories.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilter({ year: "", month: "", companyName: "", category: "", subcategory: "" });
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
          <RetailerTable
            data={currentData}
            onEdit={(item: IRetailerEntry) => navigate(`/retailer/edit/${item._id}`)}
            refreshData={async () => handleRefresh()}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default RetailerPage;