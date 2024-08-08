import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffLogin from "./pages/staff/StaffLogin";
import StaffRegister from "./pages/staff/StaffRegister";
import StaffDashboard from "./pages/staff/StaffDashboard";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/customer/Home";
import { AuthProvider } from "./context/AuthContext";
import RestaurantDetails from "./components/RestaurantDetails";
import UserProfile from "./pages/customer/UserProfile";
import Query from "./pages/customer/Query";
import UserDashboard from "./components/UserDashboard";
import ReservationHistory from "./components/ReservationHistory";
import DashboardLayout from "./components/DashboardLayout";
import ProfileDetails from "./components/ProfileDetails";
import QueryList from "./components/QueryList";
import UserManagement from "./components/Admin/UserManagement";
import AdminQueries from "./components/Admin/AdminQueries";
import AdminDashboardLayout from "./components/Admin/AdminDashboardLayout";
import AdminReservations from "./components/Admin/AdminReservations";

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            {/* <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/admin/"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_STAFF"]}>
                  <AdminDashboardLayout
                    handleDrawerToggle={handleDrawerToggle}
                    mobileOpen={mobileOpen}
                  />
                </ProtectedRoute>
              }
            >
              <Route path="user-management" element={<UserManagement />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="queries" element={<AdminQueries />} />
            </Route>

            {/* Staff Routes */}
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/staff/register" element={<StaffRegister />} />
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={["STAFF"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/reservations" element={<ReservationHistory />} />
            <Route path="/customer/query/:id" element={<Query />} />
            {/* <Route path="/customer/dashboard" element={<UserDashboard />} /> */}
            <Route
              path="/"
              element={
                <DashboardLayout
                  handleDrawerToggle={handleDrawerToggle}
                  mobileOpen={mobileOpen}
                />
              }
            >
              {/* <Route index element={<Dashboard />} /> */}
              <Route
                path="reservation-history"
                element={<ReservationHistory />}
              />
              <Route path="profile-details" element={<ProfileDetails />} />
              <Route path="queries" element={<QueryList />} />
            </Route>

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/customer/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
