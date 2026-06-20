import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

// Helper fungsi untuk konversi format mata uang Rupiah
const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui status booking (Confirm / Cancel)
  const updateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      
      // Mengikuti format URL dari kode Anda: /bookings/:id/:status
      await api.put(
        `/bookings/${id}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Booking ${status}ed successfully`);
      loadBookings(); // Refresh data setelah berhasil di-update
    } catch (err) {
      console.error("Update status failed:", err);
      toast.error("Update failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Button Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all font-medium text-gray-600 flex items-center gap-1"
        >
          <span>←</span> Back
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          My Bookings
        </h1>

        <p className="text-gray-500 mb-8">
          Manage all your travel reservations
        </p>

        {/* Conditional Rendering Bookings */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-4 animate-bounce duration-1000">✈️</div>
            <h2 className="text-2xl font-bold text-gray-800">
              No Bookings Yet
            </h2>
            <p className="text-gray-500 mt-2">
              Start exploring amazing destinations and plan your next adventure!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-100"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-sm p-5 hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col sm:flex-row gap-5 w-full">
                    
                    {/* Thumbnail Image */}
                    <img
                      src={booking.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300"}
                      alt={booking.title}
                      className="w-full sm:w-40 h-44 sm:h-28 rounded-xl object-cover bg-gray-100 shadow-sm"
                    />

                    {/* Booking Info Content */}
                    <div className="space-y-1 py-1">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {booking.title}
                      </h2>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <span>📍</span> {booking.location}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <span>📅</span> {new Date(booking.booking_date).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <span>👤</span> {booking.total_person} Person
                      </p>
                      
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <span className="font-mono font-semibold bg-gray-100 text-blue-600 px-2.5 py-1 rounded-md text-xs">
                          {booking.booking_code}
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {rupiah(booking.total_price || 0)}
                        </span>
                      </div>

                      {/* Aksi Tombol Hanya Muncul Jika Status Masih Pending */}
                      {booking.status === "pending" && (
                        <div className="flex gap-2 pt-3">
                          <button
                            onClick={() => updateBookingStatus(booking.id, "confirm")}
                            className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold px-4 py-2 text-sm rounded-xl transition-all shadow-sm shadow-green-100"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "cancel")}
                            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold px-4 py-2 text-sm rounded-xl transition-all shadow-sm shadow-red-100"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-4 py-1.5 rounded-full font-semibold text-xs sm:text-sm capitalize tracking-wide self-end sm:self-start ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;