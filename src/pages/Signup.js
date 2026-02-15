import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../api';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/signup`, form);
      alert('Signup successful ✅');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="glass-card fade-in">
        <h3 className="text-center mb-4">Create Account</h3>
        <p className="text-center text-muted mb-4">Join to start voting</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <button className="btn btn-success w-100">Signup</button>
        </form>
        <div className="text-center mt-3">
          Already have account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
