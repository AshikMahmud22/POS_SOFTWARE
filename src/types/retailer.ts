export interface IRetailerEntry {
  _id?: string;
  date: string;
  month: string;
  year: string;
  retailerName: string;
  proprietorName: string;
  address: string;
  mobile: string;
  companyId: string;
  companyName: string;
  category: string;
  subcategory: string;
  rateType: "factory" | "ghat";
  doFactory: number;
  doGhat: number;
  doFactoryBags: number;
  doGhatBags: number;
  ratePrice: number;
  quantity: number;
  totalCost: number;
  previousDue: number;
  deposit: number;
  truckFair: number;
  truckFairType: "dealer" | "retailer";
  restTotalAmount: number;
  sign: string;
  adminEmail: string;
  adminName: string;
  status?: string;
  createdAt?: string;
  deletedAt?: string;
}

export const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];