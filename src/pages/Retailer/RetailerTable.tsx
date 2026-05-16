import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { moveToTrash } from "../../services/retailerService";
import { IRetailerEntry } from "../../types/retailer";

interface RetailerTableProps {
  data: IRetailerEntry[];
  onEdit: (item: IRetailerEntry) => void;
  refreshData: () => Promise<void>;
}

const RetailerTable: React.FC<RetailerTableProps> = ({ data, onEdit, refreshData }) => {
  const handleMoveToTrash = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold dark:text-white text-gray-800">
            Move this entry to trash?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const loadingToast = toast.loading("Processing...");
                  const res = await moveToTrash(id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success("Moved to trash");
                    await refreshData();
                  }
                } catch {
                  toast.error("Failed to move entry");
                }
              }}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Yes, Move
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

  return (
    <div className="w-full overflow-x-auto rounded-3xl border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full border-collapse min-w-[1600px] text-center text-nowrap">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 text-blue-950 dark:text-blue-300 uppercase text-[10px] font-black italic">
            <th className="p-4 border-b dark:border-gray-800">Date</th>
            <th className="p-4 border-b dark:border-gray-800">Retailer Name</th>
            <th className="p-4 border-b dark:border-gray-800">Proprietor</th>
            <th className="p-4 border-b dark:border-gray-800">Address</th>
            <th className="p-4 border-b dark:border-gray-800">Mobile</th>
            <th className="p-4 border-b dark:border-gray-800">Company</th>
            <th className="p-4 border-b dark:border-gray-800">Category</th>
            <th className="p-4 border-b dark:border-gray-800">Subcategory</th>
            <th className="p-4 border-b dark:border-gray-800">Rate Type</th>
            <th className="p-4 border-b dark:border-gray-800 text-orange-500">Factory Bags</th>
            <th className="p-4 border-b dark:border-gray-800 text-purple-500">Ghat Bags</th>
            <th className="p-4 border-b dark:border-gray-800">Rate Price</th>
            <th className="p-4 border-b dark:border-gray-800">Qty</th>
            <th className="p-4 border-b dark:border-gray-800">Landing Rate</th>
            <th className="p-4 border-b dark:border-gray-800 text-red-500">Prev. Due</th>
            <th className="p-4 border-b dark:border-gray-800 text-green-600">Deposit</th>
            <th className="p-4 border-b dark:border-gray-800">Truck Fair</th>
            <th className="p-4 border-b dark:border-gray-800 text-blue-600">Rest Amount</th>
            <th className="p-4 border-b dark:border-gray-800 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-800">
          {data.length > 0 ? (
            data.map((item) => {
              const landingRate = Number(item.ratePrice || 0) * Number(item.quantity || 0);
              const truckFairAmount = Number(item.truckFair) || 0;
              const isRetailerTruck = item.truckFairType === "retailer";

              return (
                <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-sm font-bold dark:text-gray-300 whitespace-nowrap">{item.date}</td>
                  <td className="p-4 text-sm font-bold dark:text-gray-200 whitespace-nowrap">{item.retailerName || "—"}</td>
                  <td className="p-4 text-sm dark:text-gray-300 whitespace-nowrap">{item.proprietorName || "—"}</td>
                  <td className="p-4 text-sm dark:text-gray-400 whitespace-nowrap">{item.address || "—"}</td>
                  <td className="p-4 text-sm dark:text-gray-400 whitespace-nowrap">{item.mobile || "—"}</td>
                  <td className="p-4 text-sm font-bold dark:text-gray-200 whitespace-nowrap">{item.companyName || "—"}</td>
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
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md whitespace-nowrap ${
                      item.rateType === "factory"
                        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                        : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                    }`}>
                      {item.rateType === "factory" ? "DO Factory" : "DO Ghat"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-orange-500">{(item.doFactoryBags || 0).toLocaleString()} Bags</td>
                  <td className="p-4 text-sm font-bold text-purple-500">{(item.doGhatBags || 0).toLocaleString()} Bags</td>
                  <td className="p-4 text-sm font-bold dark:text-gray-300">৳ {(item.ratePrice || 0).toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold dark:text-gray-300">{item.quantity}</td>
                  <td className="p-4 text-sm font-bold dark:text-gray-300">৳ {landingRate.toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold text-red-500">৳ {item.previousDue.toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold text-green-600">৳ {item.deposit.toLocaleString()}</td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-sm font-bold ${isRetailerTruck ? "text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {isRetailerTruck ? "−" : ""} ৳ {truckFairAmount.toLocaleString()}
                      </span>
                      <span className={`text-[9px] font-black uppercase ${isRetailerTruck ? "text-red-400" : "text-emerald-500"}`}>
                        By {item.truckFairType}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-black text-blue-600 dark:text-blue-400">৳ {item.restTotalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => item._id && handleMoveToTrash(item._id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={19} className="p-10 text-center text-gray-500 font-bold uppercase text-xs">
                No retailer entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RetailerTable;