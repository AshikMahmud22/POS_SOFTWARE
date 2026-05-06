import API from "../api/axiosInstance";
import { IParty } from "../types/party";

interface ApiResponse {
  success: boolean;
  data: IParty[];
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

export const getParties = async (): Promise<ApiResponse> => {
  const res = await API.get<ApiResponse>("/party/get-parties");
  return res.data;
};

export const addParty = async (data: Omit<IParty, "_id" | "createdAt">): Promise<SuccessResponse> => {
  const res = await API.post<SuccessResponse>("/party/add-party", data);
  return res.data;
};

export const updateParty = async (id: string, data: Partial<IParty>): Promise<SuccessResponse> => {
  const res = await API.put<SuccessResponse>(`/party/update-party/${id}`, data);
  return res.data;
};

export const deleteParty = async (id: string): Promise<SuccessResponse> => {
  const res = await API.delete<SuccessResponse>(`/party/delete-party/${id}`);
  return res.data;
};