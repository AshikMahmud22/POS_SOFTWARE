import React from "react";
import { Trash2, Loader2, Phone, Mail } from "lucide-react";
import { AdminData } from "./AdminManagement";

interface AdminTableProps {
  admins: AdminData[];
  loading: boolean;
  handleRoleChange: (id: string, role: string) => void;
  handleDeleteAdmin: (id: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  loading,
  handleRoleChange,
  handleDeleteAdmin,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Admin Info
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                Role
              </th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-sm text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-10 text-center dark:text-white">
                  <Loader2 className="animate-spin inline mr-2" /> Loading...
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-800 dark:text-white whitespace-nowrap uppercase">
                      {admin.firstName} {admin.lastName}
                    </p>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-sm text-gray-500 flex items-center gap-1 whitespace-nowrap">
                        <Mail size={12} className="text-blue-500" /> {admin.email}
                      </p>
                      <p className="text-xs text-blue-600 flex items-center gap-1 font-semibold whitespace-nowrap">
                        <Phone size={12} className="text-green-500" /> {admin.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={admin.role}
                      onChange={(e) =>
                        handleRoleChange(admin._id, e.target.value)
                      }
                      className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded p-1 outline-none bg-transparent"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;