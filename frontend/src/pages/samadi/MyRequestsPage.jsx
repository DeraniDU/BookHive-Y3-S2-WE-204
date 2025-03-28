import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([
    { id: 1, bookOffered: 'The Catcher in the Rye', bookWanted: 'To Kill a Mockingbird', status: 'Requested', requestedDate: '2025-03-01', scheduledExchangeDate: null },
    { id: 2, bookOffered: '1984', bookWanted: 'Brave New World', status: 'Accepted', requestedDate: '2025-02-28', scheduledExchangeDate: '2025-03-05' },
    { id: 3, bookOffered: 'Clean Code', bookWanted: 'The Pragmatic Programmer', status: 'Completed', requestedDate: '2025-02-20', scheduledExchangeDate: '2025-02-25' },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const viewRequestDetails = (request) => setSelectedRequest(request);
  const closeModal = () => setSelectedRequest(null);

  const handleCancelRequest = (id) => {
    const updatedRequests = requests.map((req) => req.id === id ? { ...req, status: 'Cancelled' } : req);
    setRequests(updatedRequests);
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: 'Cancelled' });
    }

    // Show popup message
    setPopupMessage('Request canceled successfully!');
    setTimeout(() => setPopupMessage(''), 3000); // Hide after 3 seconds
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Accepted': return '#48BB78';
      case 'Completed': return '#1D4ED8';
      case 'Cancelled': return '#E53E3E';
      default: return '#A0AEC0';
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '12px', fontFamily: "'Roboto', sans-serif", position: 'relative' }}>
        <h2 style={{ fontSize: '36px', textAlign: 'center', color: '#1D4ED8', fontWeight: '800', marginBottom: '30px' }}>My Exchange Requests</h2>
        
        {popupMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            transition: 'opacity 0.3s ease-in-out',
          }}>
            {popupMessage}
          </div>
        )}

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '20px', color: '#777', marginBottom: '20px' }}>You haven't made any exchange requests yet.</p>
            <button style={{ padding: '12px 30px', backgroundColor: '#1D4ED8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
              Create a Request
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {requests.map((request) => (
              <div key={request.id} style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#333', margin: 0 }}>{request.bookOffered}</h3>
                  <p style={{ fontSize: '18px', color: '#555', margin: '4px 0 12px 0' }}>Wants: {request.bookWanted}</p>
                  <p style={{ fontSize: '14px', color: '#777', margin: 0 }}><strong>Requested:</strong> {formatDate(request.requestedDate)}</p>
                  <p style={{ fontSize: '14px', color: '#777', margin: 0 }}><strong>Exchange:</strong> {formatDate(request.scheduledExchangeDate)}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <span style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '16px', fontWeight: '600', color: 'white', minWidth: '120px', textAlign: 'center', backgroundColor: getStatusBadgeColor(request.status) }}>{request.status}</span>
                  <button style={{ padding: '8px 20px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }} onClick={() => viewRequestDetails(request)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedRequest && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1D4ED8', marginBottom: '20px' }}>Request Details</h3>
              <p><strong>Book Offered:</strong> {selectedRequest.bookOffered}</p>
              <p><strong>Book Wanted:</strong> {selectedRequest.bookWanted}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Requested on:</strong> {formatDate(selectedRequest.requestedDate)}</p>
              <p><strong>Exchange Date:</strong> {formatDate(selectedRequest.scheduledExchangeDate)}</p>
              <div>
                {selectedRequest.status !== 'Completed' && selectedRequest.status !== 'Cancelled' && (
                  <button style={{ padding: '10px 20px', backgroundColor: '#E53E3E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleCancelRequest(selectedRequest.id)}>Cancel Request</button>
                )}
                <button style={{ padding: '10px 20px', backgroundColor: '#1D4ED8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }} onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyRequestsPage;
