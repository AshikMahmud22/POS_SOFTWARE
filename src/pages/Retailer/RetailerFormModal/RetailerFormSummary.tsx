import React from "react";
import { Save } from "lucide-react";
import { IRetailerEntry } from "../../../types/retailer";

interface Props {
  formData: IRetailerEntry;
  loading: boolean;
  isEditing: boolean;
  onClose: () => void;
}

const RetailerFormSummary: React.FC<Props> = ({ formData, loading, isEditing, onClose }) => {
  const activeRate =
    formData.rateType === "factory"
      ? Number(formData.doFactory)
      : Number(formData.doGhat);

  return (
    <>
      <div
        className="rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 mb-3"
        style={{
          background: "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)",
          border: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div>
          <p
            className="text-[7px] font-black uppercase tracking-[0.18em] mb-0.5"
            style={{ color: "rgba(96,165,250,0.6)" }}
          >
            Rest Amount
          </p>
          <p className="text-xl font-black text-white tracking-tight leading-none">
            ৳{(formData.restTotalAmount || 0).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          <span
            className="text-[9px] font-semibold"
            style={{ color: "rgba(148,163,184,0.6)" }}
          >
            Cost ৳{(formData.totalCost || 0).toLocaleString()}
          </span>
          <span
            className="text-[9px] font-semibold"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            Rate ৳{activeRate.toLocaleString()} ({formData.rateType === "factory" ? "Factory" : "Ghat"})
          </span>
          <span className="text-[9px] font-semibold text-red-400/70">
            Due ৳{(formData.previousDue || 0).toLocaleString()}
          </span>
          <span className="text-[9px] font-semibold text-emerald-400/70">
            Dep ৳{(formData.deposit || 0).toLocaleString()}
          </span>
          <span className="text-[9px] font-semibold text-yellow-400/70">
            Truck ৳{(formData.truckFair || 0).toLocaleString()} ({formData.truckFairType === "company" ? "Company" : "Self"})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2.5 rounded-xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
            boxShadow: "0 4px 20px rgba(10,22,50,0.4)",
          }}
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Save size={12} />
              {isEditing ? "Update" : "Save"}
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default RetailerFormSummary;