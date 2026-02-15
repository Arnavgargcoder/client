import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';

function PollRoom() {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else {
      fetchPoll();
      const interval = setInterval(fetchPoll, 3000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  const fetchPoll = async () => {
    try {
      const res = await axios.get(`${API_URL}/poll`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      setPoll(res.data);
    } catch {
      console.log('Error fetching poll');
    }
  };

  const submitVote = async () => {
    if (!selected) return alert('Please select an option');
    try {
      await axios.post(
        `${API_URL}/vote`,
        { optionId: selected },
        { headers: { authorization: localStorage.getItem('token') } }
      );
      alert('Vote submitted ✅');
      fetchPoll();
    } catch (err) {
      alert(err.response?.data?.error || 'Already voted');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!poll) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <div className="d-flex justify-content-between">
          <h3>{poll.poll.question}</h3>
          <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
        </div>
        <hr />
        {!poll.alreadyVoted && (
          <>
            {poll.options.map((opt) => (
              <div key={opt._id} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input"
                  name="pollOption"
                  onChange={() => setSelected(opt._id)}
                />
                <label className="form-check-label">{opt.option_text}</label>
              </div>
            ))}
            <button className="btn btn-primary mt-3" onClick={submitVote}>Submit Vote</button>
            <hr />
          </>
        )}
        <h5>Results:</h5>
        {poll.options.map((opt) => (
          <div key={opt._id}>{opt.option_text} — {opt.votes} votes</div>
        ))}
      </div>
    </div>
  );
}

export default PollRoom;
