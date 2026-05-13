import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

import { MONTH_NUMBER, inputCls } from "./CompanyFormTypes";
import { Field, DoSections } from "./CompanyFormFields";
import {
  EMPTY_COMPANY_FORM,
  IBankDeposit,
  ICompanyEntry,
  IDhakaDo,
  IGhatDo,
  Month,
  MONTHS,
} from "../../../types/companies";
import { useAuth } from "../../../lib/AuthProvider";
import {
  addCompanyEntry,
  getCompanyEntry,
  getPreviousDue,
  updateCompanyEntry,
} from "../../../services/companyService";

type NestedKeys = "bankDeposit" | "dhakaDo" | "ghatDo";
type NestedType<T> = T extends "bankDeposit"
  ? IBankDeposit
  : T extends "dhakaDo"
    ? IDhakaDo
    : IGhatDo;

const CompanyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ICompanyEntry>({
    ...EMPTY_COMPANY_FORM,
  });
  const [loading, setLoading] = useState(false);

  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [previousDue, setPreviousDue] = useState<number>(0);
  const [fetchingDue, setFetchingDue] = useState(false);
  const [prevDoBag, setPrevDoBag] = useState<string>("");
  const [prevDoRate, setPrevDoRate] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      getCompanyEntry(id)
        .then((res) => {
          if (res.success && res.data) {
            const entry = res.data;
            setFormData(entry);
            if (entry.createdAt) {
              const d = new Date(entry.createdAt);
              setYear(d.getFullYear().toString());
              setDay(d.getDate().toString());
            }
            setPrevDoBag(String(entry.previousDo || ""));
            setPrevDoRate(String(entry.previousDoRate || ""));
            setPreviousDue(Number(entry.previousDue) || 0);
          }
        })
        .catch(() => toast.error("Failed to load entry"));
    } else {
      setFormData({
        ...EMPTY_COMPANY_FORM,
        adminName: user?.firstName || "",
        month: MONTHS[new Date().getMonth()] as Month,
      });
      setYear(new Date().getFullYear().toString());
      setDay("");
      setPreviousDue(0);
      setPrevDoBag("");
      setPrevDoRate("");
    }
  }, [id, isEditing, user]);

  useEffect(() => {
    const companyName = formData.companyName?.trim();
    if (!companyName || companyName.length < 2) {
      setPreviousDue(0);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setFetchingDue(true);
      try {
        const res = await getPreviousDue({
          companyName,
          excludeId: isEditing && id ? id : undefined,
        });
        setPreviousDue(Number(res.previousDue) || 0);
      } catch {
        setPreviousDue(0);
      } finally {
        setFetchingDue(false);
      }
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.companyName, isEditing, id]);

  const dhakaRate = Number(formData.dhakaDo?.rate) || 0;
  const ghatRate = Number(formData.ghatDo?.rate) || 0;
  const dhakaBag = Number(formData.dhakaDo?.bag) || 0;
  const ghatBag = Number(formData.ghatDo?.bag) || 0;
  const prevDoBagNum = Number(prevDoBag) || 0;
  const prevDoRateNum = Number(prevDoRate) || 0;
  const prevDoAmount = prevDoBagNum * prevDoRateNum;
  const todayLifting = Number(formData.doLifting) || 0;
  const cash = Number(formData.bankDeposit?.cash) || 0;
  const commission = Number(formData.bankDeposit?.commission) || 0;

  const advDoTotalBag = dhakaBag + ghatBag + prevDoBagNum;
  const advDoTotalAmount =
    dhakaBag * dhakaRate + ghatBag * ghatRate + prevDoAmount;
  const maxLifting = formData.doSource === "factory" ? dhakaBag : ghatBag;
  const totalDeposit = cash + commission;
  const excessDoQty = advDoTotalBag - todayLifting;
  const rawDue = advDoTotalAmount - totalDeposit + previousDue;
  const dueAmount = rawDue < 0 ? 0 : rawDue;

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
      const payload: Partial<ICompanyEntry> = {
        ...formData,
        year,
        createdAt: new Date(dateStr).toISOString(),
        dueAmount,
        excessDoQty,
        previousDue,
        dhakaDo: { ...formData.dhakaDo, amount: dhakaBag * dhakaRate },
        ghatDo: { ...formData.ghatDo, amount: ghatBag * ghatRate },
        bankDeposit: { ...formData.bankDeposit, totalDeposit },
        advDoQty: advDoTotalBag,
        advDoAmount: advDoTotalAmount,
        previousDo: prevDoBagNum,
        previousDoRate: prevDoRateNum,
        previousDoAmount: prevDoAmount,
      };
      if (isEditing && id) {
        await updateCompanyEntry(id, payload);
        toast.success("Updated Successfully");
      } else {
        await addCompanyEntry(payload);
        toast.success("Record Saved");
      }
      navigate("/companies-details");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black/20 md:p-8 p-4 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/companies-details")}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
                {isEditing ? "Edit Entry" : "New Entry"}
              </h1>
            </div>
            <p className="text-gray-500 font-bold text-xs mt-0.5 uppercase tracking-widest">
              {isEditing
                ? "Update company DO record"
                : "Create a new company DO record"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field label="Company Name">
                <div className="relative">
                  <input
                    value={formData.companyName || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        companyName: e.target.value,
                      }))
                    }
                    className={inputCls}
                    placeholder="Enter Company"
                    required
                  />
                  {fetchingDue && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                  )}
                </div>
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
                    setFormData((p) => ({
                      ...p,
                      month: e.target.value as Month,
                    }))
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
            <div className="grid grid-cols-2 gap-4">
              <Field label="Brand / Category">
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
                    setFormData((p) => ({ ...p, subcategory: e.target.value }))
                  }
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <DoSections
            formData={formData}
            setFormData={setFormData}
            prevDoBag={prevDoBag}
            setPrevDoBag={setPrevDoBag}
            prevDoRate={prevDoRate}
            setPrevDoRate={setPrevDoRate}
            dhakaBag={dhakaBag}
            dhakaRate={dhakaRate}
            ghatBag={ghatBag}
            ghatRate={ghatRate}
            prevDoAmount={prevDoAmount}
            maxLifting={maxLifting}
            totalDeposit={totalDeposit}
            previousDue={previousDue}
            fetchingDue={fetchingDue}
            advDoTotalBag={advDoTotalBag}
            advDoTotalAmount={advDoTotalAmount}
            handleNestedChange={handleNestedChange}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-center gap-1">
              <span className="text-[7px] font-black text-teal-400 uppercase tracking-tighter">
                Total Deposit
              </span>
              <span className="text-lg font-bold text-teal-400">
                ৳ {totalDeposit.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                Cash + Commission
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-center gap-1">
              <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">
                Excess DO
              </span>
              <span
                className={`text-lg font-bold ${excessDoQty < 0 ? "text-red-400" : "text-emerald-400"}`}
              >
                {excessDoQty} Bags
              </span>
              <span className="text-[9px] text-slate-400">
                Advance − Lifting
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-center gap-1">
              <span className="text-[7px] font-black text-orange-400 uppercase tracking-tighter">
                Total Due
              </span>
              <span className="text-lg font-bold text-orange-400">
                ৳ {dueAmount.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-400">
                Adv DO − Deposit + Prev Due
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/companies-details")}
              className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-2xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
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

export default CompanyFormPage;
