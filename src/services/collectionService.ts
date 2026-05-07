import API from "../api/axiosInstance";
import { ICollection } from "../types/collection";

interface ApiResponse {
  success: boolean;
  data: ICollection[];
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

export const getCollections = async (): Promise<ApiResponse> => {
  const res = await API.get<ApiResponse>("/collection/get-entries");
  return res.data;
};

export const addCollection = async (data: Omit<ICollection, "_id" | "createdAt">): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>("/collection/add-entry", data);
  return res.data;
};

export const updateCollection = async (id: string, data: Partial<ICollection>): Promise<SuccessResponse> => {
  const res = await API.put<SuccessResponse>(`/collection/update-entry/${id}`, data);
  return res.data;
};

export const deleteCollection = async (id: string): Promise<SuccessResponse> => {
  const res = await API.delete<SuccessResponse>(`/collection/delete-entry/${id}`);
  return res.data;
};