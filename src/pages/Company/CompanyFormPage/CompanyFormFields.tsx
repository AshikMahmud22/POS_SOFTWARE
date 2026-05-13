import React from "react";
import { Calculator } from "lucide-react";
import { inputCls, readonlyCls, wordCount } from "./CompanyFormTypes";
import { DoSource, IBankDeposit, ICompanyEntry, IDhakaDo, IGhatDo } from "../../../types/companies";


type NestedKeys = "bankDeposit" | "dhakaDo" | "ghatDo";
type NestedType<T> = T extends "bankDeposit"
  ? IBankDeposit
  : T extends "dhakaDo"
    ? IDhakaDo
    : IGhatDo;

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1">
    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

interface DoSectionsProps {
  formData: ICompanyEntry;
  setFormData: React.Dispatch<React.SetStateAction<ICompanyEntry>>;
  prevDoBag: string;
  setPrevDoBag: (v: string) => void;
  prevDoRate: string;
  setPrevDoRate: (v: string) => void;
  dhakaBag: number;
  dhakaRate: number;
  ghatBag: number;
  ghatRate: number;
  prevDoAmount: number;
  maxLifting: number;
  totalDeposit: number;
  previousDue: number;
  fetchingDue: boolean;
  advDoTotalBag: number;
  advDoTotalAmount: number;
  handleNestedChange: <T extends NestedKeys>(
    parent: T,
    field: keyof NestedType<T>,
    value: string | number,
  ) => void;
}

export const DoSections: React.FC<DoSectionsProps> = ({
  formData,
  setFormData,
  prevDoBag,
  setPrevDoBag,
  prevDoRate,
  setPrevDoRate,
  dhakaBag,
  dhakaRate,
  ghatBag,
  ghatRate,
  prevDoAmount,
  maxLifting,
  previousDue,
  fetchingDue,
  advDoTotalBag,
  advDoTotalAmount,
  handleNestedChange,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <h3 className="text-[9px] font-black text-blue-500 uppercase italic tracking-widest border-b dark:border-slate-800 pb-2">
          Dhaka DO (Factory)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bag">
            <input
              type="number"
              value={formData.dhakaDo?.bag || ""}
              onChange={(e) => {
                handleNestedChange("dhakaDo", "bag", e.target.value);
                setFormData((p) => ({ ...p, doLifting: "" }));
              }}
              className={inputCls}
            />
          </Field>
          <Field label="Rate / Bag">
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
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <span className="text-[8px] font-black text-blue-400 uppercase">
            Dhaka Amount
          </span>
          <span className="text-xs font-bold text-blue-400">
            ৳ {(dhakaBag * dhakaRate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <h3 className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest border-b dark:border-slate-800 pb-2">
          Ghat DO
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bag">
            <input
              type="number"
              value={formData.ghatDo?.bag || ""}
              onChange={(e) => {
                handleNestedChange("ghatDo", "bag", e.target.value);
                setFormData((p) => ({ ...p, doLifting: "" }));
              }}
              className={inputCls}
            />
          </Field>
          <Field label="Rate / Bag">
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
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[8px] font-black text-emerald-400 uppercase">
            Ghat Amount
          </span>
          <span className="text-xs font-bold text-emerald-400">
            ৳ {(ghatBag * ghatRate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <h3 className="text-[9px] font-black text-amber-500 uppercase italic tracking-widest border-b dark:border-slate-800 pb-2">
          Previous DO
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bag">
            <input
              type="number"
              value={prevDoBag}
              onChange={(e) => setPrevDoBag(e.target.value)}
              className={inputCls}
              placeholder="Prev DO bags"
            />
          </Field>
          <Field label="Rate / Bag">
            <input
              type="number"
              value={prevDoRate}
              onChange={(e) => setPrevDoRate(e.target.value)}
              className={inputCls}
              placeholder="Rate"
            />
          </Field>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <span className="text-[8px] font-black text-amber-400 uppercase">
            Prev DO Amount
          </span>
          <span className="text-xs font-bold text-amber-400">
            ৳ {prevDoAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 border-b dark:border-slate-800 pb-2">
        <Calculator size={13} />
        <h3 className="text-[10px] font-black uppercase tracking-widest">
          Lifting & Deposit
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={`Lifting Bags (Max ${maxLifting})`}>
          <input
            type="number"
            value={formData.doLifting || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > maxLifting) return;
              setFormData((p) => ({ ...p, doLifting: e.target.value }));
            }}
            max={maxLifting}
            className={inputCls}
            placeholder={`Max ${maxLifting} bags`}
          />
        </Field>
        <Field label="Lifting Source">
          <div className="flex gap-1.5 h-[34px]">
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  doSource: "factory" as DoSource,
                  doLifting: "",
                }))
              }
              className={`flex-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                formData.doSource === "factory"
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-400 hover:border-blue-400"
              }`}
            >
              Factory
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  doSource: "ghat" as DoSource,
                  doLifting: "",
                }))
              }
              className={`flex-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                formData.doSource === "ghat"
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-400 hover:border-emerald-400"
              }`}
            >
              Ghat
            </button>
          </div>
        </Field>
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-500/10 border border-slate-500/20">
        <span className="text-[8px] font-black text-slate-400 uppercase">
          Rate Used
        </span>
        <span className="text-xs font-bold text-slate-300">
          {formData.doSource === "factory"
            ? `৳ ${dhakaRate.toLocaleString()} (Dhaka)`
            : `৳ ${ghatRate.toLocaleString()} (Ghat)`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Cash">
          <input
            type="number"
            value={formData.bankDeposit?.cash || ""}
            onChange={(e) =>
              handleNestedChange("bankDeposit", "cash", e.target.value)
            }
            className={inputCls}
            placeholder="Cash amount"
          />
        </Field>
        <Field label="Commission">
          <input
            type="number"
            value={formData.bankDeposit?.commission || ""}
            onChange={(e) =>
              handleNestedChange("bankDeposit", "commission", e.target.value)
            }
            className={inputCls}
            placeholder="Commission"
          />
        </Field>
      </div>

      <Field
        label={`Commission Reason (${wordCount(formData.bankDeposit?.commissionReason || "")} / 20 words)`}
      >
        <input
          value={formData.bankDeposit?.commissionReason || ""}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/);
            if (e.target.value.trim() === "" || words.length <= 20) {
              handleNestedChange(
                "bankDeposit",
                "commissionReason",
                e.target.value,
              );
            }
          }}
          className={inputCls}
          placeholder="Why commission? (max 20 words)"
        />
      </Field>

      <Field
        label={
          fetchingDue
            ? "Previous Due (loading...)"
            : "Previous Due (auto from backend)"
        }
      >
        <div className="relative">
          <input
            readOnly
            value={previousDue === 0 ? "" : `৳ ${previousDue.toLocaleString()}`}
            placeholder={
              fetchingDue ? "Fetching..." : "Auto filled from company history"
            }
            className={readonlyCls}
          />
          {fetchingDue && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
          )}
        </div>
      </Field>

      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 md:h-38">
        <div>
          <span className="font-black text-indigo-400 uppercase block">
            Advance DO
          </span>
          <span className="text-[9px] text-indigo-300">
            Dhaka + Ghat + Prev DO
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-indigo-400 block">
            {advDoTotalBag} Bags
          </span>
          <span className="text-xs font-bold text-indigo-300">
            ৳ {advDoTotalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);