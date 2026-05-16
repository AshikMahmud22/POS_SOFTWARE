import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../../../lib/AuthProvider";
import { IRetailerEntry } from "../../../types/retailer";
import { ICompanyEntry, ICompanyResponse } from "../../../types/companies";
import { getCompanyEntries } from "../../../services/companyService";
import {
  addRetailerEntry,
  updateRetailerEntry,
  getRetailerEntry,
} from "../../../services/retailerService";
import { MONTHS, MONTH_NUMBER, EMPTY_RETAILER_FORM } from "./RetailerFormTypes";
import RetailerFormFields from "./RetailerFormFields";
import { getParties } from "../../../services/partyService";
import { IParty } from "../../../types/party";

const RetailerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState<IRetailerEntry>({
    ...EMPTY_RETAILER_FORM,
  });
  const [companies, setCompanies] = useState<ICompanyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ICompanyEntry[]>([]);
  const [uniqueCompanyNames, setUniqueCompanyNames] = useState<string[]>([]);
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [ratePrice, setRatePrice] = useState<number>(0);
  const [availableFactory, setAvailableFactory] = useState<number>(0);
  const [availableGhat, setAvailableGhat] = useState<number>(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getCompanyEntries({ limit: 1000 }).then((res: ICompanyResponse) => {
        if (res.success) {
          setCompanies(res.data);
          const names = Array.from(new Set(res.data.map((c) => c.companyName)));
          setUniqueCompanyNames(names);
        }
      });
      getParties().then((res) => {
        if (res.success) setParties(res.data);
      });
    }
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      getRetailerEntry(id)
        .then((res) => {
          if (res.success && res.data) {
            const entry = res.data;
            setFormData(entry);
            setRatePrice(entry.ratePrice || 0);
            if (entry.date) {
              const p = entry.date.split("-");
              setYear(p[0] || new Date().getFullYear().toString());
              setDay(p[2] || "");
            }
            if (entry.companyName) {
              setFilteredEntries(
                companies.filter((c) => c.companyName === entry.companyName),
              );
            }
            if (entry.companyId && entry.subcategory) {
              const companyEntry = companies.find(
                (c) =>
                  String(c._id) === entry.companyId &&
                  c.subcategory === entry.subcategory,
              );
              if (companyEntry) {
                setAvailableFactory(Number(companyEntry.dhakaDo.bag));
                setAvailableGhat(Number(companyEntry.ghatDo.bag));
              }
            }
          }
        })
        .catch(() => toast.error("Failed to load entry"));
    } else {
      setFormData({
        ...EMPTY_RETAILER_FORM,
        adminEmail: user?.email || "",
        adminName: user?.firstName || "",
        sign: user?.firstName || "",
        month: MONTHS[new Date().getMonth()],
      });
      setYear(new Date().getFullYear().toString());
      setDay("");
      setRatePrice(0);
      setAvailableFactory(0);
      setAvailableGhat(0);
    }
  }, [id, isEditing, user, companies]);

  useEffect(() => {
    if (formData.month && day && year) {
      setFormData((prev) => ({
        ...prev,
        date: `${year}-${MONTH_NUMBER[prev.month]}-${day.padStart(2, "0")}`,
        year,
      }));
    }
  }, [formData.month, day, year]);

  const maxBags =
    formData.rateType === "factory" ? availableFactory : availableGhat;
  const landingRate = ratePrice * Number(formData.quantity);
  const truckFairAmount = Number(formData.truckFair) || 0;
  const truckFairAdjusted =
    formData.truckFairType === "retailer" ? -truckFairAmount : 0;
  const totalCost = landingRate;
  const rawRestAmount =
    totalCost +
    Number(formData.previousDue) +
    truckFairAdjusted -
    Number(formData.deposit);
  const restTotalAmount = rawRestAmount < 0 ? 0 : rawRestAmount;

  useEffect(() => {
    setFormData((prev) => ({ ...prev, totalCost, restTotalAmount }));
  }, [totalCost, restTotalAmount]);

  const handlePartySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parties.find((p) => String(p._id) === e.target.value);
    if (!selected) return;
    setFormData((prev) => ({
      ...prev,
      retailerName: selected.retailerName || selected.name,
      proprietorName: selected.proprietorName || "",
      address: selected.address || "",
      mobile: selected.mobile || "",
    }));
  };

  const handleCompanySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const entries = companies.filter((c) => c.companyName === selectedName);
    setFilteredEntries(entries);
    setFormData((prev) => ({
      ...prev,
      companyName: selectedName,
      companyId: "",
      category: "",
      subcategory: "",
      doFactory: 0,
      doGhat: 0,
      doFactoryBags: 0,
      doGhatBags: 0,
      quantity: 0,
    }));
    setRatePrice(0);
    setAvailableFactory(0);
    setAvailableGhat(0);
  };

  const handleSubcategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matches = filteredEntries.filter(
      (c) => c.subcategory === e.target.value,
    );
    const selected = matches.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })[0];
    if (!selected) return;

    setAvailableFactory(Number(selected.dhakaDo.bag));
    setAvailableGhat(Number(selected.ghatDo.bag));

    setFormData((prev) => ({
      ...prev,
      companyId: String(selected._id) || "",
      subcategory: selected.subcategory,
      category: selected.category,
      doFactory: Number(selected.dhakaDo.rate),
      doGhat: Number(selected.ghatDo.rate),
      doFactoryBags: Number(selected.dhakaDo.bag),
      doGhatBags: Number(selected.ghatDo.bag),
      quantity: 0,
    }));
    setRatePrice(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const numeric = ["quantity", "previousDue", "deposit", "truckFair"];
    if (name === "rateType") {
      setFormData((prev) => ({
        ...prev,
        rateType: value as "factory" | "ghat",
        quantity: 0,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: numeric.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        adminEmail: user?.email || "",
        adminName: user?.firstName || "",
        totalCost,
        restTotalAmount,
        ratePrice,
      };
      if (isEditing && id) {
        await updateRetailerEntry(id, payload);
        toast.success("Updated successfully");
      } else {
        await addRetailerEntry(payload);
        toast.success("Entry saved");
      }
      navigate("/retailer");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black/20 md:p-8 p-4 mt-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/retailer")}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black dark:text-white text-blue-950 uppercase tracking-tighter italic">
              {isEditing ? "Edit Entry" : "New Entry"}
            </h1>
            <p className="text-gray-500 font-bold text-xs mt-0.5 uppercase tracking-widest">
              {isEditing
                ? "Update retailer record"
                : "Create a new retailer record"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <RetailerFormFields
            formData={formData}
            filteredEntries={filteredEntries}
            uniqueCompanyNames={uniqueCompanyNames}
            parties={parties}
            day={day}
            year={year}
            onDayChange={setDay}
            onYearChange={setYear}
            handleChange={handleChange}
            handlePartySelect={handlePartySelect}
            handleCompanySelect={handleCompanySelect}
            handleSubcategorySelect={handleSubcategorySelect}
            landingRate={landingRate}
            maxBags={maxBags}
            availableFactory={availableFactory}
            availableGhat={availableGhat}
            ratePrice={ratePrice}
            onRatePriceChange={setRatePrice}
          />

          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-center gap-1">
            <span className="text-[7px] font-black text-orange-400 uppercase tracking-tighter">
              Rest Amount
            </span>
            <span className="text-lg font-bold text-orange-400">
              ৳ {restTotalAmount.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400">
              Landing Rate + Prev Due{" "}
              {formData.truckFairType === "retailer" ? "− Truck Fair" : ""} −
              Deposit
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/retailer")}
              className="py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-2xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RetailerFormPage;
