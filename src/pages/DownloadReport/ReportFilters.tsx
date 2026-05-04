import React from "react";
import { Eye, FileDown } from "lucide-react";
import { SECTIONS } from "./reportConstants";

interface ReportFiltersProps {
  section: string;
  year: string;
  month: string;
  availableYears: string[];
  availableMonths: string[];
  loadingYears: boolean;
  loadingMonths: boolean;
  loadingPreview: boolean;
  preview: boolean;
  onSectionChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onMonthChange: (val: string) => void;
  onPreview: () => void;
  onDownload: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  section,
  year,
  month,
  availableYears,
  availableMonths,
  loadingYears,
  loadingMonths,
  loadingPreview,
  preview,
  onSectionChange,
  onYearChange,
  onMonthChange,
  onPreview,
  onDownload,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 p-4 md:p-6 mb-6 md:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Section
          </label>
          <select
            value={section}
            onChange={(e) => onSectionChange(e.target.value)}
            className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 outline-none text-sm w-full"
          >
            <option value="">Select Section</option>
            {SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            disabled={!section || loadingYears}
            className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 outline-none text-sm disabled:opacity-50 w-full"
          >
            <option value="">{loadingYears ? "Loading..." : "Select Year"}</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            disabled={!year || loadingMonths}
            className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 outline-none text-sm disabled:opacity-50 w-full"
          >
            <option value="">{loadingMonths ? "Loading..." : "Select Month"}</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 invisible">
            Action
          </label>
          <button
            onClick={onPreview}
            disabled={loadingPreview || !section || !year || !month}
            className="bg-blue-950 text-white rounded-lg px-4 py-2 font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors disabled:opacity-50 w-full"
          >
            <Eye size={16} />
            {loadingPreview ? "Loading..." : "Preview"}
          </button>
        </div>
      </div>

      {preview && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={onDownload}
            className="bg-green-600 text-white rounded-lg px-5 py-2 font-bold flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <FileDown size={16} /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;