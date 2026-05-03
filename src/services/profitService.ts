import API from '../api/axiosInstance';

export interface IProfitEntry {
  _id?: string;
  date: string;
  month: string;
  retailSite: string;
  qty: number | string;
  doRate: number | string;
  truckFair: number | string;
  total?: number;
  landingRate: number | string;
  com: number | string;
  afterComRate?: number;
  profitLoss?: number;
  netProfit?: number;
  remarks: string;
}

interface ProfitQueryParams {
  page?: number;
  search?: string;
  month?: string;
  year?: string;
  limit?: number;
}

interface ProfitResponse {
  success: boolean;
  data: IProfitEntry[];
  totalPages: number;
  availableYears: string[];
  availableMonths: string[];
}

interface ActionResponse {
  success: boolean;
  message: string;
}

export const addProfitEntry = async (formData: IProfitEntry): Promise<ActionResponse> => {
  const { data } = await API.post<ActionResponse>('/profit/add', formData);
  return data;
};

export const getProfitEntries = async (params: ProfitQueryParams): Promise<ProfitResponse> => {
  const { data } = await API.get<ProfitResponse>('/profit/entries', { params });
  return data;
};

export const updateProfitEntry = async (id: string, formData: IProfitEntry): Promise<ActionResponse> => {
  const { data } = await API.put<ActionResponse>(`/profit/update/${id}`, formData);
  return data;
};

export const deleteProfitEntry = async (id: string): Promise<ActionResponse> => {
  const { data } = await API.delete<ActionResponse>(`/profit/delete/${id}`);
  return data;
};