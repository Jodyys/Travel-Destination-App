import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function DestinationCard({ destination }) {
  const navigate = useNavigate();
  
  // Destructuring dengan nilai default (fallback) untuk keamanan data
  const { 
    id, 
    image_url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60", 
    title = "Unknown Destination", 
    location = "International" 
  } = destination || {};

  // Mengizinkan user mengklik seluruh area kartu untuk UX yang lebih mulus
  const handleCardClick = () => {
    navigate(`/detail/${id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer select-none"
    >
      {/* Image Container dengan Efek Zoom */}
      <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
        <img
          src={image_url}
          alt={`Thumbnail of ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // Mencegah looping infinity jika gambar placeholder juga rusak
            e.target.onerror = null; 
            e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60";
          }}
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-gray-50/30">
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h2>
          <p className="text-gray-500 text-sm flex items-center gap-1.5 font-medium">
            <span className="text-blue-500" aria-hidden="true">📍</span> {location}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/detail/${id}`}
            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm shadow-blue-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// Menjamin keamanan tipe data props yang masuk ke dalam komponen
DestinationCard.propTypes = {
  destination: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image_url: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
};

export default DestinationCard;