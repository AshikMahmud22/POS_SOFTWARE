import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { IDeliveryCostEntry, addDeliveryCostEntry, updateDeliveryCostEntry } from "../../services/deliveryService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData: IDeliveryCostEntry | null;
  refreshData: () => void;
}

const empty: IDeliveryCostEntry = {
  date: "", month: "", serialNumber: "", retailSite: "",
  bag: "", carCost: "", doGive: "", doTake: "", gift: "",
};

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const DeliveryCostFormModal: React.FC<Props> = ({ isOpen, onClose, editData, refreshData }) => {
  const [formData, setFormData] = useState<IDeliveryCostEntry>(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(editData ? { ...editData } : empty);
  }, [editData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const set = (key: keyof IDeliveryCostEntry, value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editData?._id) {
        const res = await updateDeliveryCostEntry(editData._id, formData);
        if (res.success) { toast.success("Updated successfully"); refreshData(); onClose(); }
      } else {
        const res = await addDeliveryCostEntry(formData);
        if (res.success) { toast.success("Added successfully"); refreshData(); onClose(); }
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none font-bold text-sm";
  const labelClass = "text-[10px] font-black uppercase ml-2 text-gray-400";

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 mt-12"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] lg:ml-64">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-blue-950 dark:text-white leading-none">
              {editData ? "Update Record" : "New Entry"}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Delivery Cost Portal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
            <X className="dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className={labelClass}>Date</label>
            <input type="date" value={formData.date} onChange={e => set("date", e.target.value)} className={inputClass} required />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Month</label>
            <select value={formData.month} onChange={e => set("month", e.target.value)} className={inputClass} required>
              <option value="">Select Month</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Serial Number</label>
            <input placeholder="Serial Number" value={formData.serialNumber} onChange={e => set("serialNumber", e.target.value)} className={inputClass} required />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Retail / Site</label>
            <input placeholder="Retail or Site name" value={formData.retailSite} onChange={e => set("retailSite", e.target.value)} className={inputClass} required />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Bag</label>
            <input type="number" placeholder="Bag" value={formData.bag} onChange={e => set("bag", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Car Cost</label>
            <input type="number" placeholder="Car Cost" value={formData.carCost} onChange={e => set("carCost", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>DO Give</label>
            <input type="number" placeholder="DO Give" value={formData.doGive} onChange={e => set("doGive", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>DO Take</label>
            <input type="number" placeholder="DO Take" value={formData.doTake} onChange={e => set("doTake", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className={labelClass}>Gift</label>
            <input type="number" placeholder="Gift" value={formData.gift} onChange={e => set("gift", e.target.value)} className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-blue-950 text-white p-5 rounded-2xl font-black uppercase italic hover:bg-blue-900 dark:shadow-none transition-all mt-2 shadow-lg shadow-blue-900/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : editData ? "Update Record" : "Save Record"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryCostFormModal;