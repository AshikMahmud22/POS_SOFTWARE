import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { IParty } from "../../types/party";
import { addParty, updateParty } from "../../services/partyService";

interface PartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingData: IParty | null;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-sm font-semibold outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const EMPTY_FORM = {
  retailerName: "",
  proprietorName: "",
  address: "",
  mobile: "",
};

const PartyModal: React.FC<PartyModalProps> = ({ isOpen, onClose, onSuccess, editingData }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingData) {
      setFormData({
        retailerName: editingData.retailerName || "",
        proprietorName: editingData.proprietorName || "",
        address: editingData.address || "",
        mobile: editingData.mobile || "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [isOpen, editingData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const v = value.replace(/[^0-9]/g, "").slice(0, 11);
      setFormData((p) => ({ ...p, mobile: v }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingData && editingData._id) {
        const res = await updateParty(editingData._id, formData);
        if (res.success) toast.success("Party updated");
      } else {
        const res = await addParty(formData);
        if (res.success) toast.success("Party added");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-white dark:bg-[#0c1525]">
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              {editingData ? <Edit2 size={14} className="text-blue-400" /> : <PlusCircle size={14} className="text-blue-400" />}
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(96,165,250,0.6)" }}>
                {editingData ? "Modify Party" : "New Party"}
              </p>
              <h2 className="text-sm font-black text-white leading-tight">
                {editingData ? "Update Party" : "Add Party"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all hover:rotate-90"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-slate-50 dark:bg-[#0c1525]">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Retailer Name">
              <input
                name="retailerName"
                value={formData.retailerName}
                onChange={handleChange}
                placeholder="Al-Amin Store"
                required
                className={inputCls}
              />
            </Field>
            <Field label="Proprietor Name">
              <input
                name="proprietorName"
                value={formData.proprietorName}
                onChange={handleChange}
                placeholder="Md. Rahim"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Address">
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dhaka Sadar"
              className={inputCls}
            />
          </Field>

          <Field label="Mobile No. (11 digits)">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="01700000000"
              maxLength={11}
              inputMode="numeric"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
                border: "1px solid rgba(59,130,246,0.2)",
                boxShadow: "0 4px 20px rgba(10,22,50,0.4)",
              }}
            >
              {submitting ? (
                <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {editingData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartyModal;