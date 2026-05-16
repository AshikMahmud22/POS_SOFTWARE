import React, { useState, useEffect, useRef, useMemo } from "react";
import { PlusCircle, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Pagination } from "../../components/Pagination/Pagination";
import { ICompanyEntry } from "../../types/companies";
import CompanyTable from "./CompanyTable";
import { getCompanyEntries } from "../../services/companyService";

const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ICompanyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        if (isFirstLoad.current && res.data.length > 0)
          isFirstLoad.current = false;
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

  const previousDueMap = useMemo(() => {
    const map: Record<string, number> = {};
    const byCompany: Record<string, ICompanyEntry[]> = {};

    entries.forEach((e) => {
      if (!e.companyName) return;
      if (!byCompany[e.companyName]) byCompany[e.companyName] = [];
      byCompany[e.companyName].push(e);
    });

    Object.values(byCompany).forEach((group) => {
      const sorted = [...group].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });

      sorted.forEach((entry, index) => {
        if (index === 0) {
          map[String(entry._id)] = 0;
        } else {
          const prev = sorted[index - 1];
          map[String(entry._id)] = Number(prev.dueAmount) || 0;
        }
      });
    });

    return map;
  }, [entries]);

  const availableCompanies = useMemo(
    () =>
      Array.from(
        new Set(entries.map((e) => e.companyName).filter(Boolean)),
      ).sort(),
    [entries],
  );

  const availableYears = useMemo(() => {
    if (!filter.company) return [];
    return Array.from(
      new Set(
        entries
          .filter((e) => e.companyName === filter.company)
          .map((e) => e.year),
      ),
    ).sort((a, b) => Number(b) - Number(a));
  }, [entries, filter.company]);

  const availableMonths = useMemo(() => {
    if (!filter.company || !filter.year) return [];
    return Array.from(
      new Set(
        entries
          .filter(
            (e) => e.companyName === filter.company && e.year === filter.year,
          )
          .map((e) => e.month),
      ),
    );
  }, [entries, filter.company, filter.year]);

  const availableCategories = useMemo(() => {
    if (!filter.company || !filter.year || !filter.month) return [];
    return Array.from(
      new Set(
        entries
          .filter(
            (e) =>
              e.companyName === filter.company &&
              e.year === filter.year &&
              e.month === filter.month,
          )
          .map((e) => e.category)
          .filter(Boolean),
      ),
    );
  }, [entries, filter.company, filter.year, filter.month]);

  const availableSubcategories = useMemo(() => {
    if (!filter.company || !filter.year || !filter.month || !filter.category)
      return [];
    return Array.from(
      new Set(
        entries
          .filter(
            (e) =>
              e.companyName === filter.company &&
              e.year === filter.year &&
              e.month === filter.month &&
              e.category === filter.category,
          )
          .map((e) => e.subcategory)
          .filter(Boolean),
      ),
    );
  }, [entries, filter.company, filter.year, filter.month, filter.category]);

  const filteredEntries = useMemo(
    () =>
      entries.filter((ent) => {
        const matchesSearch = ent.companyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesYear = filter.year === "" || ent.year === filter.year;
        const matchesMonth = filter.month === "" || ent.month === filter.month;
        const matchesCategory =
          filter.category === "" || ent.category === filter.category;
        const matchesSubcategory =
          filter.subcategory === "" || ent.subcategory === filter.subcategory;
        const matchesCompany =
          filter.company === "" || ent.companyName === filter.company;
        return (
          matchesSearch &&
          matchesYear &&
          matchesMonth &&
          matchesCategory &&
          matchesSubcategory &&
          matchesCompany
        );
      }),
    [entries, searchTerm, filter],
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const currentData = useMemo(
    () =>
      filteredEntries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [filteredEntries, currentPage],
  );

  const handleRefresh = (): void => setRefreshTrigger((prev) => !prev);
  const hasActiveFilters =
    searchTerm ||
    filter.year ||
    filter.month ||
    filter.category ||
    filter.subcategory ||
    filter.company;

  const selectCls =
    "bg-slate-50 dark:bg-slate-800/60 dark:text-white px-3 py-2 rounded-lg font-bold outline-none text-xs cursor-pointer border border-slate-200 dark:border-slate-700/50 disabled:opacity-30 min-w-[130px] focus:border-blue-500 transition-all";

  return (
    <div className="md:p-8 p-4 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
      <div className="max-w-[1700px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
              Company Ledger
            </h1>
            <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
              Manage DO Records and Bank Deposits
            </p>
          </div>
          <button
            onClick={() => navigate("/companies-details/new")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-950 dark:bg-transparent dark border border-gray-700 text-white font-black text-xs uppercase tracking-widest   transition-all"
          >
            <PlusCircle size={16} /> New Entry
          </button>
        </div>

        <div className="space-y-px rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40">
          <div className="bg-white dark:bg-[#0c1525] p-4">
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 dark:text-white rounded-lg font-bold outline-none text-xs border border-slate-200 dark:border-slate-700/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c1525] px-4 py-3 flex flex-wrap items-center gap-2">
            <select
              value={filter.company}
              onChange={(e) => {
                setFilter({
                  company: e.target.value,
                  year: "",
                  month: "",
                  category: "",
                  subcategory: "",
                });
                setCurrentPage(1);
              }}
              className={selectCls}
            >
              <option value="">All Companies</option>
              {availableCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filter.year}
              onChange={(e) => {
                setFilter((p) => ({
                  ...p,
                  year: e.target.value,
                  month: "",
                  category: "",
                  subcategory: "",
                }));
                setCurrentPage(1);
              }}
              disabled={!filter.company}
              className={selectCls}
            >
              <option value="">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={filter.month}
              onChange={(e) => {
                setFilter((p) => ({
                  ...p,
                  month: e.target.value,
                  category: "",
                  subcategory: "",
                }));
                setCurrentPage(1);
              }}
              disabled={!filter.year}
              className={selectCls}
            >
              <option value="">All Months</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={filter.category}
              onChange={(e) => {
                setFilter((p) => ({
                  ...p,
                  category: e.target.value,
                  subcategory: "",
                }));
                setCurrentPage(1);
              }}
              disabled={!filter.month}
              className={selectCls}
            >
              <option value="">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filter.subcategory}
              onChange={(e) => {
                setFilter((p) => ({ ...p, subcategory: e.target.value }));
                setCurrentPage(1);
              }}
              disabled={!filter.category}
              className={selectCls}
            >
              <option value="">All Subcategories</option>
              {availableSubcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilter({
                    year: "",
                    month: "",
                    category: "",
                    subcategory: "",
                    company: "",
                  });
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <CompanyTable
              companies={currentData}
              previousDueMap={previousDueMap}
              onEdit={(item) => navigate(`/companies-details/edit/${item._id}`)}
              refreshData={async () => handleRefresh()}
            />
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
