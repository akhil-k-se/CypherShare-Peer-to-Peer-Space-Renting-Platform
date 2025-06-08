import { useState } from 'react';
import { loginProvider } from '../api/authService';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await loginProvider(email, password);
    console.log("Login successful:", data); // ✅ Add this
    onLogin(data); // ✅ Correct key
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message); // more details
    alert("Invalid email or password");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center">Provider Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
