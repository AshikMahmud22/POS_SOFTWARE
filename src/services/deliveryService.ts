import API from '../api/axiosInstance';

export interface IDeliveryCostEntry {
  _id?: string;
  date: string;
  month: string;
  serialNumber: string;
  retailSite: string;
  bag: number | string;
  carCost: number | string;
  doGive: number | string;
  doTake: number | string;
  gift: number | string;
}

interface DeliveryCostQueryParams {
  page?: number;
  search?: string;
  month?: string;
  year?: string;
  limit?: number;
}

interface DeliveryCostResponse {
  success: boolean;
  data: IDeliveryCostEntry[];
  totalPages: number;
  availableYears: string[];
  availableMonths: string[];
}

interface ActionResponse {
  success: boolean;
  message: string;
}

export const addDeliveryCostEntry = async (formData: IDeliveryCostEntry): Promise<ActionResponse> => {
  const { data } = await API.post<ActionResponse>('/delivery-cost/add', formData);
  return data;
};

export const getDeliveryCostEntries = async (params: DeliveryCostQueryParams): Promise<DeliveryCostResponse> => {
  const { data } = await API.get<DeliveryCostResponse>('/delivery-cost/entries', { params });
  return data;
};

export const updateDeliveryCostEntry = async (id: string, formData: IDeliveryCostEntry): Promise<ActionResponse> => {
  const { data } = await API.put<ActionResponse>(`/delivery-cost/update/${id}`, formData);
  return data;
};

export const deleteDeliveryCostEntry = async (id: string): Promise<ActionResponse> => {
  const { data } = await API.delete<ActionResponse>(`/delivery-cost/delete/${id}`);
  return data;
};