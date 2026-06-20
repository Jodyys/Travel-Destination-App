import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Mencegah memory leak jika user pindah halaman sebelum API selesai
    setLoading(true);

    api.get(`/destinations/${id}`)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching destination detail:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium">Loading destination...</p>
        </div>
      </div>
    );
  }

  // Defensive check jika data dari API kosong atau tidak sesuai struktur
  if (!data || !data.title) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl font-semibold mb-4">Destination Not Found</p>
        <button 
          onClick={() => navigate("/")}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Object Destructuring agar penulisan kode di bawah jauh lebih bersih
  const { image_url, title, category, location, description } = data;

  // Fallback image jika image_url dari database pecah/kosong
  const defaultImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60";

  return (
    <div className="container mx-auto p-4 md:p-10 max-w-4xl animate-in fade-in duration-300">
      {/* Image Banner */}
      <div className="w-full h-[250px] sm:h-[350px] md:h-[480px] overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img
          src={image_url || defaultImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* Content Info */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-blue-50 text-blue-600 text-xs md:text-sm px-4 py-1.5 rounded-full font-semibold uppercase tracking-wider">
            {category || "General"}
          </span>
          <p className="text-blue-600 font-medium text-sm md:text-base flex items-center gap-1">
            <span aria-hidden="true">📍</span> {location || "Unknown Location"}
          </p>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {title}
        </h1>

        <hr className="border-gray-100" />

        <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
          {description || "No description available for this destination."}
        </p>
      </div>

      {/* Action Section (Tombol Back dan Book Now digabung rata kanan) */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 active:scale-[0.98] text-gray-700 font-semibold text-base rounded-xl transition-all duration-200"
        >
          ← Back
        </button>

        <button
          onClick={() => navigate(`/booking/${id}`)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base px-8 py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 text-center"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default Detail;