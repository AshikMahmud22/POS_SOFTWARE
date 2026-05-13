export const MONTH_NUMBER: Record<string, string> = {
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

export const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

export const readonlyCls =
  "w-full px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700/40 bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300 text-xs font-bold outline-none cursor-default select-none";

export const wordCount = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;