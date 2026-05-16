import React from "react";
import { Banknote, TrendingUp } from "lucide-react";
import { inputCls, wordCount } from "./CompanyFormTypes";
import { IBankDeposit, ICompanyEntry, IDhakaDo, IGhatDo } from "../../../types/companies";

type NestedKeys = "bankDeposit" | "dhakaDo" | "ghatDo";
type NestedType<T> = T extends "bankDeposit"
  ? IBankDeposit
  : T extends "dhakaDo"
    ? IDhakaDo
    : IGhatDo;

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      {label}
    </label>
    {children}
  </div>
);

interface DoSectionsProps {
  formData: ICompanyEntry;
  prevDoBag: string;
  setPrevDoBag: (v: string) => void;
  prevDoRate: string;
  setPrevDoRate: (v: string) => void;
  dhakaBag: number;
  dhakaRate: number;
  ghatBag: number;
  ghatRate: number;
  prevDoAmount: number;
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
  prevDoBag,
  setPrevDoBag,
  prevDoRate,
  setPrevDoRate,
  dhakaBag,
  dhakaRate,
  ghatBag,
  ghatRate,
  prevDoAmount,
  advDoTotalBag,
  advDoTotalAmount,
  handleNestedChange,
}) => (
  <div className="space-y-px rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-px">

      <div className="bg-white dark:bg-[#0c1525] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">
            Dhaka DO
          </span>
          <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Factory
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bag">
            <input
              type="number"
              value={formData.dhakaDo?.bag || ""}
              onChange={(e) => handleNestedChange("dhakaDo", "bag", e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Rate / Bag">
            <input
              type="number"
              value={formData.dhakaDo?.rate || ""}
              onChange={(e) => handleNestedChange("dhakaDo", "rate", e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</span>
          <span className="text-sm font-black text-blue-500 dark:text-blue-400 tabular-nums">
            ৳ {(dhakaBag * dhakaRate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c1525] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
            Ghat DO
          </span>
          <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Local
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bag">
            <input
              type="number"
              value={formData.ghatDo?.bag || ""}
              onChange={(e) => handleNestedChange("ghatDo", "bag", e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Rate / Bag">
            <input
              type="number"
              value={formData.ghatDo?.rate || ""}
              onChange={(e) => handleNestedChange("ghatDo", "rate", e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</span>
          <span className="text-sm font-black text-emerald-500 dark:text-emerald-400 tabular-nums">
            ৳ {(ghatBag * ghatRate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c1525] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">
            Previous DO
          </span>
          <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Carry Over
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bag">
            <input
              type="number"
              value={prevDoBag}
              onChange={(e) => setPrevDoBag(e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Rate / Bag">
            <input
              type="number"
              value={prevDoRate}
              onChange={(e) => setPrevDoRate(e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</span>
          <span className="text-sm font-black text-amber-500 dark:text-amber-400 tabular-nums">
            ৳ {prevDoAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-px">

      <div className="bg-white dark:bg-[#0c1525] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Banknote size={13} className="text-blue-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Deposit
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cash">
            <input
              type="number"
              value={formData.bankDeposit?.cash || ""}
              onChange={(e) => handleNestedChange("bankDeposit", "cash", e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Commission">
            <input
              type="number"
              value={formData.bankDeposit?.commission || ""}
              onChange={(e) => handleNestedChange("bankDeposit", "commission", e.target.value)}
              className={inputCls}
              placeholder="0"
            />
          </Field>
        </div>
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
            placeholder="Reason for commission (max 20 words)"
          />
        </Field>
      </div>

      <div className="bg-white dark:bg-[#0c1525] p-5 flex flex-col justify-between gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={13} className="text-indigo-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Advance DO Summary
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div className="space-y-0.5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Total Bags</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Dhaka + Ghat + Prev</p>
            </div>
            <span className="text-3xl font-black text-indigo-500 dark:text-indigo-400 tabular-nums leading-none">
              {advDoTotalBag}
              <span className="text-[10px] font-bold text-slate-400 ml-1">bags</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
            <span className="text-lg font-black text-indigo-500 dark:text-indigo-400 tabular-nums">
              ৳ {advDoTotalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
);