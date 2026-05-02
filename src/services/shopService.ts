import API from '../api/axiosInstance';

export interface ShopEntryData {
  date: string;
  month: string;
  year: string;
  productDetails: string;
  quantity: number;
  productValue: number;
  totalCost: number;
  previousDue: number;
  deposit: number;
  truckFair: number;
  restTotalAmount: number;
  sign?: string;
}

interface SuccessResponse {
  success: boolean;
  message: string;
  insertedId?: string;
}

export const addShopEntry = async (formData: ShopEntryData): Promise<SuccessResponse> => {
  const response = await API.post<SuccessResponse>('/shop/add-entry', formData);
  return response.data;
};

export const getShopEntries = async (): Promise<ShopEntryData[]> => {
  const response = await API.get<ShopEntryData[]>('/shop');
  return response.data;
};