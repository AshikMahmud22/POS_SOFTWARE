import React from "react";
import { IRetailerEntry } from "../../../types/retailer";
import { ICompanyEntry } from "../../../types/companies";
import { MONTHS, inputCls, readonlyCls } from "./RetailerFormTypes";

interface Props {
  formData: IRetailerEntry;
  filteredEntries: ICompanyEntry[];
  day: string;
  year: string;
  onDayChange: (val: string) => void;
  onYearChange: (val: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCompanySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubcategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueCompanyNames: string[];
  landingRate: number;
  maxBags: number;
  ratePrice: number;
  onRatePriceChange: (val: number) => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const RetailerFormFields: React.FC<Props> = ({
  formData,
  filteredEntries,
  day,
  year,
  onDayChange,
  onYearChange,
  handleChange,
  handleCompanySelect,
  handleSubcategorySelect,
  uniqueCompanyNames,
  landingRate,
  maxBags,
  ratePrice,
  onRatePriceChange,
}) => {
  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-2">
          Retailer Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Retailer Name">
            <input
              name="retailerName"
              value={formData.retailerName || ""}
              onChange={handleChange}
              placeholder="Al-Amin Store"
              required
              className={inputCls}
            />
          </Field>
          <Field label="Proprietor Name">
            <input
              name="proprietorName"
              value={formData.proprietorName || ""}
              onChange={handleChange}
              placeholder="Md. Rahim"
              required
              className={inputCls}
            />
          </Field>
          <Field label="Address">
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Dhaka Sadar"
              className={inputCls}
            />
          </Field>
          <Field label="Mobile No.">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile || ""}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                handleChange({ ...e, target: { ...e.target, name: "mobile", value: v } });
              }}
              placeholder="01700000000"
              maxLength={11}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-2">
          Company & Product
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Company Name">
            <select
              value={formData.companyName || ""}
              onChange={handleCompanySelect}
              required
              className={inputCls}
            >
              <option value="">Select Company</option>
              {uniqueCompanyNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </Field>
          <Field label="Subcategory">
            <select
              value={formData.subcategory || ""}
              onChange={handleSubcategorySelect}
              required
              disabled={!formData.companyName}
              className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">Select Subcategory</option>
              {Array.from(new Set(filteredEntries.map((c) => c.subcategory))).map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <div className={readonlyCls}>
              {formData.category || <span className="text-orange-300/50 ">Auto filled</span>}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Factory Bags">
            <div className={readonlyCls}>
              {formData.doFactoryBags != null && formData.doFactoryBags !== 0
                ? `${Number(formData.doFactoryBags).toLocaleString()} Bags`
                : <span className="text-orange-300/50">Auto filled</span>}
            </div>
          </Field>
          <Field label="Ghat Bags">
            <div className={readonlyCls}>
              {formData.doGhatBags != null && formData.doGhatBags !== 0
                ? `${Number(formData.doGhatBags).toLocaleString()} Bags`
                : <span className="text-orange-300/50">Auto filled</span>}
            </div>
          </Field>
          <Field label="Rate Type">
            <select
              name="rateType"
              value={formData.rateType || "factory"}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="factory">DO Factory</option>
              <option value="ghat">DO Ghat</option>
            </select>
          </Field>
          <Field label={`Quantity (Max ${maxBags} Bags)`}>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > maxBags) return;
                handleChange(e);
              }}
              max={maxBags}
              placeholder={`Max ${maxBags}`}
              required
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Rate Price (৳ per bag)">
            <input
              type="number"
              value={ratePrice || ""}
              onChange={(e) => onRatePriceChange(Number(e.target.value))}
              placeholder="Enter rate price"
              className={inputCls}
            />
          </Field>
          {landingRate > 0 && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 self-end">
              <div>
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-wider block">
                  Landing Rate
                </span>
                <span className="text-[9px] text-blue-300">
                  Rate Price × Quantity
                </span>
              </div>
              <span className="text-sm font-black text-blue-400">
                ৳ {landingRate.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-2">
          Order & Financials
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Truck Fair By">
            <select
              name="truckFairType"
              value={formData.truckFairType || "dealer"}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="dealer">Dealer</option>
              <option value="retailer">Retailer</option>
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
          <Field label="Prev. Due (৳)">
            <input
              type="number"
              name="previousDue"
              value={formData.previousDue || ""}
              onChange={handleChange}
              placeholder="0"
              className={inputCls}
            />
          </Field>
          <Field label="Deposit (৳)">
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
      </div>

      <div className="bg-white dark:bg-[#0c1525] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-2">
          Date
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
          <Field label="Month">
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className={inputCls}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Day">
            <input
              type="number"
              value={day}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || (Number(v) >= 1 && Number(v) <= 31)) onDayChange(v);
              }}
              min={1}
              max={31}
              placeholder="DD"
              required
              className={inputCls}
            />
          </Field>
          <Field label="Year">
            <input
              type="number"
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              min={2000}
              max={2100}
              placeholder="YYYY"
              required
              className={inputCls}
            />
          </Field>
          <div className="flex items-center gap-1.5 pb-1">
            {formData.date ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400">{formData.date}</p>
              </>
            ) : (
              <p className="text-[10px] text-slate-400">No date set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerFormFields;