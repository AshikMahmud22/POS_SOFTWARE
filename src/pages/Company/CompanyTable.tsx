import React from "react";
import { Edit2, Trash2, Factory, Waves, Calendar, Tag } from "lucide-react";
import { ICompanyEntry } from "../../types/companies";
import { deleteCompanyEntry } from "../../services/companyService";
import { toast } from "react-hot-toast";

interface CompanyTableProps {
  companies: ICompanyEntry[];
  onEdit?: (company: ICompanyEntry) => void;
  refreshData: () => Promise<void>;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onEdit, refreshData }) => {
  const sortedCompanies = [...companies].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm dark:text-white text-slate-800 uppercase tracking-tight font-bold">Confirm Deletion?</p>
          <p className="text-xs dark:text-gray-300 text-slate-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100/10 rounded-lg transition-colors border dark:border-gray-700 dark:text-gray-300"
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
      toast.error("An error occurred", { id: loadingToast });
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1525] shadow-sm">
      <table className="w-full text-center border-collapse min-w-[1600px] text-nowrap">
        <thead>
          <tr className="bg-slate-100/80 dark:bg-slate-900/80">
            {[
              { label: "Company & Date", align: "text-left" },
              { label: "Category" },
              { label: "Source" },
              { label: "Dhaka DO" },
              { label: "Ghat DO" },
              { label: "Previous DO" },
              { label: "Advance DO" },
              { label: "Excess DO" },
              { label: "Lifting" },
              { label: "Prev Due (৳)" },
              { label: "Due (৳)" },
              { label: "Deposit" },
              { label: "Actions" },
            ].map(({ label, align = "text-center" }) => (
              <th
                key={label}
                className={`px-4 py-4 text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 ${align}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {sortedCompanies.length === 0 ? (
            <tr>
              <td colSpan={13} className="px-6 py-20 text-center text-slate-500 text-lg font-bold italic">
                No records found.
              </td>
            </tr>
          ) : (
            sortedCompanies.map((item) => {
              const day = item.createdAt
                ? new Date(item.createdAt).getDate().toString().padStart(2, "0")
                : "--";
              const isFactory = item.doSource === "factory";
              const advDoQty = Number(item.advDoQty) || 0;
              const advDoAmount = Number(item.advDoAmount) || 0;
              const excessDoQty = Number(item.excessDoQty) || 0;
              const cash = Number(item.bankDeposit?.cash) || 0;
              const commission = Number(item.bankDeposit?.commission) || 0;
              const totalDeposit = cash + commission;
              const previousDue = Number(item.previousDue) || 0;
              const dueAmount = Number(item.dueAmount) || 0;
              const prevDoBag = Number(item.previousDo) || 0;
              const prevDoRate = Number(item.previousDoRate) || 0;
              const prevDoAmount = Number(item.previousDoAmount) || 0;

              return (
                <tr key={String(item._id)} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">

                  <td className="px-4 py-4 text-left">
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase leading-tight">
                      {item.companyName}
                    </p>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar size={9} />
                      {day} {item.month} {item.year}
                    </p>
                    {item.adminName && (
                      <p className="text-[12px] text-slate-700 dark:text-slate-400 mt-0.5">{item.adminName}</p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase">{item.category}</p>
                    {item.subcategory && (
                      <span className="inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 rounded">
                        <Tag size={8} />
                        {item.subcategory}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {isFactory ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase">
                        <Factory size={10} /> Factory
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                        <Waves size={10} /> Ghat
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 ">
                    <span className={`text-xs font-bold block ${isFactory ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-400"}`}>
                      {Number(item.dhakaDo?.bag) || 0} Bags
                    </span>
                    <span className="text-[9px]  font-bold text-slate-700 dark:text-slate-400 mt-0.5 inline-block">
                      ৳ {(Number(item.dhakaDo?.rate) || 0).toLocaleString()}/bag
                    </span>
                    <span className="text-[9px] font-bold text-blue-500 block mt-0.5">
                      ৳ {(Number(item.dhakaDo?.amount) || 0).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold block ${!isFactory ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-400"}`}>
                      {Number(item.ghatDo?.bag) || 0} Bags
                    </span>
                    <span className="text-[9px] font-bold text-slate-700 dark:text-slate-400 mt-0.5 inline-block">
                      ৳ {(Number(item.ghatDo?.rate) || 0).toLocaleString()}/bag
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 block mt-0.5">
                      ৳ {(Number(item.ghatDo?.amount) || 0).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                      {prevDoBag} Bags
                    </span>
                    <span className="text-[9px] font-bold text-slate-700 dark:text-slate-400 mt-0.5 inline-block">
                      ৳ {prevDoRate.toLocaleString()}/bag
                    </span>
                    <span className="text-[9px] font-bold text-amber-400 block mt-0.5">
                      ৳ {prevDoAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 block">
                      {advDoQty} Bags
                    </span>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded mt-1 inline-block">
                      ৳ {advDoAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold ${excessDoQty < 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {excessDoQty} Bags
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 block">
                      {Number(item.doLifting || 0).toLocaleString()} Bags
                    </span>
                    <span className="text-[9px] text-slate-700 dark:text-slate-400 mt-0.5 inline-block">
                      {isFactory ? "Factory" : "Ghat"} Rate
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold ${previousDue > 0 ? "text-purple-600 dark:text-purple-400" : "text-slate-700 dark:text-slate-400"}`}>
                      ৳ {previousDue.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold ${dueAmount < 0 ? "text-red-500 dark:text-red-400" : "text-orange-500 dark:text-orange-400"}`}>
                      ৳ {dueAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4 border-x dark:border-slate-800">
                    <div className="space-y-1 min-w-[150px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-700 dark:text-slate-400 uppercase">Cash</span>
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                          ৳ {cash.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t dark:border-slate-800 pt-1">
                        <span className="text-[9px] font-bold text-slate-700 dark:text-slate-400 uppercase">Commission</span>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          ৳ {commission.toLocaleString()}
                        </span>
                      </div>
                      {item.bankDeposit?.commissionReason && (
                        <div className="border-t dark:border-slate-800 pt-1">
                          <span className="text-[9px] text-slate-700 dark:text-slate-400 italic leading-tight block text-left">
                            {item.bankDeposit.commissionReason}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t dark:border-slate-800 pt-1">
                        <span className="text-[9px] font-bold text-slate-700 dark:text-slate-400 uppercase">Total</span>
                        <span className="text-[10px] font-black text-slate-800 dark:text-white">
                          ৳ {totalDeposit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => onEdit?.(item)}
                        className="p-2 hover:bg-blue-600 hover:text-white bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => item._id && handleDelete(String(item._id))}
                        className="p-2 hover:bg-red-600 hover:text-white bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 transition-all"
                      >
                        <Trash2 size={14} />
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