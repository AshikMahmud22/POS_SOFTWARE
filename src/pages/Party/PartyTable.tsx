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
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm dark:text-white text-slate-800 uppercase tracking-tight font-black">Confirm Deletion?</p>
          <p className="text-xs dark:text-gray-300 text-slate-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 border dark:border-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-100/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("Deleting...");
                try {
                  const res = await deleteParty(id);
                  if (res.success) {
                    toast.success("Party deleted", { id: loadingToast });
                    await refreshData();
                  } else {
                    toast.error("Failed to delete", { id: loadingToast });
                  }
                } catch {
                  toast.error("An error occurred", { id: loadingToast });
                }
              }}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const sortedData = [...data].reverse();

  const headers = [
    { label: "#", align: "text-center" },
    { label: "Retailer Name", align: "text-left" },
    { label: "Proprietor" },
    { label: "Address" },
    { label: "Mobile" },
    { label: "Actions" },
  ];

  return (
    <div className="overflow-x-auto bg-white dark:bg-[#0c1525]">
      <table className="w-full text-center border-collapse min-w-[700px] text-nowrap">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            {headers.map(({ label, align = "text-center" }) => (
              <th
                key={label}
                className={`px-4 py-3.5 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 ${align}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Users size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No parties found</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <tr key={item._id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors">

                <td className="px-4 py-3.5 text-center">
                  <span className="text-[9px] font-black text-slate-300 dark:text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                        {(item.retailerName || "?").charAt(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Store size={11} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {item.retailerName || "—"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <User size={11} className="text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {item.proprietorName || "—"}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.address || "—"}
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <Phone size={11} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {item.mobile || "—"}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => item._id && handleDelete(item._id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PartyTable;