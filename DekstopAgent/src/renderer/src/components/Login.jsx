import { useState } from "react";
import { loginProvider } from "../api/authService";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePendingDeletions(providerId) {
    window.electronAPI
      .handlePendingDeletions(providerId)
      .then((res) => {
        if (res.success) {
          console.log("✅ Pending deletions processed.");
        } else {
          console.error("❌ Error in deletions:", res.error);
        }
      })
      .catch((err) => {
        console.error("❌ IPC Error:", err.message);
      });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = await loginProvider(email, password);
      console.log("✅ Login successful:", data);

      await handlePendingDeletions(data.id);

      if (window.electronAPI?.sendProviderId) {
        const tunnelRes = await window.electronAPI.sendProviderId(data.id);
        if (!tunnelRes || !tunnelRes.success) {
          throw new Error(tunnelRes?.error || "Tunnel failed to start");
        }
        console.log("🌐 Tunnel is ready:", tunnelRes.publicUrl);
      } else {
        throw new Error("electronAPI.sendProviderId not available");
      }

      setLoading(false);
      onLogin(data);
    } catch (err) {
      setLoading(false);
      console.error("❌ Login failed:", err.message || err);
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return loading ? (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-200 text-base tracking-wider font-mono">
          Logging in...
        </p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col gap-5 items-center justify-center px-4">
    <h1 className="text-white text-5xl font-orbitron">CypherShare</h1>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-gray-700 space-y-6 animate-fadeInUp"
      >
        <h2 className="text-3xl font-bold text-center text-white font-orbitron">
          Provider Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 rounded-lg shadow-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
