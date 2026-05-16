import React, { useState, useEffect } from "react";
import { PlusCircle, Loader2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { IParty } from "../../types/party";
import { getParties } from "../../services/partyService";
import PartyTable from "./PartyTable";
import PartyModal from "./PartyModal";
import { Pagination } from "../../components/Pagination/Pagination";

const ITEMS_PER_PAGE = 10;

const PartyPage: React.FC = () => {
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<IParty | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchParties = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getParties();
      if (res.success) setParties(res.data);
    } catch {
      toast.error("Failed to load parties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const filteredParties = parties.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.retailerName || "").toLowerCase().includes(q) ||
      (p.proprietorName || "").toLowerCase().includes(q) ||
      (p.mobile || "").includes(q) ||
      (p.address || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredParties.length / ITEMS_PER_PAGE);

  const paginatedParties = filteredParties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: IParty) => {
    setEditingData(item);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  return (
    <div className="md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10 overflow-x-hidden">
      <div className="flex flex-wrap flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
            Parties
          </h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Manage your party list
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-auto dark:border bg-blue-950 dark:bg-transparent dark:border-gray-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl hover:scale-105 transition-all uppercase text-sm"
        >
          <PlusCircle size={20} /> New Party
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name, mobile, address..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setCurrentPage(1); }}
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
          <PartyTable
            data={paginatedParties}
            onEdit={handleOpenEdit}
            refreshData={fetchParties}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <PartyModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={fetchParties}
        editingData={editingData}
      />
    </div>
  );
};

export default PartyPage;