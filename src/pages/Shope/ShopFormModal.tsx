import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import API from "../../api/axiosInstance";
import { getAuth } from "firebase/auth";

export interface ShopFormData {
  date: string;
  month: string;
  cementDetails: string;
  quantity: number;
  productValue: number;
  previousDue: number;
  deposit: number;
  truckFair: number;
  sign: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initialData: ShopFormData;
  isEditing: boolean;
}

interface ErrorResponse {
  message: string;
}

const ShopFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  isEditing,
}) => {
  const [formData, setFormData] = useState<ShopFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    setFormData({
      ...initialData,
      sign: isEditing ? initialData.sign : (user?.email || "Unknown Admin")
    });
  }, [initialData, isEditing, auth.currentUser]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ["quantity", "productValue", "previousDue", "deposit", "truckFair"];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await API.put("/shop/update-entry", formData);
        toast.success("Entry updated successfully");
      } else {
        await API.post("/shop/add-entry", formData);
        toast.success("Entry saved to database");
      }
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
        <div className="bg-blue-950 p-5 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            {isEditing ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            {isEditing ? "Edit Shop Record" : "New Shop Entry"}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2.5 border rounded-xl outline-none bg-gray-50" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Month</label>
              <select name="month" value={formData.month} onChange={handleInputChange} className="w-full p-2.5 border rounded-xl outline-none bg-gray-50" required>
                <option value="">Select Month</option>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cement Details</label>
            <input type="text" name="cementDetails" placeholder="Brand / Grade / Details" value={formData.cementDetails} onChange={handleInputChange} className="w-full p-2.5 border rounded-xl outline-none bg-gray-50" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity || ""} onChange={handleInputChange} className="p-2.5 border rounded-xl outline-none bg-gray-50" />
            <input type="number" name="productValue" placeholder="Unit Price" value={formData.productValue || ""} onChange={handleInputChange} className="p-2.5 border rounded-xl outline-none bg-gray-50" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input type="number" name="truckFair" placeholder="Truck" value={formData.truckFair || ""} onChange={handleInputChange} className="p-2.5 border rounded-xl outline-none text-sm bg-gray-50" />
            <input type="number" name="previousDue" placeholder="Due" value={formData.previousDue || ""} onChange={handleInputChange} className="p-2.5 border rounded-xl outline-none text-sm bg-gray-50" />
            <input type="number" name="deposit" placeholder="Deposit" value={formData.deposit || ""} onChange={handleInputChange} className="p-2.5 border rounded-xl outline-none text-sm bg-gray-50" />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
             <p className="text-[10px] font-black text-blue-400 uppercase">Authorized By</p>
             <p className="text-sm font-bold text-blue-900">{auth.currentUser?.displayName || "Verified Admin"}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 px-4 py-2.5 border rounded-xl hover:bg-gray-100 font-bold text-gray-600 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-950 text-white rounded-xl hover:bg-blue-900 font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              <Save size={18} /> {loading ? "Processing..." : isEditing ? "Update Entry" : "Confirm Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopFormModal;