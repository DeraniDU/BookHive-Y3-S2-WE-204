import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/request');
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      setLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/request/${id}`);
      fetchRequests();
    } catch (err) {
      setError('Failed to delete request');
    }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    card: { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px' },
    header: { fontSize: '18px', fontWeight: 'bold' },
    details: { marginBottom: '10px' },
    button: { background: '#f44336', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' },
    error: { color: 'red' },
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Book Exchange Requests</h2>
      {requests.map((req, index) => (
        <div style={styles.card} key={req._id}>
          <div style={styles.header}>Request #{index + 1}</div>
          <div style={styles.details}><strong>Book Offered:</strong> {req.bookOffered}</div>
          <div style={styles.details}><strong>Book Wanted:</strong> {req.bookWanted}</div>
          <div style={styles.details}><strong>Condition:</strong> {req.condition}</div>
          <div style={styles.details}><strong>Notes:</strong> {req.notes || 'N/A'}</div>
          <button style={styles.button} onClick={() => deleteRequest(req._id)}>Delete Request</button>
        </div>
      ))}
    </div>
  );
};

export default ViewRequest;
