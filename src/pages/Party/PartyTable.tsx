import React from "react";
import { Edit2, Trash2, Users, Phone, Store, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { IParty } from "../../types/party";
import { deleteParty } from "../../services/partyService";

interface PartyTableProps {
  data: IParty[];
  onEdit: (item: IParty) => void;
  refreshData: () => Promise<void>;
}

const PartyTable: React.FC<PartyTableProps> = ({ data, onEdit, refreshData }) => {
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold dark:text-white text-gray-800">Delete this party?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const loadingToast = toast.loading("Deleting...");
                  const res = await deleteParty(id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success("Party deleted");
                    await refreshData();
                  }
                } catch {
                  toast.error("Delete failed");
                }
              }}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const sortedData = [...data].reverse();

  return (
    <div className="w-full rounded-3xl border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-x-auto">
      <table className="text-center border-collapse min-w-[700px] w-full text-nowrap">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 text-blue-950 dark:text-blue-300 uppercase text-[10px] font-black italic">
            <th className="px-4 py-3 border-b dark:border-gray-800 w-12">#</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Party Name</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Retailer Name</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Proprietor</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Address</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Mobile</th>
            <th className="px-4 py-3 border-b dark:border-gray-800 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-800">
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-xs font-black text-gray-300 dark:text-gray-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Store size={11} className="text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {item.retailerName || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <User size={11} className="text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {item.proprietorName || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {item.address || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Phone size={11} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {item.mobile || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 rounded-lg transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => item._id && handleDelete(item._id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users size={20} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No parties found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PartyTable;