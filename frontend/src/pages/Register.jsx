import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler dinamis untuk memperbarui state berdasarkan atribut 'name' pada input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      console.log("SUCCESS:", res.data);
      setSuccess("Registration successful! Redirecting to login...");
      
      // Otomatis pindah ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("ERROR:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create an Account
        </h2>

        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Notifikasi Sukses */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
            loading 
              ? "bg-blue-300 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;