import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'https://server-57ii.onrender.com/';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // If already logged in → go to poll
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/poll');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/login`, form);

      localStorage.setItem('token', res.data.token);

      alert('Login successful ✅');
      navigate('/poll');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3 className="text-center">Login</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <div className="text-center mt-3">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
