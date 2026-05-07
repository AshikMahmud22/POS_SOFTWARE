
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/UserTable";
import DemographicCard from "../../components/ecommerce/EaringsCard";
import Dashboard from "../../components/Dashboard/Dashboard";
import { TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <>
      <div>
        <div className="  mt-10">
        <p className=" font-bold dark:text-white mb-5  uppercase tracking-tight flex gap-3 text-blue-950 items-center text-2xl">
          <TrendingUp size={50}   className="text-blue-600" />
          Overview of all collections
        </p>
      </div>
    </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
        <div className="col-span-12 space-y-6 xl:col-span-7 ">
          <Dashboard />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
