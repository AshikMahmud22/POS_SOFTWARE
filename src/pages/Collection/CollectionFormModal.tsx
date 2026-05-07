import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../../lib/AuthProvider";
import { ICollection } from "../../types/collection";
import { IParty } from "../../types/party";
import { addCollection, updateCollection } from "../../services/collectionService";
import { getParties } from "../../services/partyService";

const MONTH_FROM_NUMBER: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
};

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initialData: ICollection;
  isEditing: boolean;
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-sm font-semibold outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const CollectionFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  isEditing,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ICollection>(initialData);
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (!isOpen) return;
    getParties().then((res) => {
      if (res.success) setParties(res.data);
    });
    setFormData({
      ...initialData,
      adminName: user?.firstName || "",
      adminEmail: user?.email || "",
    });
    if (initialData.date) {
      setSelectedDate(initialData.date);
    } else {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, initialData, user]);

  useEffect(() => {
    if (selectedDate) {
      const parts = selectedDate.split("-");
      const monthName = MONTH_FROM_NUMBER[parts[1]];
      setFormData((prev) => ({
        ...prev,
        date: selectedDate,
        month: monthName,
        year: parts[0],
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    const total = Number(formData.bag) * Number(formData.rate);
    const balance =
      formData.truckFairType === "party"
        ? Number(formData.previousDue) + total - Number(formData.truckFair)
        : Number(formData.previousDue) + total;
    setFormData((prev) => ({
      ...prev,
      totalCost: total,
      partyBalance: balance,
    }));
  }, [formData.bag, formData.rate, formData.truckFair, formData.truckFairType, formData.previousDue]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numeric = ["bag", "rate", "truckFair", "previousDue"];
    setFormData((prev) => ({
      ...prev,
      [name]: numeric.includes(name) ? Number(value) : value,
    }));
  };

  const handlePartySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parties.find((p) => p._id === e.target.value);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        partyId: selected._id || "",
        partyName: selected.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && formData._id) {
        await updateCollection(formData._id, formData);
        toast.success("Updated successfully");
      } else {
        await addCollection(formData);
        toast.success("Entry saved");
      }
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg lg:max-w-xl lg:ml-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col border border-white/5"
        style={{ maxHeight: "90svh" }}
      >
        <div
          className="relative flex-shrink-0 px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)" }}
        >
          <div className="relative flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              {isEditing ? (
                <Edit2 size={14} className="text-blue-400" />
              ) : (
                <PlusCircle size={14} className="text-blue-400" />
              )}
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(96,165,250,0.6)" }}>
                {isEditing ? "Modify Record" : "New Record"}
              </p>
              <h2 className="text-sm font-black text-white leading-tight">
                {isEditing ? "Update Entry" : "Add Entry"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all hover:rotate-90 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0c1525]" style={{ overscrollBehavior: "contain" }}>
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
            <Field label="Date">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className={inputCls}
              />
            </Field>

            <Field label="Party Name">
              <select
                name="partyId"
                value={formData.partyId || ""}
                onChange={handlePartySelect}
                required
                className={`${inputCls} appearance-none`}
              >
                <option value="">Select Party</option>
                {parties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Bag">
                <input
                  type="number"
                  name="bag"
                  value={formData.bag || ""}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Rate (৳)">
                <input
                  type="number"
                  name="rate"
                  value={formData.rate || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px dashed rgba(59,130,246,0.3)" }}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">
                Total Cost
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                ৳{(formData.totalCost || 0).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Truck Fair Type">
                <select
                  name="truckFairType"
                  value={formData.truckFairType}
                  onChange={handleChange}
                  className={`${inputCls} appearance-none`}
                >
                  <option value="party">Party Add</option>
                  <option value="self">Self Add</option>
                </select>
              </Field>
              <Field label="Truck Fair (৳)">
                <input
                  type="number"
                  name="truckFair"
                  value={formData.truckFair || ""}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Previous Due (৳)">
              <input
                type="number"
                name="previousDue"
                value={formData.previousDue || ""}
                onChange={handleChange}
                placeholder="0"
                className={inputCls}
              />
            </Field>

            <div
              className="rounded-xl px-4 py-3.5 flex items-center justify-between gap-3"
              style={{
                background: "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: "rgba(96,165,250,0.6)" }}>
                  Party Balance
                </p>
                <p className="text-2xl font-black text-white tracking-tight leading-none">
                  ৳{(formData.partyBalance || 0).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1">
                  <span className="text-[9px] font-semibold" style={{ color: "rgba(148,163,184,0.6)" }}>
                    Cost ৳{(formData.totalCost || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold text-red-400/70">
                    Due ৳{(formData.previousDue || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold text-yellow-400/70">
                    Truck ৳{(formData.truckFair || 0).toLocaleString()} ({formData.truckFairType})
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-0.5 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  boxShadow: "0 4px 20px rgba(10,22,50,0.4)",
                }}
              >
                {loading ? (
                  <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectionFormModal;