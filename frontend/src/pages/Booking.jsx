import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState("");
  const [totalPerson, setTotalPerson] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Proteksi Halaman: Kick user ke halaman login jika belum autentikasi
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi sederhana sebelum menembak API
    if (!bookingDate) {
      setError("Please select a travel date.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/bookings",
        {
          destination_id: id,
          booking_date: bookingDate,
          total_person: parseInt(totalPerson, 10), // Memastikan tipe data integer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-5 py-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md border border-gray-100">
        
        {/* Tombol Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1 transition-colors focus:outline-none"
        >
          <span>←</span> Back
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-1">
          Book Your Trip
        </h2>

        <p className="text-gray-400 mb-6 text-sm">
          Complete your reservation details
        </p>

        {/* Notifikasi Error UI */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Travel Date
            </label>
            <input
              type="date"
              className="border border-gray-200 rounded-xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Number of Travelers
            </label>
            <input
              type="number"
              min="1"
              className="border border-gray-200 rounded-xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
              value={totalPerson}
              onChange={(e) => setTotalPerson(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3.5 rounded-xl font-bold transition-all mt-2 shadow-md ${
              loading
                ? "bg-blue-300 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-100 hover:shadow-lg hover:shadow-blue-200"
            }`}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;