import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  IDealerEntry,
  addDealerEntry,
  updateDealerEntry,
} from "../../services/dealerService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData: IDealerEntry | null;
  refreshData: () => void;
}

const DealerFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editData,
  refreshData,
}) => {
  const [formData, setFormData] = useState<IDealerEntry>({
    date: "",
    month: "",
    doDhaka: "",
    doGhat: "",
    bankDeposit: "",
    advDoQty: "",
    doLifting: "",
    excessDoQty: "",
    deliveredPartyName: "",
    deliveredQty: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData });
    } else {
      setFormData({
        date: "",
        month: "",
        doDhaka: "",
        doGhat: "",
        bankDeposit: "",
        advDoQty: "",
        doLifting: "",
        excessDoQty: "",
        deliveredPartyName: "",
        deliveredQty: "",
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editData?._id) {
        const res = await updateDealerEntry(editData._id, formData);
        if (res.success) {
          toast.success("Updated successfully");
          refreshData();
          onClose();
        }
      } else {
        const res = await addDealerEntry(formData);
        if (res.success) {
          toast.success("Added successfully");
          refreshData();
          onClose();
        }
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] p-4 shadow-2xl overflow-y-auto max-h-[90vh] lg:ml-64 mt-15 border dark:border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-blue-950 dark:text-white leading-none">
              {editData ? "Update Record" : "New Entry"}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Dealer Information Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hover:rotate-90 hover:text-red-500 dark:text-white"
          >
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 dark:text-white"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase ml-2 text-gray-400">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase ml-2 text-gray-400">
              Month
            </label>
            <select
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className="w-full p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
              required
            >
              <option value="">Select Month</option>
              {[
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
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder="DO Dhaka Number"
            value={formData.doDhaka}
            onChange={(e) =>
              setFormData({ ...formData, doDhaka: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
          />
          <input
            placeholder="DO Ghat Number"
            value={formData.doGhat}
            onChange={(e) =>
              setFormData({ ...formData, doGhat: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
          />
          <input
            type="number"
            placeholder="Bank Deposit"
            value={formData.bankDeposit}
            onChange={(e) =>
              setFormData({ ...formData, bankDeposit: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm text-green-600"
          />
          <input
            type="number"
            placeholder="Adv DO Qty"
            value={formData.advDoQty}
            onChange={(e) =>
              setFormData({ ...formData, advDoQty: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
          />
          <input
            type="number"
            placeholder="DO Lifting"
            value={formData.doLifting}
            onChange={(e) =>
              setFormData({ ...formData, doLifting: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
          />
          <input
            type="number"
            placeholder="Excess DO Qty"
            value={formData.excessDoQty}
            onChange={(e) =>
              setFormData({ ...formData, excessDoQty: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm text-red-500"
          />
          <input
            placeholder="Party Name"
            value={formData.deliveredPartyName}
            onChange={(e) =>
              setFormData({ ...formData, deliveredPartyName: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
          />
          <input
            type="number"
            placeholder="Delivered Qty"
            value={formData.deliveredQty}
            onChange={(e) =>
              setFormData({ ...formData, deliveredQty: e.target.value })
            }
            className="p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 outline-none font-bold text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-blue-950 text-white p-5 rounded-2xl font-black uppercase italic hover:bg-blue-900 transition-all mt-4  active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processing...
              </>
            ) : editData ? (
              "Update Record"
            ) : (
              "Save Record"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

import { Loader2 } from "lucide-react";
export default DealerFormModal;
