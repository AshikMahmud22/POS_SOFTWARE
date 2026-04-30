import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { LuLock, LuMail, LuEye, LuEyeOff } from "react-icons/lu";
import API from "../api/axiosInstance";
import { AxiosError } from "axios";

interface LoginResponse {
  token: string;
  user: {
    firstName: string;
    email: string;
    role: string;
  };
}

interface ErrorResponse {
  message: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post<LoginResponse>("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back!");
      window.location.href = "/";
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setForgotLoading(true);
    try {
      await API.post<ErrorResponse>("/admin/forgot-password", { email });
      toast.success("Reset link sent to your email!");
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel Login</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Enter credentials to access dashboard</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LuMail size={20} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="text-sm text-blue-600 hover:underline disabled:opacity-50"
              >
                {forgotLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LuLock size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;