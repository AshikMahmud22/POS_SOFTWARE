import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/OtherPage/NotFound";
import Home from "./pages/Dashboard/Home";
import { useAuth } from "./lib/AuthProvider";
import SignIn from "./AuthPage/SignIn";

import AdminManagement from "./pages/AdminManagement/AdminManagement";
import { ProtectedRoute, ROLES } from "./routes/ProtectedRoute";
import CompanyPage from "./pages/Company/CompanyPage";
import PartyPage from "./pages/Party/PartyPage";
import CollectionPage from "./pages/Collection/CollectionPage";
import RetailerPage from "./pages/Retailer/RetailerPage";
import RetailerTrash from "./pages/Retailer/RetailerTrash";
import CompanyFormPage from "./pages/Company/CompanyFormPage/CompanyFormPage";
// import DealerPage from "./pages/Dealer/DealerPage";
// import ProfitPage from "./pages/Profit/ProfitPage";
// import DeliveryCostPage from "./pages/Delivery/DeliveryCostPage";
// import DownloadReport from "./pages/DownloadReport/DownloadReport";

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
                path="/retailer"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <RetailerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies-details"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <CompanyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies-details/new"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <CompanyFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies-details/edit/:id"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <CompanyFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/party-list"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <PartyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collection"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <CollectionPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/profit-commission"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <ProfitPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery-cost"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <DeliveryCostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/download-report"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <DownloadReport />
                  </ProtectedRoute>
                }
              /> */}

              <Route
                path="/retailer-trash"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
                  >
                    <RetailerTrash />
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
