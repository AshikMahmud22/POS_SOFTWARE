import React from "react";
import { Trash2, Edit3 } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../api/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export interface IShopEntry {
  _id?: string;
  date: string;
  month: string;
  year: string;
  cementDetails: string;
  quantity: number;
  productValue: number;
  totalCost: number;
  previousDue: number;
  deposit: number;
  truckFair: number;
  restTotalAmount: number;
  sign: string;
  adminEmail: string;
  adminName: string;
}

interface ShopTableProps {
  data: IShopEntry[];
  onEdit: (item: IShopEntry) => void;
  onDeleteSuccess: () => void;
}

const ShopTable: React.FC<ShopTableProps> = ({ data, onEdit, onDeleteSuccess }) => {
  
  const sortedData = [...data].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDeleteRequest = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-2">
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            Move entry to trash?
          </span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await API.post(`/shop/move-to-trash/${id}`);
                  toast.success("Entry moved to trash");
                  onDeleteSuccess();
                } catch {
                  toast.error("Delete failed");
                }
              }}
              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 px-4 py-1.5 rounded-lg text-xs font-black uppercase dark:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { position: "top-center", duration: 6000 }
    );
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      <Table className="w-full text-left min-w-max">
        <TableHeader className="border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <TableRow>
            <TableCell isHeader className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Date/Month</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Details</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">Qty</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black uppercase tracking-widest text-center text-blue-600 whitespace-nowrap">Total Cost</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black uppercase tracking-widest text-center text-green-600 whitespace-nowrap">Deposit</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black uppercase tracking-widest text-center text-amber-600 whitespace-nowrap">Due</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black uppercase tracking-widest text-center text-red-600 whitespace-nowrap">Rest Total</TableCell>
            <TableCell isHeader className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-10 text-center font-bold text-gray-400 uppercase tracking-widest">No Entries Found</TableCell>
            </TableRow>
          ) : (
            sortedData.map((item) => (
              <TableRow key={item._id} className="hover:bg-blue-50/10 border-b last:border-0 dark:border-gray-800 transition-colors">
                <TableCell className="p-5 font-bold dark:text-white whitespace-nowrap">
                  {item.date} <span className="inline-block ml-1 text-[10px] text-blue-500 font-black uppercase">{item.month}</span>
                </TableCell>
                <TableCell className="p-5 font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">{item.cementDetails}</TableCell>
                <TableCell className="p-5 text-center font-bold dark:text-white whitespace-nowrap">{item.quantity}</TableCell>
                <TableCell className="p-5 text-center font-black text-blue-900 dark:text-blue-400 whitespace-nowrap">{item.totalCost}</TableCell>
                <TableCell className="p-5 text-center font-bold text-green-600 whitespace-nowrap">{item.deposit}</TableCell>
                <TableCell className="p-5 text-center font-bold text-amber-600 whitespace-nowrap">{item.totalCost - item.deposit}</TableCell>
                <TableCell className="p-5 text-center whitespace-nowrap">
                  <span className="bg-red-50 dark:bg-red-900/20 text-red-600 px-3 py-1.5 rounded-xl font-black border border-red-100 dark:border-red-900/30 italic">{item.restTotalAmount}</span>
                </TableCell>
                <TableCell className="p-5 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-1">
                    <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteRequest(item._id!)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShopTable;