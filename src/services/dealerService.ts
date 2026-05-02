import API from '../api/axiosInstance';

export interface IDealerEntry {
  _id?: string;
  date: string;
  month: string;
  doDhaka: string;
  doGhat: string;
  bankDeposit: number | string;
  advDoQty: number | string;
  doLifting: number | string;
  excessDoQty: number | string;
  deliveredPartyName: string;
  deliveredQty: number | string;
  adminName?: string;
}

interface DealerQueryParams {
  page?: number;
  search?: string;
  month?: string;
  year?: string;
  limit?: number;
}

interface DealerResponse {
  success: boolean;
  data: IDealerEntry[];
  totalPages: number;
  availableYears: string[];
  availableMonths: string[];
}

interface ActionResponse {
  success: boolean;
  message: string;
}

export const addDealerEntry = async (formData: IDealerEntry): Promise<ActionResponse> => {
  const { data } = await API.post<ActionResponse>('/dealer/add', formData);
  return data;
};

export const getDealerEntries = async (params: DealerQueryParams): Promise<DealerResponse> => {
  const { data } = await API.get<DealerResponse>('/dealer/entries', { params });
  return data;
};

export const updateDealerEntry = async (id: string, formData: IDealerEntry): Promise<ActionResponse> => {
  const { data } = await API.put<ActionResponse>(`/dealer/update/${id}`, formData);
  return data;
};

export const deleteDealerEntry = async (id: string): Promise<ActionResponse> => {
  const { data } = await API.delete<ActionResponse>(`/dealer/delete/${id}`);
  return data;
};