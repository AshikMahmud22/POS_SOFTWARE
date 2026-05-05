import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../../lib/AuthProvider";
import { addShopEntry, updateShopEntry } from "../../services/shopService";
import { IShopEntry } from "../../types/shop";

const MONTHS = [
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
  initialData: IShopEntry;
  isEditing: boolean;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-sm font-semibold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1">
    <label className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const ShopFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  isEditing,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<IShopEntry>(initialData);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

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
      adminEmail: user?.email || "",
      adminName: user?.firstName || "",
      sign: initialData.sign || user?.firstName || "",
      month: initialData.month || MONTHS[new Date().getMonth()],
    });

    if (initialData.date) {
      const p = initialData.date.split("-");
      setYear(p[0] || new Date().getFullYear().toString());
      setDay(p[2] || "");
    } else {
      setYear(new Date().getFullYear().toString());
      setDay("");
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, initialData, user]);

  useEffect(() => {
    if (formData.month && day && year) {
      setFormData((prev) => ({
        ...prev,
        date: `${year}-${MONTH_NUMBER[prev.month]}-${day.padStart(2, "0")}`,
        year: year,
      }));
    }
  }, [formData.month, day, year]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const numeric = [
      "quantity",
      "productValue",
      "previousDue",
      "deposit",
      "truckFair",
    ];
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: numeric.includes(name) ? Number(value) : value,
      };
      updated.totalCost =
        Number(updated.quantity) * Number(updated.productValue);
      updated.restTotalAmount =
        updated.totalCost +
        Number(updated.previousDue) +
        Number(updated.truckFair) -
        Number(updated.deposit);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        adminEmail: user?.email || "",
        adminName: user?.firstName || "",
      };
      if (isEditing && formData._id) {
        await updateShopEntry(formData._id, payload);
        toast.success("Updated successfully");
      } else {
        await addShopEntry(payload);
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
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg lg:max-w-xl lg:ml-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col border border-white/5"
        style={{ maxHeight: "90svh" }}
      >
        <div
          className="relative flex-shrink-0 px-5 py-4 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(59,130,246,0.1)" }}
          />

          <div className="relative flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {isEditing ? (
                <Edit3 size={14} className="text-blue-400" />
              ) : (
                <PlusCircle size={14} className="text-blue-400" />
              )}
            </div>
            <div>
              <p
                className="text-[8px] font-black uppercase tracking-[0.2em]"
                style={{ color: "rgba(96,165,250,0.6)" }}
              >
                {isEditing ? "Modify Record" : "New Record"}
              </p>
              <h2 className="text-sm font-black text-white leading-tight">
                {isEditing ? "Update Entry" : "Add Entry"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200 hover:rotate-90 flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0c1525]"
          style={{ overscrollBehavior: "contain" }}
        >
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cement Name">
                <input
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  placeholder="e.g. Shah Cement"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Grade / Sub Name">
                <input
                  name="subcategory"
                  value={formData.subcategory || ""}
                  onChange={handleChange}
                  placeholder="e.g. OPC 53"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity || ""}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Unit Price (৳)">
                <input
                  type="number"
                  name="productValue"
                  value={formData.productValue || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Field label="Truck Fair">
                <input
                  type="number"
                  name="truckFair"
                  value={formData.truckFair || ""}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Prev. Due">
                <input
                  type="number"
                  name="previousDue"
                  value={formData.previousDue || ""}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Deposit">
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit || ""}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-slate-800/20 p-3 space-y-2.5">
              <Field label="Month">
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className={`${inputCls} appearance-none`}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-3 gap-2">
                <Field label="Day">
                  <input
                    type="number"
                    value={day}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || (Number(v) >= 1 && Number(v) <= 31))
                        setDay(v);
                    }}
                    min={1}
                    max={31}
                    placeholder="DD"
                    required
                    className={`${inputCls} text-center`}
                  />
                </Field>
                <Field label="Month No.">
                  <div
                    className="w-full px-3.5 py-2.5 rounded-xl text-center text-xs font-black"
                    style={{
                      border: "1px dashed rgba(59,130,246,0.4)",
                      background: "rgba(59,130,246,0.06)",
                      color: "#3b82f6",
                    }}
                  >
                    {formData.month ? MONTH_NUMBER[formData.month] : "MM"}
                  </div>
                </Field>
                <Field label="Year">
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={2000}
                    max={2100}
                    placeholder="YYYY"
                    required
                    className={`${inputCls} text-center`}
                  />
                </Field>
              </div>

              {formData.date && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                    {formData.date}
                  </p>
                </div>
              )}
            </div>

            <div
              className="rounded-xl px-4 py-3.5 flex items-center justify-between gap-3"
              style={{
                background:
                  "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <div>
                <p
                  className="text-[8px] font-black uppercase tracking-[0.18em] mb-1"
                  style={{ color: "rgba(96,165,250,0.6)" }}
                >
                  Rest Amount
                </p>
                <p className="text-2xl font-black text-white tracking-tight leading-none">
                  ৳{(formData.restTotalAmount || 0).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1">
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: "rgba(148,163,184,0.6)" }}
                  >
                    Cost ৳{(formData.totalCost || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold text-red-400/70">
                    Due ৳{(formData.previousDue || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-400/70">
                    Dep ৳{(formData.deposit || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-0.5 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
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
                    <Save size={13} />
                    {isEditing ? "Update" : "Save"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopFormModal;
