import React from "react";
import { Edit2, Trash2, Factory, Waves, Calendar, Tag } from "lucide-react";
import { ICompanyEntry } from "../../types/companies";
import { deleteCompanyEntry } from "../../services/companyService";
import { toast } from "react-hot-toast";

interface CompanyTableProps {
  companies: ICompanyEntry[];
  previousDueMap: Record<string, number>;
  onEdit?: (company: ICompanyEntry) => void;
  refreshData: () => Promise<void>;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onEdit, refreshData, previousDueMap }) => {
  const sortedCompanies = [...companies].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleDelete = async (id: string) => {
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
              onClick={async () => { toast.dismiss(t.id); await executeDelete(id); }}
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

  const executeDelete = async (id: string) => {
    const loadingToast = toast.loading("Deleting...");
    try {
      const res = await deleteCompanyEntry(id);
      if (res.success) {
        toast.success("Entry deleted", { id: loadingToast });
        await refreshData();
      } else {
        toast.error("Failed to delete", { id: loadingToast });
      }
    } catch {
      toast.error("An error occurred", { id: loadingToast });
    }
  };

  const headers = [
    { label: "Company & Date", align: "text-left" },
    { label: "Category" },
    { label: "Source" },
    { label: "Dhaka DO" },
    { label: "Ghat DO" },
    { label: "Previous DO" },
    { label: "Advance DO" },
    { label: "Prev Due (৳)" },
    { label: "Due (৳)" },
    { label: "Deposit" },
    { label: "Actions" },
  ];

  return (
    <div className="overflow-x-auto bg-white dark:bg-[#0c1525]">
      <table className="w-full text-center border-collapse min-w-[1200px] text-nowrap">
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
          {sortedCompanies.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-6 py-20 text-center text-slate-400 text-sm font-bold italic">
                No records found.
              </td>
            </tr>
          ) : (
            sortedCompanies.map((item) => {
              const day = item.createdAt ? new Date(item.createdAt).getDate().toString().padStart(2, "0") : "--";
              const isFactory = item.doSource === "factory";
              const advDoQty = Number(item.advDoQty) || 0;
              const advDoAmount = Number(item.advDoAmount) || 0;
              const cash = Number(item.bankDeposit?.cash) || 0;
              const commission = Number(item.bankDeposit?.commission) || 0;
              const totalDeposit = cash + commission;
              const prevDoBag = Number(item.previousDo) || 0;
              const prevDoRate = Number(item.previousDoRate) || 0;
              const prevDoAmount = Number(item.previousDoAmount) || 0;
              const previousDue = previousDueMap[String(item._id)] !== undefined
                ? previousDueMap[String(item._id)]
                : Number(item.previousDue) || 0;
              const rawDue = advDoAmount - totalDeposit + previousDue;
              const dueAmount = rawDue < 0 ? 0 : rawDue;

              return (
                <tr key={String(item._id)} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors">

                  <td className="px-4 py-3.5 text-left">
                    <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase leading-tight">
                      {item.companyName}
                    </p>
                    <p className="text-[9px] font-bold dark:text-slate-400 text-gray-700 mt-1 flex items-center gap-1">
                      <Calendar size={8} />
                      {day} {item.month} {item.year}
                    </p>
                    {item.adminName && (
                      <p className="text-xs dark:text-slate-400 text-gray-700 mt-0.5">{item.adminName}</p>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">{item.category}</p>
                    {item.subcategory && (
                      <span className="inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-gray-600 rounded">
                        <Tag size={7} /> {item.subcategory}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {isFactory ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase">
                        <Factory size={9} /> Factory
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase">
                        <Waves size={9} /> Ghat
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold block ${isFactory ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
                      {Number(item.dhakaDo?.bag) || 0} Bags
                    </span>
                    <span className="text-[9px] font-bold dark:text-slate-400 text-gray-700 mt-0.5 block">
                      ৳ {(Number(item.dhakaDo?.rate) || 0).toLocaleString()}/bag
                    </span>
                    <span className="text-[9px] font-black text-blue-500 block mt-0.5">
                      ৳ {(Number(item.dhakaDo?.amount) || 0).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold block ${!isFactory ? "text-emerald-600 dark:text-emerald-400" : "dark:text-slate-400 text-gray-700"}`}>
                      {Number(item.ghatDo?.bag) || 0} Bags
                    </span>
                    <span className="text-[9px] font-bold dark:text-slate-400 text-gray-700 mt-0.5 block">
                      ৳ {(Number(item.ghatDo?.rate) || 0).toLocaleString()}/bag
                    </span>
                    <span className="text-[9px] font-black text-emerald-500 block mt-0.5">
                      ৳ {(Number(item.ghatDo?.amount) || 0).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                      {prevDoBag} Bags
                    </span>
                    <span className="text-[9px] font-bold dark:text-slate-400 text-gray-700 mt-0.5 block">
                      ৳ {prevDoRate.toLocaleString()}/bag
                    </span>
                    <span className="text-[9px] font-black text-amber-500 block mt-0.5">
                      ৳ {prevDoAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                      {advDoQty} Bags
                    </span>
                    <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded mt-1 inline-block">
                      ৳ {advDoAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold ${previousDue > 0 ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`}>
                      ৳ {previousDue.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold ${dueAmount < 0 ? "text-red-500 dark:text-red-400" : "text-orange-500 dark:text-orange-400"}`}>
                      ৳ {dueAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 border-x border-slate-100 dark:border-slate-800">
                    <div className="space-y-1 min-w-[140px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold dark:text-slate-400 text-gray-700 uppercase">Cash</span>
                        <span className="text-[9px] font-black text-teal-600 dark:text-teal-400">
                          ৳ {cash.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-1">
                        <span className="text-[9px] font-bold dark:text-slate-400 text-gray-700 uppercase">Commission</span>
                        <span className="text-[9px] font-black text-purple-600 dark:text-purple-400">
                          ৳ {commission.toLocaleString()}
                        </span>
                      </div>
                      {item.bankDeposit?.commissionReason && (
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                          <span className="text-[9px] dark:text-slate-400 text-gray-700 italic leading-tight block text-left">
                            {item.bankDeposit.commissionReason}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-1">
                        <span className="text-[9px] font-bold dark:text-slate-400 text-gray-700 uppercase">Total</span>
                        <span className="text-[9px] font-black text-slate-700 dark:text-white">
                          ৳ {totalDeposit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => onEdit?.(item)}
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;