import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  IProfitEntry,
  addProfitEntry,
  updateProfitEntry,
} from "../../services/profitService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData: IProfitEntry | null;
  refreshData: () => void;
}

const empty: IProfitEntry = {
  date: "",
  month: "",
  retailSite: "",
  qty: "",
  doRate: "",
  truckFair: "",
  landingRate: "",
  com: "",
  remarks: "",
};

const months = [
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
];

const ProfitFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editData,
  refreshData,
}) => {
  const [formData, setFormData] = useState<IProfitEntry>(empty);
  const [submitting, setSubmitting] = useState(false);

  const qty = Number(formData.qty || 0);
  const doRate = Number(formData.doRate || 0);
  const truckFair = Number(formData.truckFair || 0);
  const landingRate = Number(formData.landingRate || 0);
  const com = Number(formData.com || 0);
  const total = qty * doRate - truckFair;
  const afterComRate = doRate - com;
  const profitLoss = (afterComRate - landingRate) * qty;
  const netProfit = profitLoss - truckFair;

  useEffect(() => {
    setFormData(editData ? { ...editData } : empty);
  }, [editData, isOpen]);

  const set = (key: keyof IProfitEntry, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editData?._id) {
        const res = await updateProfitEntry(editData._id, formData);
        if (res.success) {
          toast.success("Updated successfully");
          refreshData();
          onClose();
        }
      } else {
        const res = await addProfitEntry(formData);
        if (res.success) {
          toast.success("Added successfully");
          refreshData();
          onClose();
        }
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none font-bold text-sm";
  const labelClass = "text-[10px] font-black uppercase ml-2 text-gray-400";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4  mt-15 ">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] lg:ml-64  ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-blue-950 dark:text-white leading-none">
              {editData ? "Update Record" : "New Entry"}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Profit & Commission Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <X className="dark:text-white" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="space-y-1">
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Month</label>
            <select
              value={formData.month}
              onChange={(e) => set("month", e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className={labelClass}>Retail / Site</label>
            <input
              placeholder="Retail or Site name"
              value={formData.retailSite}
              onChange={(e) => set("retailSite", e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Qty</label>
            <input
              type="number"
              placeholder="Quantity"
              value={formData.qty}
              onChange={(e) => set("qty", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>DO Rate</label>
            <input
              type="number"
              placeholder="DO Rate"
              value={formData.doRate}
              onChange={(e) => set("doRate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Truck Fair</label>
            <input
              type="number"
              placeholder="Truck Fair"
              value={formData.truckFair}
              onChange={(e) => set("truckFair", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Landing Rate</label>
            <input
              type="number"
              placeholder="Landing Rate"
              value={formData.landingRate}
              onChange={(e) => set("landingRate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>COM</label>
            <input
              type="number"
              placeholder="Commission"
              value={formData.com}
              onChange={(e) => set("com", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Remarks</label>
            <input
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) => set("remarks", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border dark:border-gray-800">
            <div className="text-center">
              <p className={labelClass}>Total</p>
              <p className="text-sm font-black text-blue-950 dark:text-white mt-1">
                ৳{total.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className={labelClass}>After COM Rate</p>
              <p className="text-sm font-black text-blue-950 dark:text-white mt-1">
                ৳{afterComRate.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className={labelClass}>Profit / Loss</p>
              <p
                className={`text-sm font-black mt-1 ${profitLoss >= 0 ? "text-green-600" : "text-red-500"}`}
              >
                ৳{profitLoss.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className={labelClass}>Net Profit</p>
              <p
                className={`text-sm font-black mt-1 ${netProfit >= 0 ? "text-green-600" : "text-red-500"}`}
              >
                ৳{netProfit.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-blue-950 text-white p-5 rounded-2xl font-black uppercase italic hover:bg-blue-900 transition-all mt-2 shadow-lg shadow-blue-900/30 active:scale-95 dark:shadow-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processing...
              </>
            ) : editData ? (
              "Update Record"
            ) : (
              "Save Record"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfitFormModal;
