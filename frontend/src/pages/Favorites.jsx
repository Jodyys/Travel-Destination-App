import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const token = localStorage.getItem("token");
    
    // Proteksi: Jika tidak ada token, arahkan langsung ke /login
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // FIX: Menambahkan fungsi untuk menghapus destinasi dari daftar favorit
  const removeFavorite = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update state secara lokal agar item langsung hilang dari UI tanpa reload halaman
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove from favorites");
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
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Button Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all font-medium text-gray-600 flex items-center gap-1"
        >
          <span>←</span> Back
        </button>

        <h1 className="text-4xl font-bold text-gray-800">
          My Favorites
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Save destinations you love and plan your next adventure.
        </p>

        {/* Conditional Rendering Strukturnya Sudah Diperbaiki */}
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4 animate-pulse">❤️</div>
            <h2 className="text-3xl font-bold text-gray-800">
              No Favorites Yet
            </h2>
            <p className="text-gray-500 mt-4">
              Start exploring destinations and save your favorite places here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          /* Grid List Card Favorites */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
              >
                {/* Image Section */}
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"}
                  alt={item.title}
                  className="w-full h-48 object-cover bg-gray-50"
                />

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-1">
                      <span>📍</span> {item.location}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => navigate(`/detail/${item.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 rounded-xl font-semibold text-sm transition-all text-center"
                    >
                      View
                    </button>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 py-2.5 rounded-xl font-semibold text-sm transition-all text-center"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Favorites;