import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../../lib/AuthProvider";
import { ICollection } from "../../types/collection";
import { IRetailerEntry } from "../../types/retailer";
import { addCollection, updateCollection } from "../../services/collectionService";
import { getRetailerEntries } from "../../services/retailerService";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initialData: ICollection;
  isEditing: boolean;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-sm font-semibold outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const autoCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-sm font-semibold outline-none cursor-default select-none";

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
  const [retailers, setRetailers] = useState<IRetailerEntry[]>([]);
  const [selectedRetailerName, setSelectedRetailerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      return;
    }
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sw}px`;
    setFormData({
      ...initialData,
      adminName: user?.firstName || "",
      adminEmail: user?.email || "",
    });
    setSelectedRetailerName("");
    getRetailerEntries().then((res) => {
      if (res.success) setRetailers(res.data);
    });
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, initialData, user]);

  if (!isOpen) return null;

  const handlePartyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedRetailerName(value);
    const selected = retailers.find(
      (r) => r.retailerName.toLowerCase() === value.toLowerCase()
    );
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        partyId: selected._id || "",
        partyName: selected.proprietorName,
        cashCollection: Number(selected.deposit) || 0,
        partyBalance: Number(selected.restTotalAmount) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        partyId: "",
        partyName: "",
        cashCollection: 0,
        partyBalance: 0,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        adminName: user?.firstName || "",
        adminEmail: user?.email || "",
      };
      if (isEditing && formData._id) {
        await updateCollection(formData._id, payload);
        toast.success("Updated successfully");
      } else {
        await addCollection(payload);
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
        className="relative w-full max-w-lg lg:max-w-xl lg:ml-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col border border-white/5 mt-15"
        style={{ maxHeight: "90svh" }}
      >
        <div
          className="relative flex-shrink-0 px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              {isEditing ? <Edit2 size={14} className="text-blue-400" /> : <PlusCircle size={14} className="text-blue-400" />}
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(96,165,250,0.6)" }}>
                {isEditing ? "Modify Record" : "New Record"}
              </p>
              <h2 className="text-sm font-black text-white leading-tight">
                {isEditing ? "Update Collection" : "Add Collection"}
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

            <div className="grid grid-cols-2 gap-3">
              <Field label="Retailer Name">
                <input
                  list="retailer-names-list"
                  value={selectedRetailerName}
                  onChange={handlePartyNameChange}
                  placeholder="Select or type name"
                  required
                  className={inputCls}
                />
                <datalist id="retailer-names-list">
                  {retailers.map((r) => (
                    <option key={r._id} value={r.retailerName} />
                  ))}
                </datalist>
              </Field>
              <Field label="Party Name">
                <div className={autoCls}>{formData.partyName || "—"}</div>
              </Field>
            </div>

            <Field label="Date">
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                required
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Deposit (৳)">
                <div className={autoCls}>
                  {formData.cashCollection ? `৳ ${Number(formData.cashCollection).toLocaleString()}` : "—"}
                </div>
              </Field>
              <Field label="Rest Amount (৳)">
                <div className={autoCls}>
                  {formData.partyBalance ? `৳ ${Number(formData.partyBalance).toLocaleString()}` : "—"}
                </div>
              </Field>
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
                disabled={loading || !formData.partyId}
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