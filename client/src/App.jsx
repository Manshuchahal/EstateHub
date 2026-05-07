import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar          from "./components/Navbar";
import ProtectedRoute  from "./components/ProtectedRoute";
import Home            from "./pages/Home";
import About           from "./pages/About";
import Contact         from "./pages/Contact";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import VerifyOTP       from "./pages/VerifyOTP";
import ForgotPassword  from "./pages/ForgotPassword";
import PropertyDetails from "./pages/PropertyDetails";
import AdminDashboard  from "./pages/AdminDashboard";

const HIDE_NAV = ["/admin"];

function Layout() {
  const { pathname } = useLocation();
  const hideNav = HIDE_NAV.some((p) => pathname.startsWith(p));

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" />
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/verify-otp"     element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/property/:id"   element={<PropertyDetails />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
