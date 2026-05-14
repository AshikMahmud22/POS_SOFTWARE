export interface IDhakaDo {
  bag: number | string;
  rate: number | string;
  amount?: number | string;
}

export interface IGhatDo {
  bag: number | string;
  rate: number | string;
  amount?: number | string;
}

export interface IBankDeposit {
  totalDeposit?: number | string;
  cash: number | string;
  commission: number | string;
  commissionReason: string;
}

export interface ICategory {
  _id?: string;
  name: string;
  subcategories: string[];
}

export type DoSource = "factory" | "ghat";

export interface ICompanyEntry {
  _id?: string;
  companyName: string;
  year: string;
  month: string;
  category: string;
  subcategory: string;
  doSource: DoSource;
  dhakaDo: IDhakaDo;
  ghatDo: IGhatDo;
  bankDeposit: IBankDeposit;
  advDoQty?: number | string;
  advDoAmount?: number | string;
  doLifting: number | string;
  excessDoQty?: number | string;
  previousDo?: number | string;
  previousDoRate?: number | string;
  previousDoAmount?: number | string;
  previousDue?: number | string;
  dueAmount?: number | string;
  adminName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICompanyQueryParams {
  page?: number;
  search?: string;
  month?: string;
  year?: string;
  limit?: number;
}

export interface ICompanyResponse {
  success: boolean;
  data: ICompanyEntry[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  availableYears: string[];
  availableMonths: string[];
}

export interface ICategoryResponse {
  success: boolean;
  data: ICategory[];
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: ICompanyEntry;
}

export interface IPreviousDueResponse {
  success: boolean;
  previousDue: number;
  previousDoBags: number;
}

export const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
] as const;

export type Month = typeof MONTHS[number];

export const EMPTY_COMPANY_FORM: ICompanyEntry = {
  companyName: "",
  year: "",
  month: "",
  category: "",
  subcategory: "",
  doSource: "factory",
  dhakaDo: { bag: "", rate: "", amount: "" },
  ghatDo: { bag: "", rate: "", amount: "" },
  bankDeposit: {
    totalDeposit: "",
    cash: "",
    commission: "",
    commissionReason: "",
  },
  advDoQty: "",
  advDoAmount: "",
  doLifting: "",
  excessDoQty: "",
  previousDo: "",
  previousDoRate: "",
  previousDoAmount: "",
  previousDue: "",
  dueAmount: "",
};