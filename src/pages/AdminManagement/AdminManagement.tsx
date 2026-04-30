import React, { useState, useEffect } from "react";
import { UserPlus, ShieldCheck, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../api/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import AdminModal from "./AdminModal";
import { useAuth } from "../../lib/AuthProvider";

interface AdminData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
}

const AdminManagement: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      const res = await API.get<AdminData[]>("/admin/all");
      const sortedAdmins = res.data.reverse(); 
      setAdmins(sortedAdmins);
    } catch {
      toast.error("Error loading data");
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchAdmins();
  }, [authLoading, user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();
    try {
      await API.post("/admin/create", form);
      toast.success("Admin created!");
      setIsModalOpen(false);
      fetchAdmins();
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch {
      toast.error("Error creating admin");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id: string) => {
    toast.dismiss();
    try {
      await API.patch(`/admin/make-super/${id}`);
      toast.success("Promoted!");
      fetchAdmins();
    } catch {
      toast.error("Promotion failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this admin?")) return;
    toast.dismiss();
    try {
      await API.delete(`/admin/delete/${id}`);
      toast.success("Admin removed");
      fetchAdmins();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (authLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="md:p-8 max-w-7xl mx-auto mt-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-blue-950 dark:text-white">Admin Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-950 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shrink-0"
        >
          <UserPlus size={20} /> Add Admin
        </button>
      </div>

      <div className="rounded-[2rem] border dark:border-gray-700 overflow-hidden bg-white dark:bg-transparent">
        <div className="overflow-x-auto">
          <Table className="text-left min-w-[900px]">
            <TableHeader className="border-b dark:border-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableCell isHeader className="p-6 w-16 text-center">SL</TableCell>
                <TableCell isHeader className="p-6">Admin Name</TableCell>
                <TableCell isHeader className="p-6 text-center">Contact</TableCell>
                <TableCell isHeader className="p-6 text-center">Role</TableCell>
                <TableCell isHeader className="p-6 text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y dark:text-white dark:divide-gray-700 divide-gray-300">
              {admins.map((admin, index) => (
                <TableRow key={admin._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <TableCell className="p-6 text-center font-medium dark:text-gray-400 text-gray-600">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-6 font-bold uppercase whitespace-nowrap">
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell className="p-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <Mail size={14} className="text-blue-500" /> {admin.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1 justify-center whitespace-nowrap">
                      <Phone size={14} className="text-green-500" /> {admin.phone}
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        admin.role === "superadmin"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {admin.role}
                    </span>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center justify-center gap-4">
                      {admin.role !== "superadmin" && (
                        <button
                          onClick={() => handlePromote(admin._id)}
                          className="text-purple-600 hover:scale-110 transition-transform p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full"
                          title="Promote to Superadmin"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-500 hover:scale-110 transition-transform p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        title="Remove Admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        loading={loading}
        form={form}
        setForm={setForm}
      />
    </div>
  );
};

export default AdminManagement;