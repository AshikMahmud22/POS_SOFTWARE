import React, { useState, useEffect } from "react";
import { RotateCcw, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { IRetailerEntry } from "../../types/retailer";
import { getTrashedEntries, restoreEntry, permanentDelete } from "../../services/retailerService";

const RetailerTrash: React.FC = () => {
  const [trashedEntries, setTrashedEntries] = useState<IRetailerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTrash = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getTrashedEntries();
      if (res.success) setTrashedEntries(res.data);
    } catch {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string): Promise<void> => {
    try {
      const loadingToast = toast.loading("Restoring...");
      const res = await restoreEntry(id);
      toast.dismiss(loadingToast);
      if (res.success) {
        toast.success("Entry restored successfully");
        fetchTrash();
      }
    } catch {
      toast.error("Restore failed");
    }
  };

  const handlePermanentDelete = async (id: string): Promise<void> => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold dark:text-white text-gray-800">
            Permanently delete this? This cannot be undone!
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const loadingToast = toast.loading("Deleting...");
                  const res = await permanentDelete(id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success("Deleted forever");
                    fetchTrash();
                  }
                } catch {
                  toast.error("Delete failed");
                }
              }}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="md:p-8 min-h-screen bg-gray-50 dark:bg-black/20 mt-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-red-600 uppercase tracking-tighter italic">
          Trash Bin
        </h1>
        <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">
          Restore or permanently delete retailer entries
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-red-600" size={40} />
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-3xl border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <table className="w-full border-collapse min-w-[1800px] text-center text-nowrap">
            <thead>
              <tr className="bg-red-900/10  uppercase text-[10px] font-black italic dark:text-white">
                <th className="p-4 border-b dark:border-gray-800">Date</th>
                <th className="p-4 border-b dark:border-gray-800">Retailer Name</th>
                <th className="p-4 border-b dark:border-gray-800">Proprietor</th>
                <th className="p-4 border-b dark:border-gray-800">Address</th>
                <th className="p-4 border-b dark:border-gray-800">Mobile</th>
                <th className="p-4 border-b dark:border-gray-800">Company</th>
                <th className="p-4 border-b dark:border-gray-800">Category</th>
                <th className="p-4 border-b dark:border-gray-800">Subcategory</th>
                <th className="p-4 border-b dark:border-gray-800">Rate Type</th>
                <th className="p-4 border-b dark:border-gray-800 text-orange-500">Do Factory</th>
                <th className="p-4 border-b dark:border-gray-800 text-purple-500">Do Ghat</th>
                <th className="p-4 border-b dark:border-gray-800">Qty</th>
                <th className="p-4 border-b dark:border-gray-800">Total Cost</th>
                <th className="p-4 border-b dark:border-gray-800">Prev. Due</th>
                <th className="p-4 border-b dark:border-gray-800">Deposit</th>
                <th className="p-4 border-b dark:border-gray-800">Truck Fair</th>
                <th className="p-4 border-b dark:border-gray-800">Rest Amount</th>
                <th className="p-4 border-b dark:border-gray-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {trashedEntries.length > 0 ? (
                trashedEntries.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-red-50/30 dark:hover:bg-red-900/5 transition-colors"
                  >
                    <td className="p-4 text-sm font-bold dark:text-gray-300 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="p-4 text-sm font-bold dark:text-gray-200 whitespace-nowrap">
                      {item.retailerName || "—"}
                    </td>
                    <td className="p-4 text-sm dark:text-gray-300 whitespace-nowrap">
                      {item.proprietorName || "—"}
                    </td>
                    <td className="p-4 text-sm dark:text-gray-400 whitespace-nowrap">
                      {item.address || "—"}
                    </td>
                    <td className="p-4 text-sm dark:text-gray-400 whitespace-nowrap">
                      {item.mobile || "—"}
                    </td>
                    <td className="p-4 text-sm font-bold dark:text-gray-200 whitespace-nowrap">
                      {item.companyName || "—"}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-black uppercase px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md whitespace-nowrap">
                        {item.category || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-black uppercase px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md whitespace-nowrap">
                        {item.subcategory || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-md whitespace-nowrap ${
                          item.rateType === "factory"
                            ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                            : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        }`}
                      >
                        {item.rateType === "factory" ? "Do Factory" : "Do Ghat"}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-orange-500">
                      ৳{(item.doFactory || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-purple-500">
                      ৳{(item.doGhat || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-sm font-bold dark:text-gray-300">
                      ৳{item.totalCost.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-red-500">
                      ৳{item.previousDue.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-green-600">
                      ৳{item.deposit.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold dark:text-gray-300">
                      ৳{item.truckFair.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-black text-blue-600 dark:text-blue-400">
                      ৳{item.restTotalAmount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => item._id && handleRestore(item._id)}
                          className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 rounded-lg transition-all"
                          title="Restore"
                        >
                          <RotateCcw size={18} />
                        </button>
                        <button
                          onClick={() => item._id && handlePermanentDelete(item._id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={18}
                    className="p-10 text-center text-gray-500 font-bold uppercase text-xs"
                  >
                    Trash is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RetailerTrash;