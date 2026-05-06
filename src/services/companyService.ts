import API from "../api/axiosInstance";
import { ICategory, ICompanyEntry } from "../types/companies";

export interface IGetEntriesParams {
  page?: number;
  limit?: number;
  search?: string;
  month?: string;
  year?: string;
}

export interface IEntriesResponse {
  success: boolean;
  data: ICompanyEntry[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  availableYears: string[];
  availableMonths: string[];
}

export const getCategories = async () => {
  const { data } = await API.get<{ success: boolean; data: ICategory[] }>("/companies/categories");
  return data;
};

export const addCategory = async (categoryData: Partial<ICategory>) => {
  const { data } = await API.post<{ success: boolean; message: string; data: ICategory }>(
    "/companies/categories/add",
    categoryData
  );
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await API.delete<{ success: boolean; message: string }>(
    `/companies/categories/delete/${id}`
  );
  return data;
};

export const getCompanyEntries = async (params: IGetEntriesParams) => {
  const { data } = await API.get<IEntriesResponse>("/companies/entries", { params });
  return data;
};

export const addCompanyEntry = async (entryData: Partial<ICompanyEntry>) => {
  const { data } = await API.post<{ success: boolean; message: string }>(
    "/companies/add",
    entryData
  );
  return data;
};

export const updateCompanyEntry = async (id: string, entryData: Partial<ICompanyEntry>) => {
  const { data } = await API.put<{ success: boolean; message: string }>(
    `/companies/update/${id}`,
    entryData
  );
  return data;
};

export const deleteCompanyEntry = async (id: string) => {
  const { data } = await API.delete<{ success: boolean; message: string }>(
    `/companies/delete/${id}`
  );
  return data;
};