import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import DestinationCard from "../components/DestinationCard";

function Home() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.get("/destinations")
      .then((res) => {
        setDestinations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching destinations:", err);
      });
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-500 text-white text-center py-20">
        <h1 className="text-5xl font-bold">Explore Indonesia</h1>
        <p className="mt-4 text-xl">Discover beautiful destinations</p>
      </section>

      {/* Grid Destinations */}
      <div className="container mx-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((item) => (
          <DestinationCard key={item.id} destination={item} />
        ))}
      </div>
    </>
  );
}

export default Home;