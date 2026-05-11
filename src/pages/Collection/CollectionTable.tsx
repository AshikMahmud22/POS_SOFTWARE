import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ICollection } from "../../types/collection";
import { deleteCollection } from "../../services/collectionService";

interface CollectionTableProps {
  data: ICollection[];
  onEdit: (item: ICollection) => void;
  refreshData: () => Promise<void>;
}

const CollectionTable: React.FC<CollectionTableProps> = ({ data, onEdit, refreshData }) => {
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold dark:text-white text-gray-800">
            Delete this entry?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const loadingToast = toast.loading("Deleting...");
                  const res = await deleteCollection(id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success("Entry deleted");
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
      <table className="text-center border-collapse min-w-[1100px] w-full text-nowrap ">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 text-blue-950 dark:text-blue-300 uppercase text-[10px] font-black italic">
            <th className="px-4 py-3 border-b dark:border-gray-800">Date</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Retailer</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Bag</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Rate</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Total Cost</th>
            <th className="px-4 py-3 border-b dark:border-gray-800">Truck Fair</th>
            <th className="px-4 py-3 border-b dark:border-gray-800 text-red-500">Prev. Due</th>
            <th className="px-4 py-3 border-b dark:border-gray-800 text-emerald-600">Cash Collection</th>
            <th className="px-4 py-3 border-b dark:border-gray-800 text-blue-600">Balance</th>
            <th className="px-4 py-3 border-b dark:border-gray-800 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-800">
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-bold dark:text-gray-300 whitespace-nowrap">
                  {item.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase">
                        {item.partyName?.charAt(0) || "—"}
                      </span>
                    </div>
                    <span className="text-sm font-bold dark:text-gray-200">
                      {item.partyName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold dark:text-gray-300 whitespace-nowrap">
                  {item.bag}
                </td>
                <td className="px-4 py-3 text-sm font-bold dark:text-gray-300 whitespace-nowrap">
                  ৳{item.rate.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-bold dark:text-gray-300 whitespace-nowrap">
                  ৳{item.totalCost.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold dark:text-gray-300">
                      ৳{item.truckFair.toLocaleString()}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase ${
                        item.truckFairType === "party"
                          ? "text-orange-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {item.truckFairType === "party" ? "Party" : "Self"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-red-500 whitespace-nowrap">
                  ৳{item.previousDue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-emerald-600 whitespace-nowrap">
                  ৳{(item.cashCollection || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  ৳{item.partyBalance.toLocaleString()}
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
              <td colSpan={10} className="px-4 py-16 text-center text-gray-500 font-bold uppercase text-xs">
                No entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;