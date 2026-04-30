import React, { useState } from "react";
import { Trash2, Edit3, PlusCircle, Filter } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import ShopFormModal, { ShopFormData } from "./ShopFormModal";
import { Pagination } from "../../components/Pagination/Pagination";

interface ShopEntry extends ShopFormData {
  id: string;
  totalCost: number;
  restTotalAmount: number;
}

const ShopPage: React.FC = () => {
  const [entries, setEntries] = useState<ShopEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ month: "", year: "2026" });

  const itemsPerPage = 10;
  const emptyForm: ShopFormData = {
    date: "",
    month: "",
    year: "2026",
    cementDetails: "",
    quantity: 0,
    productValue: 0,
    previousDue: 0,
    deposit: 0,
    truckFair: 0,
    sign: "",
  };

  const calculateTotals = (data: ShopFormData) => {
    const totalCost = data.quantity * data.productValue + data.truckFair;
    const restTotalAmount = totalCost + data.previousDue - data.deposit;
    return { totalCost, restTotalAmount };
  };

  const handleFormSubmit = (data: ShopFormData) => {
    const { totalCost, restTotalAmount } = calculateTotals(data);
    if (editingId) {
      setEntries(
        entries.map((ent) =>
          ent.id === editingId
            ? { ...data, id: editingId, totalCost, restTotalAmount }
            : ent,
        ),
      );
    } else {
      setEntries([
        { ...data, id: Date.now().toString(), totalCost, restTotalAmount },
        ...entries,
      ]);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const filteredEntries = entries.filter(
    (ent) =>
      (filter.month === "" || ent.month === filter.month) &&
      (filter.year === "" || ent.year === filter.year),
  );

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const currentData = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleEditClick = (item: ShopEntry) => {
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      setEntries(entries.filter((e) => e.id !== id));
      if (currentData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const initialModalData = editingId
    ? entries.find((e) => e.id === editingId) || emptyForm
    : emptyForm;

  return (
    <div className="md:p-8  min-h-screen font-sans max-w-full overflow-x-hidden">
      <div className="flex md:flex-col lg:flex-row justify-between md:items-start lg:items-center gap-6 mb-10 items-center">
        <h1 className="text-4xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
          Shop Ledger
        </h1>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-950 text-white dark:bg-transparent dark:border border-gray-700 px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl md:flex items-center gap-3 font-black hidden md:block"
        >
          <PlusCircle /> NEW ENTRY
        </button>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-950 text-white dark:bg-transparent dark:border border-gray-700 px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 font-black md:hidden "
        >
          <PlusCircle />
        </button>
      </div>

      <div className=" p-5 rounded-2xl shadow-sm border dark:border-gray-700 border-gray-200 mb-8 flex  items-center gap-4">
        <div className="flex items-center gap-3 dark:text-white text-blue-950 cursor-pointer font-black text-xs uppercase  px-4 py-2 rounded-lg">
          <Filter size={16} /> Filters
        </div>
        <select
          value={filter.year}
          onChange={(e) => {
            setFilter({ ...filter, year: e.target.value });
            setCurrentPage(1);
          }}
          className="p-3  rounded-xl text-sm font-bold outline-none border-none dark:text-white text-blue-950 cursor-pointer"
        >
          <option className="dark:bg-blue-950" value="2024">
            2024
          </option>
          <option className="dark:bg-blue-950" value="2025">
            2025
          </option>
          <option className="dark:bg-blue-950" value="2026">
            2026
          </option>
        </select>
        <select
          value={filter.month}
          onChange={(e) => {
            setFilter({ ...filter, month: e.target.value });
            setCurrentPage(1);
          }}
          className="p-3  rounded-xl text-sm font-bold outline-none border-none dark:text-white text-blue-950 cursor-pointer"
        >
          <option className="dark:bg-blue-950" value="">
            Months
          </option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option className="dark:bg-blue-950" key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden max-w-full">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <Table className="">
            <TableHeader className=" border-b">
              <TableRow>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap"
                >
                  Date/Month
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap"
                >
                  Details
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap"
                >
                  Qty
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center text-blue-600 whitespace-nowrap"
                >
                  Total Cost
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center text-orange-500 whitespace-nowrap"
                >
                  P. Due
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center text-green-600 whitespace-nowrap"
                >
                  Deposit
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap"
                >
                  T. Fair
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center text-red-600 whitespace-nowrap"
                >
                  Rest Total
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap"
                >
                  Sign
                </TableCell>
                <TableCell
                  isHeader
                  className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center whitespace-nowrap"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-blue-50/20 border-b last:border-0 group transition-colors"
                >
                  <TableCell className="p-5 font-bold whitespace-nowrap">
                    {item.date}{" "}
                    <span className="block text-[10px] text-blue-500 font-black uppercase tracking-tighter">
                      {item.month}
                    </span>
                  </TableCell>
                  <TableCell className="p-5 font-bold text-gray-700 whitespace-nowrap min-w-[200px]">
                    {item.cementDetails}
                  </TableCell>
                  <TableCell className="p-5 text-center font-bold whitespace-nowrap">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="p-5 text-center font-bold text-gray-500 whitespace-nowrap">
                    {item.productValue}
                  </TableCell>
                  <TableCell className="p-5 text-center font-black text-blue-900 whitespace-nowrap">
                    {item.totalCost}
                  </TableCell>
                  <TableCell className="p-5 text-center font-bold text-orange-500 whitespace-nowrap">
                    {item.previousDue}
                  </TableCell>
                  <TableCell className="p-5 text-center font-bold text-green-600 whitespace-nowrap">
                    {item.deposit}
                  </TableCell>
                  <TableCell className="p-5 text-center font-medium text-gray-400 whitespace-nowrap">
                    {item.truckFair}
                  </TableCell>
                  <TableCell className="p-5 text-center whitespace-nowrap">
                    <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-black border border-red-100 italic">
                      {item.restTotalAmount}
                    </span>
                  </TableCell>
                  <TableCell className="p-5 text-center font-medium italic text-gray-400 text-sm whitespace-nowrap">
                    {item.sign}
                  </TableCell>
                  <TableCell className="p-5 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentData.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
              No entries found
            </div>
          )}
        </div>
        <div className="p-6 /50 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ShopFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEditing={!!editingId}
        initialData={initialModalData}
      />
    </div>
  );
};

export default ShopPage;
