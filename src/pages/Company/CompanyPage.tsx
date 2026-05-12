import React, { useState, useEffect, useRef, useMemo } from "react";
import { PlusCircle, Loader2, Search } from "lucide-react";
import CompanyFormModal from "./CompanyFormModal";
import { Pagination } from "../../components/Pagination/Pagination";
import { ICompanyEntry, EMPTY_COMPANY_FORM } from "../../types/companies";
import CompanyTable from "./CompanyTable";
import { getCompanyEntries } from "../../services/companyService";

const CompanyPage: React.FC = () => {
  const [entries, setEntries] = useState<ICompanyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<ICompanyEntry | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<{
    month: string;
    year: string;
    category: string;
    subcategory: string;
    company: string;
  }>({ month: "", year: "", category: "", subcategory: "", company: "" });
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const isFirstLoad = useRef<boolean>(true);

  const fetchEntries = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getCompanyEntries({});
      if (res.success) {
        setEntries(res.data);
        if (isFirstLoad.current && res.data.length > 0) {
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

const availableYears = useMemo(() => {
  const filtered = filter.company
    ? entries.filter((e) => e.companyName === filter.company)
    : entries;
  return Array.from(new Set(filtered.map((e) => e.year))).sort((a, b) => Number(b) - Number(a));
}, [entries, filter.company]);

  const availableMonths = useMemo(() => {
    if (!filter.year) return [];
    return Array.from(new Set(entries.filter((e) => e.year === filter.year).map((e) => e.month)));
  }, [entries, filter.year]);

  const availableCategories = useMemo(() => {
    if (!filter.year || !filter.month) return [];
    return Array.from(new Set(
      entries.filter((e) => e.year === filter.year && e.month === filter.month)
        .map((e) => e.category).filter(Boolean)
    ));
  }, [entries, filter.year, filter.month]);

  const availableSubcategories = useMemo(() => {
    if (!filter.year || !filter.month || !filter.category) return [];
    return Array.from(new Set(
      entries.filter((e) =>
        e.year === filter.year && e.month === filter.month && e.category === filter.category
      ).map((e) => e.subcategory).filter(Boolean)
    ));
  }, [entries, filter.year, filter.month, filter.category]);

  const availableCompanies = useMemo(() =>
    Array.from(new Set(entries.map((e) => e.companyName).filter(Boolean))).sort(),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    return entries.filter((ent) => {
      const matchesSearch = ent.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = filter.year === "" || ent.year === filter.year;
      const matchesMonth = filter.month === "" || ent.month === filter.month;
      const matchesCategory = filter.category === "" || ent.category === filter.category;
      const matchesSubcategory = filter.subcategory === "" || ent.subcategory === filter.subcategory;
      const matchesCompany = filter.company === "" || ent.companyName === filter.company;
      return matchesSearch && matchesYear && matchesMonth && matchesCategory && matchesSubcategory && matchesCompany;
    });
  }, [entries, searchTerm, filter]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const currentData = useMemo(() =>
    filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredEntries, currentPage]
  );

  const handleRefresh = (): void => setRefreshTrigger((prev) => !prev);
  const hasActiveFilters = searchTerm || filter.year || filter.month || filter.category || filter.subcategory || filter.company;

  return (
    <div className="md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
            Company Ledger
          </h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Manage DO Records and Bank Deposits
          </p>
        </div>
        <button
          onClick={() => { setEditingData(null); setIsModalOpen(true); }}
          className="w-auto dark:border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm"
        >
          <PlusCircle size={20} /> New Entry
        </button>
      </div>

      <div className="p-5 rounded-[1.5rem] border dark:border-gray-800 mb-8 space-y-4 bg-white dark:bg-gray-900 shadow-sm flex md:justify-between justify-center items-center flex-wrap gap-4">
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl font-bold outline-none text-sm border dark:border-transparent focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <select
            value={filter.company}
            onChange={(e) => { setFilter((prev) => ({ ...prev, company: e.target.value })); setCurrentPage(1); }}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2.5 rounded-xl font-bold outline-none text-sm cursor-pointer border dark:border-transparent min-w-[150px]"
          >
            <option value="">All Companies</option>
            {availableCompanies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

         <select
  value={filter.year}
  onChange={(e) => { setFilter({ year: e.target.value, month: "", category: "", subcategory: "", company: filter.company }); setCurrentPage(1); }}
  disabled={!filter.company}
  className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2.5 rounded-xl font-bold outline-none text-sm cursor-pointer border dark:border-transparent disabled:opacity-30 min-w-[130px]"
>
  <option value="">All Years</option>
  {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
</select>

          <select
            value={filter.month}
            onChange={(e) => { setFilter((prev) => ({ ...prev, month: e.target.value, category: "", subcategory: "" })); setCurrentPage(1); }}
            disabled={!filter.year}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2.5 rounded-xl font-bold outline-none text-sm cursor-pointer border dark:border-transparent disabled:opacity-30 min-w-[130px]"
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={filter.category}
            onChange={(e) => { setFilter((prev) => ({ ...prev, category: e.target.value, subcategory: "" })); setCurrentPage(1); }}
            disabled={!filter.month}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2.5 rounded-xl font-bold outline-none text-sm cursor-pointer border dark:border-transparent disabled:opacity-30 min-w-[130px]"
          >
            <option value="">All Categories</option>
            {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filter.subcategory}
            onChange={(e) => { setFilter((prev) => ({ ...prev, subcategory: e.target.value })); setCurrentPage(1); }}
            disabled={!filter.category}
            className="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 py-2.5 rounded-xl font-bold outline-none text-sm cursor-pointer border dark:border-transparent disabled:opacity-30 min-w-[130px]"
          >
            <option value="">All Subcategories</option>
            {availableSubcategories.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => { setFilter({ year: "", month: "", category: "", subcategory: "", company: "" }); setSearchTerm(""); setCurrentPage(1); }}
              className="text-[10px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-red-200 dark:border-red-900/30 px-4 py-2.5 rounded-xl"
            >
              Reset
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
          <CompanyTable
            companies={currentData}
            onEdit={(item) => { setEditingData(item); setIsModalOpen(true); }}
            refreshData={async () => handleRefresh()}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleRefresh}
        isEditing={!!editingData}
        initialData={editingData || EMPTY_COMPANY_FORM}
      />
    </div>
  );
};

export default CompanyPage;