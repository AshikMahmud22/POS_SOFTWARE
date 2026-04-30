import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X, Save, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import API from "../../api/axiosInstance";
import { useAuth } from "../../lib/AuthProvider";
import { IShopEntry } from "./ShopTable";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initialData: IShopEntry;
  isEditing: boolean;
}

const ShopFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  isEditing,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<IShopEntry>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      setFormData({
        ...initialData,
        adminEmail: user?.email || "",
        adminName: user?.firstName || "",
        sign: initialData.sign || user?.firstName || "ADMIN",
      });
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [initialData, isOpen, user]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["quantity", "productValue", "previousDue", "deposit", "truckFair"];

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: numericFields.includes(name) ? Number(value) : value,
      };
      updated.totalCost = Number(updated.quantity) * Number(updated.productValue);
      updated.restTotalAmount =
        updated.totalCost +
        Number(updated.previousDue) +
        Number(updated.truckFair) -
        Number(updated.deposit);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        adminEmail: user?.email,
        adminName: user?.firstName,
      };

      if (isEditing && formData._id) {
        await API.put(`/shop/update-entry/${formData._id}`, payload);
        toast.success("Updated Successfully");
      } else {
        await API.post("/shop/add-entry", payload);
        toast.success("Entry Saved");
      }
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 lg:ml-64">
        <div className="bg-blue-950 p-6 flex justify-between items-center text-white">
          <h2 className="font-black text-xl uppercase italic flex items-center gap-2">
            {isEditing ? <Edit3 size={22} /> : <PlusCircle size={22} />}
            {isEditing ? "Update Entry" : "New Entry"}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto max-h-[85vh]">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1">
              <User size={12} /> Admin Account
            </label>
            <input
              type="text"
              value={user?.email || ""}
              readOnly
              className="w-full p-3.5 border dark:border-gray-700 rounded-2xl bg-gray-100 dark:bg-gray-800/50 text-gray-500 font-bold outline-none cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3.5 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold"
              required
            />
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="w-full p-3.5 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold"
              required
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            name="cementDetails"
            placeholder="Product Details"
            value={formData.cementDetails}
            onChange={handleInputChange}
            className="w-full p-3.5 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity || ""}
              onChange={handleInputChange}
              className="p-3.5 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold"
            />
            <input
              type="number"
              name="productValue"
              placeholder="Unit Price"
              value={formData.productValue || ""}
              onChange={handleInputChange}
              className="p-3.5 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-gray-400 uppercase ml-2">Truck</label>
              <input type="number" name="truckFair" value={formData.truckFair || ""} onChange={handleInputChange} className="w-full p-3 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-gray-400 uppercase ml-2">Prev Due</label>
              <input type="number" name="previousDue" value={formData.previousDue || ""} onChange={handleInputChange} className="w-full p-3 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-gray-400 uppercase ml-2">Deposit</label>
              <input type="number" name="deposit" value={formData.deposit || ""} onChange={handleInputChange} className="w-full p-3 border dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white text-sm font-bold" />
            </div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex justify-between items-center border border-blue-100 dark:border-blue-900/30">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase">Total Rest Amount</p>
              <p className="text-2xl font-black text-blue-950 dark:text-blue-300 italic">৳ {formData.restTotalAmount}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase">Authorised By</p>
              <p className="text-[11px] font-black text-gray-600 dark:text-gray-400">{formData.adminName || "ADMIN"}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border dark:border-gray-700 rounded-2xl font-black text-gray-400 uppercase text-xs hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-blue-950 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 uppercase text-xs transition-all hover:bg-blue-900 active:scale-95 disabled:opacity-70"
            >
              {loading ? <span className="animate-pulse">Processing...</span> : <><Save size={20} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopFormModal;