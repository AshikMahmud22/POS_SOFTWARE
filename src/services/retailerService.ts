import API from "../api/axiosInstance";
import { IRetailerEntry } from "../types/retailer";

interface ApiResponse {
  success: boolean;
  data: IRetailerEntry[];
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

export const getRetailerEntries = async (): Promise<ApiResponse> => {
  const res = await API.get<ApiResponse>("/retailer/get-entries");
  return res.data;
};

export const addRetailerEntry = async (
  formData: IRetailerEntry
): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>("/retailer/add-entry", formData);
  return res.data;
};

export const updateRetailerEntry = async (
  id: string,
  formData: Partial<IRetailerEntry>
): Promise<SuccessResponse> => {
  const res = await API.put<SuccessResponse>(
    `/retailer/update-entry/${id}`,
    formData
  );
  return res.data;
};

export const moveToTrash = async (id: string): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>(`/retailer/move-to-trash/${id}`);
  return res.data;
};

export const getTrashedEntries = async (): Promise<ApiResponse> => {
  const res = await API.get<ApiResponse>("/retailer/trashed-entries");
  return res.data;
};

export const restoreEntry = async (id: string): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>(`/retailer/restore-entry/${id}`);
  return res.data;
};

export const permanentDelete = async (id: string): Promise<SuccessResponse> => {
  const res = await API.delete<SuccessResponse>(
    `/retailer/permanent-delete/${id}`
  );
  return res.data;
};