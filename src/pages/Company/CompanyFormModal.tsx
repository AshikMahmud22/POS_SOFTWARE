import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X, Save, Calculator } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../../lib/AuthProvider";
import { addCompanyEntry, updateCompanyEntry } from "../../services/companyService";
import {
  ICompanyEntry, MONTHS, Month, IBankDeposit, IDhakaDo, IGhatDo, EMPTY_COMPANY_FORM,
} from "../../types/companies";

const MONTH_NUMBER: Record<string, string> = {
  January: "01", February: "02", March: "03", April: "04",
  May: "05", June: "06", July: "07", August: "08",
  September: "09", October: "10", November: "11", December: "12",
};

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initialData: ICompanyEntry;
  isEditing: boolean;
}

type NestedKeys = "bankDeposit" | "dhakaDo" | "ghatDo";
type NestedType<T> = T extends "bankDeposit"
  ? IBankDeposit
  : T extends "dhakaDo"
  ? IDhakaDo
  : IGhatDo;

const inputCls =
  "w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-0.5">
    <label className="block text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const CompanyFormModal: React.FC<FormModalProps> = ({
  isOpen, onClose, onSubmitSuccess, initialData, isEditing,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ICompanyEntry>({ ...EMPTY_COMPANY_FORM, ...initialData });
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      ...EMPTY_COMPANY_FORM,
      ...initialData,
      adminName: user?.firstName || "",
      month: initialData.month || (MONTHS[new Date().getMonth()] as Month),
    });
    if (initialData.createdAt) {
      const d = new Date(initialData.createdAt);
      setYear(d.getFullYear().toString());
      setDay(d.getDate().toString());
    } else {
      setYear(new Date().getFullYear().toString());
      setDay("");
    }
  }, [isOpen, initialData, user]);

  useEffect(() => {
    if (!formData.dhakaDo || !formData.ghatDo || !formData.bankDeposit) return;

    const dBag = Number(formData.dhakaDo.bag) || 0;
    const dRate = Number(formData.dhakaDo.rate) || 0;
    const gBag = Number(formData.ghatDo.bag) || 0;
    const gRate = Number(formData.ghatDo.rate) || 0;
    const prevDo = Number(formData.previousDo) || 0;
    const todayLifting = Number(formData.doLifting) || 0;
    const cash = Number(formData.bankDeposit.cash) || 0;
    const commission = Number(formData.bankDeposit.commission) || 0;

    const dAmount = dBag * dRate;
    const gAmount = gBag * gRate;
    const advDoQty = dBag + gBag;
    const advDoAmount = dAmount + gAmount;
    const totalDeposit = cash + commission;
    const excess = advDoQty + prevDo - todayLifting;

    setFormData((prev) => {
      if (
        prev.dhakaDo.amount === dAmount &&
        prev.ghatDo.amount === gAmount &&
        prev.bankDeposit.totalDeposit === totalDeposit &&
        prev.advDoQty === advDoQty &&
        prev.excessDoQty === excess &&
        prev.year === year
      )
        return prev;

      return {
        ...prev,
        dhakaDo: { ...prev.dhakaDo, amount: dAmount },
        ghatDo: { ...prev.ghatDo, amount: gAmount },
        bankDeposit: { ...prev.bankDeposit, totalDeposit },
        advDoQty,
        advDoAmount,
        excessDoQty: excess,
        year,
      };
    });
  }, [
    formData.dhakaDo,
    formData.ghatDo,
    formData.bankDeposit,
    formData.previousDo,
    formData.doLifting,
    year,
  ]);

  const handleNestedChange = <T extends NestedKeys>(
    parent: T,
    field: keyof NestedType<T>,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as object), [field]: value },
    }));
  };

  const wordCount = (text: string) =>
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dateStr = `${year}-${MONTH_NUMBER[formData.month] || "01"}-${day.padStart(2, "0")}`;
      const payload = {
        ...formData,
        year,
        createdAt: new Date(dateStr).toISOString(),
      };
      if (isEditing && formData._id) {
        await updateCompanyEntry(formData._id, payload);
        toast.success("Updated Successfully");
      } else {
        await addCompanyEntry(payload);
        toast.success("Record Saved");
      }
      onClose();
      onSubmitSuccess?.();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const advDoAmount =
    (Number(formData.dhakaDo?.bag) * Number(formData.dhakaDo?.rate)) +
    (Number(formData.ghatDo?.bag) * Number(formData.ghatDo?.rate));

  const totalDeposit =
    (Number(formData.bankDeposit?.cash) || 0) +
    (Number(formData.bankDeposit?.commission) || 0);

  const dueAmount = advDoAmount - totalDeposit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl flex flex-col border border-white/10 bg-white dark:bg-[#0c1525] max-h-[85vh] mt-10">

        <div className="px-4 py-3 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              {isEditing ? <Edit3 size={14} className="text-blue-400" /> : <PlusCircle size={14} className="text-blue-400" />}
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest">
              {isEditing ? "Edit Entry" : "New Entry"}
            </h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Field label="Company Name">
              <input
                value={formData.companyName || ""}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                className={inputCls}
                placeholder="Enter Company"
                required
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputCls}
                required
              />
            </Field>
            <Field label="Month">
              <select
                value={formData.month}
                onChange={(e) => setFormData((p) => ({ ...p, month: e.target.value as Month }))}
                className={inputCls}
              >
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Day">
              <input
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="DD"
                className={inputCls}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand / Category">
              <input
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className={inputCls}
                required
              />
            </Field>
            <Field label="Subcategory">
              <input
                value={formData.subcategory}
                onChange={(e) => setFormData((p) => ({ ...p, subcategory: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <div className="col-span-2 text-[9px] font-black text-blue-500 uppercase italic">
                  Dhaka DO (Factory)
                </div>
                <Field label="Bag">
                  <input
                    type="number"
                    value={formData.dhakaDo?.bag || ""}
                    onChange={(e) => handleNestedChange("dhakaDo", "bag", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Rate / Bag">
                  <input
                    type="number"
                    value={formData.dhakaDo?.rate || ""}
                    onChange={(e) => handleNestedChange("dhakaDo", "rate", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <div className="col-span-2 flex items-center justify-between px-2 py-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[8px] font-black text-blue-400 uppercase">Dhaka Amount</span>
                  <span className="text-xs font-bold text-blue-400">
                    ৳ {((Number(formData.dhakaDo?.bag) || 0) * (Number(formData.dhakaDo?.rate) || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <div className="col-span-2 text-[9px] font-black text-emerald-500 uppercase italic">
                  Ghat DO
                </div>
                <Field label="Bag">
                  <input
                    type="number"
                    value={formData.ghatDo?.bag || ""}
                    onChange={(e) => handleNestedChange("ghatDo", "bag", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Rate / Bag">
                  <input
                    type="number"
                    value={formData.ghatDo?.rate || ""}
                    onChange={(e) => handleNestedChange("ghatDo", "rate", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <div className="col-span-2 flex items-center justify-between px-2 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[8px] font-black text-emerald-400 uppercase">Ghat Amount</span>
                  <span className="text-xs font-bold text-emerald-400">
                    ৳ {((Number(formData.ghatDo?.bag) || 0) * (Number(formData.ghatDo?.rate) || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 space-y-3">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Calculator size={12} />
                  <span className="text-[9px] font-black uppercase">Advance DO & Excess Calculation</span>
                </div>

                <div className="flex items-center justify-between px-2 py-2 rounded bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[8px] font-black text-blue-400 uppercase">Advance DO</span>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs font-bold text-blue-400">
                      {Number(formData.advDoQty) || 0} Bags
                    </span>
                    <span className="text-[9px] font-bold text-blue-300">
                      ৳ {advDoAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Previous DO (One Time)">
                    <input
                      type="number"
                      value={formData.previousDo || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, previousDo: e.target.value }))}
                      className={inputCls}
                      placeholder="One time input"
                    />
                  </Field>
                  <Field label="Today Lifting">
                    <input
                      type="number"
                      value={formData.doLifting || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, doLifting: e.target.value }))}
                      className={inputCls}
                      placeholder="Factory / Ghat"
                    />
                  </Field>
                </div>

                <div className="text-[8px] text-slate-400 dark:text-slate-500 px-1 leading-relaxed">
                  Excess DO = Advance DO + Previous DO − Today Lifting
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Cash">
                    <input
                      type="number"
                      value={formData.bankDeposit?.cash || ""}
                      onChange={(e) => handleNestedChange("bankDeposit", "cash", e.target.value)}
                      className={inputCls}
                      placeholder="Cash amount"
                    />
                  </Field>
                  <Field label="Commission">
                    <input
                      type="number"
                      value={formData.bankDeposit?.commission || ""}
                      onChange={(e) => handleNestedChange("bankDeposit", "commission", e.target.value)}
                      className={inputCls}
                      placeholder="Commission amount"
                    />
                  </Field>
                </div>

                <div className="space-y-0.5">
                  <Field label={`Commission Reason (${wordCount(formData.bankDeposit?.commissionReason || "")} / 20 words)`}>
                    <input
                      value={formData.bankDeposit?.commissionReason || ""}
                      onChange={(e) => {
                        const words = e.target.value.trim().split(/\s+/);
                        if (e.target.value.trim() === "" || words.length <= 20) {
                          handleNestedChange("bankDeposit", "commissionReason", e.target.value);
                        }
                      }}
                      className={inputCls}
                      placeholder="Why commission? (max 20 words)"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-col justify-center gap-0.5">
              <span className="text-[7px] font-black text-blue-400 uppercase tracking-tighter">Total Deposit</span>
              <span className="text-sm font-bold">৳ {totalDeposit.toLocaleString()}</span>
              <span className="text-[8px] text-slate-400">Cash + Commission</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-col justify-center gap-0.5">
              <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">Excess DO</span>
              <span className={`text-sm font-bold ${Number(formData.excessDoQty) < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {Number(formData.excessDoQty) || 0} Bags
              </span>
              <span className="text-[8px] text-slate-400">Adv + Prev − Lifting</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-col justify-center gap-0.5">
              <span className="text-[7px] font-black text-orange-400 uppercase tracking-tighter">Due Amount</span>
              <span className={`text-sm font-bold ${dueAmount < 0 ? "text-red-400" : "text-orange-400"}`}>
                ৳ {dueAmount.toLocaleString()}
              </span>
              <span className="text-[8px] text-slate-400">Adv DO − Deposit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 rounded-lg bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyFormModal;