import React from "react";
import { IRetailerEntry } from "../../../types/retailer";
import { ICompanyEntry } from "../../../types/companies";

interface Props {
  formData: IRetailerEntry;
  filteredEntries: ICompanyEntry[];
  day: string;
  year: string;
  onDayChange: (val: string) => void;
  onYearChange: (val: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleCompanySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubcategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  uniqueCompanyNames: string[];
}

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

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const readonlyCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/40 bg-slate-100 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-not-allowed";

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, children, className = "" }) => (
  <div className={`space-y-0.5 ${className}`}>
    <label className="block text-[8px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const Divider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 my-1">
    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/40" />
    <span className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
      {label}
    </span>
    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/40" />
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
}) => {
  return (
    <>
      <Divider label="Retailer Info" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 mb-3">
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
              handleChange({
                ...e,
                target: { ...e.target, name: "mobile", value: v },
              });
            }}
            placeholder="01700000000"
            maxLength={11}
            className={inputCls}
          />
        </Field>
      </div>

      <Divider label="Company & Product" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 mb-2">
        <Field label="Company Name">
          <select
            value={formData.companyName || ""}
            onChange={handleCompanySelect}
            required
            className={`${inputCls} appearance-none`}
          >
            <option value="">Select Company</option>
            {uniqueCompanyNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subcategory">
          <select
            value={formData.subcategory || ""}
            onChange={handleSubcategorySelect}
            required
            disabled={!formData.companyName}
            className={`${inputCls} appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">Select Subcategory</option>
            {filteredEntries.map((c) => (
              <option key={c._id} value={c.subcategory}>
                {c.subcategory}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <div className={readonlyCls}>
            {formData.category || (
              <span className="text-slate-300 dark:text-slate-600">
                Auto filled
              </span>
            )}
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <Field label="Do Factory Rate (৳)">
          <div className={readonlyCls}>
            {formData.doFactory ? (
              `৳${Number(formData.doFactory).toLocaleString()}`
            ) : (
              <span className="text-slate-300 dark:text-slate-600">
                Auto filled
              </span>
            )}
          </div>
        </Field>
        <Field label="Do Ghat Rate (৳)">
          <div className={readonlyCls}>
            {formData.doGhat ? (
              `৳${Number(formData.doGhat).toLocaleString()}`
            ) : (
              <span className="text-slate-300 dark:text-slate-600">
                Auto filled
              </span>
            )}
          </div>
        </Field>
        <Field label="Rate Type">
          <select
            name="rateType"
            value={formData.rateType || "factory"}
            onChange={handleChange}
            className={`${inputCls} appearance-none`}
          >
            <option value="factory">Do Factory</option>
            <option value="ghat">Do Ghat</option>
          </select>
        </Field>
        <Field label="Quantity (Bags)">
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
            placeholder="0"
            required
            className={inputCls}
          />
        </Field>
      </div>

      <Divider label="Order & Financials" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 mb-3">
        <Field label="Truck Fair By">
          <select
            name="truckFairType"
            value={formData.truckFairType || "self"}
            onChange={handleChange}
            className={`${inputCls} appearance-none`}
          >
            <option value="self">By Self</option>
            <option value="company">By Company</option>
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

      <Divider label="Date" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 mb-3 items-end">
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
        <Field label="Day">
          <input
            type="number"
            value={day}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || (Number(v) >= 1 && Number(v) <= 31))
                onDayChange(v);
            }}
            min={1}
            max={31}
            placeholder="DD"
            required
            className={`${inputCls} text-center`}
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
            className={`${inputCls} text-center`}
          />
        </Field>
        <div className="flex items-center gap-1.5 pb-1">
          {formData.date ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                {formData.date}
              </p>
            </>
          ) : (
            <p className="text-[10px] text-slate-400">No date set</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RetailerFormFields;
