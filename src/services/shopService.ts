import API from "../api/axiosInstance";
import { IShopEntry } from "../types/shop";

interface ApiResponse {
  success: boolean;
  data: IShopEntry[];
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

export const getShopEntries = async (): Promise<ApiResponse> => {
  const res = await API.get<ApiResponse>("/shop/get-entries");
  return res.data;
};

export const addShopEntry = async (
  formData: IShopEntry,
): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>("/shop/add-entry", formData);
  return res.data;
};

export const updateShopEntry = async (
  id: string,
  formData: Partial<IShopEntry>,
): Promise<SuccessResponse> => {
  const res = await API.put<SuccessResponse>(
    `/shop/update-entry/${id}`,
    formData,
  );
  return res.data;
};

export const moveToTrash = async (id: string): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>(`/shop/move-to-trash/${id}`);
  return res.data;
};
export const getTrashedEntries = async (): Promise<ApiResponse> => {
  const res = await API.get<ApiResponse>("/shop/trashed-entries");
  return res.data;
};

export const restoreEntry = async (id: string): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>(`/shop/restore-entry/${id}`);
  return res.data;
};

export const permanentDelete = async (id: string): Promise<SuccessResponse> => {
  const res = await API.delete<SuccessResponse>(`/shop/permanent-delete/${id}`);
  return res.data;
};
