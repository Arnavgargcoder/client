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
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="glass-card fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="m-0 text-primary">{poll.poll.question}</h3>
          <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={logout}>Logout</button>
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
        <h5>Live Results:</h5>
        {(() => {
          const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
          return poll.options.map((opt) => {
            const percent = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return (
            <div key={opt._id} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-bold">{opt.option_text}</span>
                <span className="text-muted small">{opt.votes} votes ({percent}%)</span>
              </div>
              <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${percent}%`, backgroundColor: 'var(--secondary-color)' }}
                  aria-valuenow={percent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          );
          });
        })()}
      </div>
    </div>
  );
}

export default PollRoom;
