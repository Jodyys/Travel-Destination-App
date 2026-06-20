import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages Imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Favorites from "./pages/Favorites";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import { Toaster } from "react-hot-toast";

// Components Imports
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter><Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detail/:id" element={<Detail />} />

        {/* Booking Routes */}
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Private / Protected Routes */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;