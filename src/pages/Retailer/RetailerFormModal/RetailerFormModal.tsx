import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

import RetailerFormFields from "./RetailerFormFields";
import RetailerFormSummary from "./RetailerFormSummary";
import { IRetailerEntry } from "../../../types/retailer";
import { useAuth } from "../../../lib/AuthProvider";
import { ICompanyEntry, ICompanyResponse } from "../../../types/companies";
import { getCompanyEntries } from "../../../services/companyService";
import {
  addRetailerEntry,
  updateRetailerEntry,
} from "../../../services/retailerService";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NUMBER: Record<string, string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initialData: IRetailerEntry;
  isEditing: boolean;
}

const RetailerFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  isEditing,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<IRetailerEntry>(initialData);
  const [companies, setCompanies] = useState<ICompanyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ICompanyEntry[]>([]);
  const [uniqueCompanyNames, setUniqueCompanyNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      return;
    }

    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sw}px`;

    setFormData({
      ...initialData,
      adminEmail: user?.email || "",
      adminName: user?.firstName || "",
      sign: initialData.sign || user?.firstName || "",
      month: initialData.month || MONTHS[new Date().getMonth()],
    });

    if (initialData.date) {
      const p = initialData.date.split("-");
      setYear(p[0] || new Date().getFullYear().toString());
      setDay(p[2] || "");
    } else {
      setYear(new Date().getFullYear().toString());
      setDay("");
    }

    getCompanyEntries({ limit: 1000 }).then((res: ICompanyResponse) => {
      if (res.success) {
        setCompanies(res.data);
        const names = Array.from(new Set(res.data.map((c) => c.companyName)));
        setUniqueCompanyNames(names);
        if (initialData.companyName) {
          const entries = res.data.filter(
            (c) => c.companyName === initialData.companyName,
          );
          setFilteredEntries(entries);
        }
      }
    });

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, initialData, user]);

  useEffect(() => {
    if (formData.month && day && year) {
      setFormData((prev) => ({
        ...prev,
        date: `${year}-${MONTH_NUMBER[prev.month]}-${day.padStart(2, "0")}`,
        year,
      }));
    }
  }, [formData.month, day, year]);

  useEffect(() => {
    const rate =
      formData.rateType === "factory"
        ? Number(formData.doFactory)
        : Number(formData.doGhat);
    const totalCost = Number(formData.quantity) * rate;
    const restTotalAmount =
      totalCost +
      Number(formData.previousDue) +
      Number(formData.truckFair) -
      Number(formData.deposit);
    setFormData((prev) => ({ ...prev, totalCost, restTotalAmount }));
  }, [
    formData.quantity,
    formData.rateType,
    formData.doFactory,
    formData.doGhat,
    formData.previousDue,
    formData.truckFair,
    formData.deposit,
  ]);

  if (!isOpen) return null;

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
    }));
  };

  const handleSubcategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = filteredEntries.find(
      (c) => c.subcategory === e.target.value,
    );
    if (!selected) return;
    setFormData((prev) => ({
      ...prev,
      companyId: selected._id || "",
      subcategory: selected.subcategory,
      category: selected.category,
      doFactory: Number(selected.dhakaDo.rate),
      doGhat: Number(selected.ghatDo.rate),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const numeric = ["quantity", "previousDue", "deposit", "truckFair"];
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
      };
      if (isEditing && formData._id) {
        await updateRetailerEntry(formData._id, payload);
        toast.success("Updated successfully");
      } else {
        await addRetailerEntry(payload);
        toast.success("Entry saved");
      }
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 mt-10 sm:mt-0">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col border border-white/5"
        style={{
          maxHeight: "95svh",
          maxWidth: "min(95vw, 860px)",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          className="relative flex-shrink-0 px-4 py-3 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(135deg, #040d1a 0%, #0a1a35 60%, #061020 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {isEditing ? (
                <Edit3 size={13} className="text-blue-400" />
              ) : (
                <PlusCircle size={13} className="text-blue-400" />
              )}
            </div>
            <div>
              <p
                className="text-[7px] font-black uppercase tracking-[0.2em]"
                style={{ color: "rgba(96,165,250,0.6)" }}
              >
                {isEditing ? "Modify Record" : "New Record"}
              </p>
              <h2 className="text-xs font-black text-white leading-tight">
                {isEditing ? "Update Retailer Entry" : "Add Retailer Entry"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200 hover:rotate-90 flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <X size={13} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0c1525]"
          style={{ overscrollBehavior: "contain" }}
        >
          <form onSubmit={handleSubmit} className="p-3 sm:p-4">
            <RetailerFormFields
              formData={formData}
              filteredEntries={filteredEntries}
              uniqueCompanyNames={uniqueCompanyNames}
              day={day}
              year={year}
              onDayChange={setDay}
              onYearChange={setYear}
              handleChange={handleChange}
              handleCompanySelect={handleCompanySelect}
              handleSubcategorySelect={handleSubcategorySelect}
            />
            <RetailerFormSummary
              formData={formData}
              loading={loading}
              isEditing={isEditing}
              onClose={onClose}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RetailerFormModal;
