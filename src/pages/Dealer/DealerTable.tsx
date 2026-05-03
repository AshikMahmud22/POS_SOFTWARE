import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { IDealerEntry } from "../../services/dealerService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

interface Props {
  entries: IDealerEntry[];
  onEdit: (item: IDealerEntry) => void;
  onDelete: (id: string) => void;
}

const DealerTable: React.FC<Props> = ({ entries, onEdit, onDelete }) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setConfirmId(id);
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-sm text-gray-800 dark:text-white">Delete this record?</p>
          <p className="text-xs text-gray-500 dark:text-gray-200">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setConfirmId(null);
                onDelete(id);
              }}
              className="flex-1 bg-red-600 text-white text-xs font-black uppercase py-2 px-4 rounded-xl hover:bg-red-700 transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setConfirmId(null);
              }}
              className="flex-1 bg-gray-100 text-gray-700 text-xs font-black uppercase py-2 px-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
   
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-[2.5rem] border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <Table className="text-left border-collapse min-w-[1400px] text-nowrap dark:text-white">
        <TableHeader className="bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-400 uppercase text-[10px] font-black italic">
          <TableRow>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800"> Date / Month</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> DO Dhaka</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> DO Ghat</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> Bank Deposit</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> Adv Qty</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> Lifting</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> Excess</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center"> Party & Qty</TableCell>
            <TableCell isHeader className="p-5 border-b dark:border-gray-800 text-center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y dark:divide-gray-800">
          {entries.length > 0 ? (
            entries.map((item) => (
              <TableRow
                key={item._id}
                className={`hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors ${confirmId === item._id ? "bg-red-50/40 dark:bg-red-900/10" : ""}`}
              >
                <TableCell className="p-5 text-sm font-bold whitespace-nowrap">
                  {item.date} <br /> <span className="text-[10px] text-gray-400 uppercase font-bold">{item.month}</span>
                </TableCell>
                <TableCell className="p-5 text-center text-sm font-medium">{item.doDhaka || "-"}</TableCell>
                <TableCell className="p-5 text-center text-sm font-medium">{item.doGhat || "-"}</TableCell>
                <TableCell className="p-5 text-center text-sm font-black text-green-600">
                  ৳{Number(item.bankDeposit).toLocaleString()}
                </TableCell>
                <TableCell className="p-5 text-center text-sm font-bold">{item.advDoQty}</TableCell>
                <TableCell className="p-5 text-center text-sm font-bold">{item.doLifting}</TableCell>
                <TableCell className="p-5 text-center text-sm font-bold text-red-500">{item.excessDoQty}</TableCell>
                <TableCell className="p-5 text-center text-sm font-bold">
                  <span className="text-blue-900 dark:text-blue-400 uppercase">{item.deliveredPartyName}</span>
                  <br /><span className="text-xs text-gray-500">{item.deliveredQty} BAGS</span>
                </TableCell>
                <TableCell className="p-5 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => item._id && handleDeleteClick(item._id)}
                      className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                No dealer records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealerTable;