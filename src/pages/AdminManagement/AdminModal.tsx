import React, { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";

interface AdminFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  form: AdminFormValues;
  setForm: React.Dispatch<React.SetStateAction<AdminFormValues>>;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  form,
  setForm,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setForm({ ...form, phone: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-10 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-blue-950 p-8 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">New Admin</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              required
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-2xl outline-none border focus:border-blue-500 transition-all"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-2xl outline-none border focus:border-blue-500 transition-all"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-2xl outline-none border focus:border-blue-500 transition-all"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="relative">
            <input
              type="tel"
              placeholder="Phone (11 Digits)"
              required
              autoComplete="tel"
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-2xl outline-none border focus:border-blue-500 transition-all"
              value={form.phone}
              onChange={handlePhoneChange}
            />
            {form.phone.length > 0 && form.phone.length !== 11 && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 font-medium">
                Must be exactly 11 digits (Current: {form.phone.length})
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              autoComplete="new-password"
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-2xl outline-none border focus:border-blue-500 transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || form.phone.length !== 11}
            className="w-full bg-blue-950 text-white py-5 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Processing...
              </>
            ) : (
              "Save Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;