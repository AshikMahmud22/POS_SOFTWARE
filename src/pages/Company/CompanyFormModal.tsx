import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X, Save, Calculator } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../../lib/AuthProvider";
import {
  addCompanyEntry,
  updateCompanyEntry,
} from "../../services/companyService";
import {
  ICompanyEntry,
  MONTHS,
  Month,
  IBankDeposit,
  IDhakaDo,
  IGhatDo,
  EMPTY_COMPANY_FORM,
} from "../../types/companies";

const MONTH_NUMBER: Record<string, string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
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

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-0.5">
    <label className="block text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const CompanyFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  isEditing,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ICompanyEntry>({
    ...EMPTY_COMPANY_FORM,
    ...initialData,
  });
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

    const dAmount = dBag * dRate;
    const gAmount = gBag * gRate;
    const totalDeposit = dAmount + gAmount;
    const advQty = dBag + gBag;
    const lifting = formData.doLiftingSource === "dhaka" ? dBag : gBag;
    const excess = prevDo + advQty - lifting;

    setFormData((prev) => {
      if (
        prev.dhakaDo.amount === dAmount &&
        prev.ghatDo.amount === gAmount &&
        prev.bankDeposit.totalDeposit === totalDeposit &&
        prev.advDoQty === advQty &&
        prev.doLifting === lifting &&
        prev.excessDoQty === excess &&
        prev.year === year
      )
        return prev;

      return {
        ...prev,
        dhakaDo: { ...prev.dhakaDo, amount: dAmount },
        ghatDo: { ...prev.ghatDo, amount: gAmount },
        bankDeposit: { ...prev.bankDeposit, totalDeposit: totalDeposit },
        advDoQty: advQty,
        doLifting: lifting,
        excessDoQty: excess,
        year: year,
      };
    });
  }, [
    formData.dhakaDo,
    formData.ghatDo,
    formData.bankDeposit,
    formData.doLiftingSource,
    formData.previousDo,
    year,
  ]);

  const handleNestedChange = <T extends NestedKeys>(
    parent: T,
    field: keyof NestedType<T>,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as object), [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dateStr = `${year}-${MONTH_NUMBER[formData.month] || "01"}-${day.padStart(2, "0")}`;
      const payload = {
        ...formData,
        year: year,
        createdAt: new Date(dateStr).toISOString(),
      };
      if (isEditing && formData._id) {
        await updateCompanyEntry(formData._id, payload);
        toast.success("Updated Successfully");
      } else {
        await addCompanyEntry(payload);
        toast.success("Record Saved");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl flex flex-col border border-white/10 bg-white dark:bg-[#0c1525] max-h-[80vh] mt-10">
        <div className="px-4 py-3 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              {isEditing ? (
                <Edit3 size={14} className="text-blue-400" />
              ) : (
                <PlusCircle size={14} className="text-blue-400" />
              )}
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest">
              {isEditing ? "Edit Entry" : "New Entry"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Field label="Company Name">
              <input
                value={formData.companyName || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, companyName: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((p) => ({ ...p, month: e.target.value as Month }))
                }
                className={inputCls}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand/Category">
                  <input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label="Subcategory">
                  <input
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        subcategory: e.target.value,
                      }))
                    }
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <div className="col-span-2 text-[9px] font-black text-blue-500 uppercase italic">
                  Dhaka DO Details
                </div>
                <Field label="Bag">
                  <input
                    type="number"
                    value={formData.dhakaDo?.bag || ""}
                    onChange={(e) =>
                      handleNestedChange("dhakaDo", "bag", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Rate">
                  <input
                    type="number"
                    value={formData.dhakaDo?.rate || ""}
                    onChange={(e) =>
                      handleNestedChange("dhakaDo", "rate", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <div className="col-span-2 text-[9px] font-black text-emerald-500 uppercase italic">
                  Ghat DO Details
                </div>
                <Field label="Bag">
                  <input
                    type="number"
                    value={formData.ghatDo?.bag || ""}
                    onChange={(e) =>
                      handleNestedChange("ghatDo", "bag", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Rate">
                  <input
                    type="number"
                    value={formData.ghatDo?.rate || ""}
                    onChange={(e) =>
                      handleNestedChange("ghatDo", "rate", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 space-y-3">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Calculator size={12} />
                  <span className="text-[9px] font-black uppercase">
                    Banking & Inventory
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Cash Deposit">
                    <input
                      type="number"
                      value={formData.bankDeposit?.cash || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDeposit",
                          "cash",
                          e.target.value,
                        )
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Commission">
                    <input
                      type="number"
                      value={formData.bankDeposit?.commission || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDeposit",
                          "commission",
                          e.target.value,
                        )
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Prev. DO Qty">
                    <input
                      type="number"
                      value={formData.previousDo || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          previousDo: e.target.value,
                        }))
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Lifting Source">
                    <select
                      value={formData.doLiftingSource}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          doLiftingSource: e.target.value as "dhaka" | "ghat",
                        }))
                      }
                      className={inputCls}
                    >
                      <option value="dhaka">Dhaka</option>
                      <option value="ghat">Ghat</option>
                    </select>
                  </Field>
                </div>
                <Field label="Comm. Reason">
                  <input
                    value={formData.bankDeposit?.commissionReason || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankDeposit",
                        "commissionReason",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-col justify-center">
                  <span className="text-[7px] font-black text-blue-400 uppercase tracking-tighter">
                    Total Deposit
                  </span>
                  <span className="text-sm font-bold">
                    ৳
                    {(
                      Number(formData.bankDeposit?.totalDeposit) || 0
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-col justify-center">
                  <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">
                    Excess DO
                  </span>
                  <span className="text-sm font-bold">
                    {formData.excessDoQty || 0} Bags
                  </span>
                </div>
              </div>
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