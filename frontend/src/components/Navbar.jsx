import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token format:", err);
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="font-bold text-xl tracking-wide">
          TravelHub
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>

          {token ? (
            <>
              {/* Menu Tambahan Utama */}
              <Link to="/my-bookings" className="hover:text-blue-200 transition-colors">
                My Bookings
              </Link>

              <Link to="/favorites" className="hover:text-blue-200 transition-colors">
                Favorites
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="font-semibold flex items-center gap-1 focus:outline-none hover:text-blue-200 transition-colors"
                >
                  👤 {user?.name || "Account"}
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-xl shadow-lg w-48 py-1 z-50">
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      My Bookings
                    </Link>

                    <Link
                      to="/favorites"
                      className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Favorites
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-medium transition-colors border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;