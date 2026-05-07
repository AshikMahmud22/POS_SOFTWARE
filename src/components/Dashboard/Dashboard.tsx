import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Building2,
  HandCoins,
  Users,
  Loader2,
  
} from "lucide-react";
import {
  getDashboardSummary,
  IDashboardSummary,
} from "../../services/dashboardService";

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

interface CardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  primary: { label: string; value: string };
  secondary1: { label: string; value: string };
  secondary2?: { label: string; value: string };
  accentColor: string;
}

const DashboardCard: React.FC<CardProps> = ({
  title,
  icon,
  iconBg,
  primary,
  secondary1,
  secondary2,
  accentColor,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 shadow-sm p-6 flex flex-col gap-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${accentColor}`}
        >
          {title}
        </span>
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
          {primary.label}
        </p>
        <p className="text-3xl font-semibold text-blue-950  dark:text-white tracking-tight">
          {primary.value}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1 border-t dark:border-gray-800">
        <div className="flex-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
            {secondary1.label}
          </p>
          <p className="text-sm font-black text-gray-700 dark:text-gray-300">
            {secondary1.value}
          </p>
        </div>
        {secondary2 && (
          <>
            <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
            <div className="flex-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
                {secondary2.label}
              </p>
              <p className="text-sm font-black text-gray-700 dark:text-gray-300">
                {secondary2.value}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<IDashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboardSummary();
        if (res.success) setSummary(res.data);
      } catch {
        console.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 font-bold uppercase text-xs">
          Failed to load dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="">
    

      <div className="grid grid-cols-2 gap-6 ">
        <DashboardCard
          title="Shop"
          icon={<ShoppingBag size={20} className="text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          accentColor="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 "
          primary={{
            label: "Total Rest Amount",
            value: `৳${formatNumber(summary.shop.totalRestAmount)}`,
          }}
          secondary1={{
            label: "Total Entries",
            value: formatNumber(summary.shop.totalEntries),
          }}
          secondary2={{
            label: "This Month",
            value: formatNumber(summary.shop.thisMonthEntries),
          }}
        />

        <DashboardCard
          title="Company"
          icon={<Building2 size={20} className="text-purple-600" />}
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          accentColor="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
          primary={{
            label: "Total Excess DO",
              value: `${formatNumber(summary.company.totalExcessDo)} B`,
          }}
          secondary1={{
            label: "Total Entries",
            value: formatNumber(summary.company.totalEntries),
          }}
          secondary2={{
            label: "This Month",
            value: formatNumber(summary.company.thisMonthEntries),
          }}
        />

        <DashboardCard
          title="Collection"
          icon={<HandCoins size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          accentColor="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
          primary={{
            label: "Total Party Balance",
            value: `৳${formatNumber(summary.collection.totalPartyBalance)}`,
          }}
          secondary1={{
            label: "Total Entries",
            value: formatNumber(summary.collection.totalEntries),
          }}
          secondary2={{
            label: "This Month",
            value: formatNumber(summary.collection.thisMonthEntries),
          }}
        />

        <DashboardCard
          title="Parties"
          icon={<Users size={20} className="text-orange-600" />}
          iconBg="bg-orange-50 dark:bg-orange-900/20"
          accentColor="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
          primary={{
            label: "Total Parties",
            value: formatNumber(summary.party.totalParties),
          }}
          secondary1={{
            label: "This Month New",
            value: formatNumber(summary.party.thisMonthNewParties),
          }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
