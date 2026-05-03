import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/OtherPage/NotFound";
import Home from "./pages/Dashboard/Home";
import { useAuth } from "./lib/AuthProvider";
import SignIn from "./AuthPage/SignIn";
import ShopPage from "./pages/Shope/ShopPage";
import ShopTrash from "./pages/Shope/ShopTrash";
import AdminManagement from "./pages/AdminManagement/AdminManagement";
import { ProtectedRoute, ROLES } from "./routes/ProtectedRoute";
import DealerPage from "./pages/Dealer/DealerPage";
import ProfitPage from "./pages/Profit/ProfitPage";
import DeliveryCostPage from "./pages/Delivery/DeliveryCostPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              
              <Route 
                path="/shop" 
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <ShopPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dealer-shop-details" 
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <DealerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profit-commission" 
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <ProfitPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/delivery-cost" 
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <DeliveryCostPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/shop-trash" 
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <ShopTrash />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin-management" 
                element={
                  <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <AdminManagement />
                  </ProtectedRoute>
                } 
              />
            </Route>

            <Route path="/signin" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Router>
  );
}