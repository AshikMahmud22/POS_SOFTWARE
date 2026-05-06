import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { ICompanyEntry } from "../../types/companies";
import { deleteCompanyEntry } from "../../services/companyService";
import { toast } from "react-hot-toast";

interface CompanyTableProps {
  companies: ICompanyEntry[];
  onEdit?: (company: ICompanyEntry) => void;
  refreshData: () => Promise<void>;
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onEdit,
  refreshData,
}) => {
  const sortedCompanies = [...companies].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm dark:text-white text-slate-800 uppercase tracking-tight font-bold">
            Confirm Deletion?
          </p>
          <p className="text-xs dark:text-gray-300 text-slate-500">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100/10 rounded-lg transition-colors border dark:border-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await executeDelete(id);
              }}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const executeDelete = async (id: string) => {
    const loadingToast = toast.loading("Processing deletion...");
    try {
      const res = await deleteCompanyEntry(id);
      if (res.success) {
        toast.success("Entry deleted successfully", { id: loadingToast });
        await refreshData();
      } else {
        toast.error("Failed to delete entry", { id: loadingToast });
      }
    } catch {
      toast.error("An error occurred during deletion", { id: loadingToast });
    }
  };

  const Th = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <th
      className={`px-6 py-5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 ${className}`}
    >
      {children}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1525] shadow-sm">
      <table className="w-full text-center border-collapse min-w-[1300px] text-nowrap">
        <thead>
          <tr className="bg-slate-100/80 dark:bg-slate-900/80">
            
            <Th className="text-left">Company & Full Date</Th>
            <Th>Category Details</Th>
            <Th className="text-center">Dhaka (Bag & Rate)</Th>
            <Th className="text-center">Ghat (Bag & Rate)</Th>
            <Th className="text-center">Adv Qty</Th>
            <Th className="text-center">Lifting</Th>
            <Th className="text-center">Excess DO</Th>
            <Th>Financial Summary</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {sortedCompanies.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="px-6 py-20 text-center text-slate-500 text-lg font-bold italic"
              >
                No records found.
              </td>
            </tr>
          ) : (
            sortedCompanies.map((item) => {
              const day = item.createdAt ? new Date(item.createdAt).getDate().toString().padStart(2, '0') : '--';
              return (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <td className="px-6 py-4 text-left">
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">
                      {item.companyName}
                    </p>
                    <p className="text-xs font-black text-slate-600 dark:text-slate-400 flex  items-center gap-1">
                      <span className="">
                        {day}
                      </span>
                      <span className="uppercase">{item.month}</span>
                      <span>{item.year}</span>
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase leading-tight">
                      {item.category}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                      {item.subcategory || "No Subcategory"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.dhakaDo?.bag || 0}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded mt-1">
                        ৳{item.dhakaDo?.rate || 0}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.ghatDo?.bag || 0}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded mt-1">
                        ৳{item.ghatDo?.rate || 0}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold">
                      {item.advDoQty || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {item.doLifting || 0}
                      </span>
                      <span className="text-[10px] uppercase text-slate-400 tracking-tighter font-bold">
                        {item.doLiftingSource}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center border-x dark:border-slate-800">
                    <span
                      className={`text-sm font-bold ${Number(item.excessDoQty) < 0 ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {item.excessDoQty || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center min-w-[140px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Depo:
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          ৳{Number(item.bankDeposit?.totalDeposit || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t dark:border-slate-800 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Comm:
                        </span>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          ৳{Number(item.bankDeposit?.commission || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(item)}
                        className="p-2 hover:bg-blue-600 hover:text-white bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => item._id && handleDelete(item._id)}
                        className="p-2 hover:bg-red-600 hover:text-white bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;