import React from "react";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { ICollection } from "../../types/collection";
import { deleteCollection } from "../../services/collectionService";

interface CollectionTableProps {
  data: ICollection[];
  onEdit: (item: ICollection) => void;
  refreshData: () => Promise<void>;
}

const CollectionTable: React.FC<CollectionTableProps> = ({
  data,
  onEdit,
  refreshData,
}) => {
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm dark:text-white text-slate-800 uppercase tracking-tight font-black">
            Confirm Deletion?
          </p>
          <p className="text-xs dark:text-gray-300 text-slate-500">
            This action cannot be undone.
          </p>
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
                  const res = await deleteCollection(id);
                  if (res.success) {
                    toast.success("Entry deleted", { id: loadingToast });
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
      { duration: 4000 },
    );
  };

  const sortedData = [...data].reverse();

  const headers = [
    { label: "Date & Party", align: "text-left" },
    { label: "Retailer Name" },
    { label: "Deposit (৳)" },
    { label: "Rest Amount (৳)" },
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
              <td
                colSpan={5}
                className="px-6 py-20 text-center text-slate-400 text-sm font-bold italic"
              >
                No entries found.
              </td>
            </tr>
          ) : (
            sortedData.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors"
              >
                <td className="px-4 py-3.5 text-left">
                  <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase leading-tight">
                    {item.partyName || "—"}
                  </p>
                  <p className="text-[9px] font-bold dark:text-slate-400 text-gray-600 mt-1 flex items-center gap-1">
                    <Calendar size={8} />
                    {item.date}
                  </p>
                  {item.adminName && (
                    <p className="text-[9px] dark:text-slate-400 text-gray-500 mt-0.5">
                      {item.adminName}
                    </p>
                  )}
                </td>

                <td className="px-4 py-3.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    {item.partyName || "—"}
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    ৳ {(item.cashCollection || 0).toLocaleString()}
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <span
                    className={`text-xs font-bold ${(item.partyBalance ?? 0) > 0 ? "text-orange-500 dark:text-orange-400" : "text-slate-400"}`}
                  >
                    ৳ {(item.partyBalance ?? 0).toLocaleString()}
                  </span>
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
                      onClick={() => item._id && handleDelete(String(item._id))}
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

export default CollectionTable;
