export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const MONTH_NUMBER: Record<string, string> = {
  January: "01", February: "02", March: "03", April: "04",
  May: "05", June: "06", July: "07", August: "08",
  September: "09", October: "10", November: "11", December: "12",
};

export const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

export const readonlyCls =
  "w-full px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs bg-slate-800/10 font-semibold outline-none cursor-default select-none " ;

export const EMPTY_RETAILER_FORM = {
  date: "",
  month: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear().toString(),
  retailerName: "",
  proprietorName: "",
  address: "",
  mobile: "",
  companyId: "",
  companyName: "",
  category: "",
  subcategory: "",
  rateType: "factory" as "factory" | "ghat",
  doFactory: 0,
  doGhat: 0,
  doFactoryBags: 0,
  doGhatBags: 0,
  ratePrice: 0,
  quantity: 0,
  totalCost: 0,
  previousDue: 0,
  deposit: 0,
  truckFair: 0,
  truckFairType: "dealer" as "dealer" | "retailer",
  restTotalAmount: 0,
  sign: "",
  adminEmail: "",
  adminName: "",
  status: "",
};