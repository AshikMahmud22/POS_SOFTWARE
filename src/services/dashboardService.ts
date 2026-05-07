import API from "../api/axiosInstance";

interface ShopSummary {
  totalEntries: number;
  totalRestAmount: number;
  thisMonthEntries: number;
}

interface CompanySummary {
  totalEntries: number;
  totalExcessDo: number;
  thisMonthEntries: number;
}

interface CollectionSummary {
  totalEntries: number;
  totalPartyBalance: number;
  thisMonthEntries: number;
}

interface PartySummary {
  totalParties: number;
  thisMonthNewParties: number;
}

export interface IDashboardSummary {
  shop: ShopSummary;
  company: CompanySummary;
  collection: CollectionSummary;
  party: PartySummary;
}

interface DashboardResponse {
  success: boolean;
  data: IDashboardSummary;
}

export const getDashboardSummary = async (): Promise<DashboardResponse> => {
  const res = await API.get<DashboardResponse>("/dashboard/summary");
  return res.data;
};