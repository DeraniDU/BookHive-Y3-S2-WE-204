import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import Header from "../../components/Header"; 
import Footer from "../../components/Footer";

const ViewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  useEffect(() => {
    fetchRequests();
  }, []);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/request');
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests. Please try again later.');
      setLoading(false);
    }
  };
  
  const deleteRequest = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/request/${id}`);
      setConfirmDelete(null);
      fetchRequests();
    } catch (err) {
      setError('Failed to delete request. Please try again later.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredRequests = requests.filter(req => 
    req.bookOffered.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.bookWanted.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortOrder === 'bookOffered') return a.bookOffered.localeCompare(b.bookOffered);
    if (sortOrder === 'bookWanted') return a.bookWanted.localeCompare(b.bookWanted);
    if (sortOrder === 'condition') return a.condition.localeCompare(b.condition);
    return sortOrder === 'oldest' ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id);
  });

  // Styling constants
  const colors = {
    primary: '#1a73e8',
    primaryHover: '#1557b0',
    background: '#f8f9fa',
    cardBg: '#ffffff',
    border: '#dadce0',
    text: '#202124',
    textSecondary: '#5f6368',
    error: '#d93025',
    success: '#188038',
    warning: '#ea8600',
    lightGray: '#f1f3f4',
    overlay: 'rgba(0, 0, 0, 0.05)',
  };

  const getConditionColor = (condition) => {
    const conditionMap = {
      'New': '#188038',
      'Like New': '#188038',
      'Very Good': '#188038',
      'Good': '#ea8600',
      'Fair': '#ea8600',
      'Poor': '#d93025'
    };
    return conditionMap[condition] || colors.primary;
  };

  // Inline styles
  const styles = {
    container: {
      fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 120px)', // Adjust based on header/footer height
      padding: '24px',
      color: colors.text,
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 0',
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '400',
      marginBottom: '24px',
      color: colors.text,
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    searchBar: {
      flex: '1',
      position: 'relative',
      minWidth: '280px',
    },
    searchInput: {
      width: '100%',
      height: '48px',
      borderRadius: '24px',
      border: `1px solid ${colors.border}`,
      padding: '0 16px 0 48px',
      fontSize: '16px',
      outline: 'none',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '12px',
      color: colors.textSecondary,
    },
    controlGroup: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    select: {
      height: '40px',
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
      padding: '0 12px',
      fontSize: '14px',
      backgroundColor: colors.cardBg,
      cursor: 'pointer',
    },
    button: {
      backgroundColor: colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0 16px',
      height: '40px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    iconButton: {
      width: '40px',
      height: '40px',
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardBg,
      cursor: 'pointer',
    },
    viewToggle: {
      display: 'flex',
      gap: '8px',
    },
    viewOption: (isActive) => ({
      padding: '8px 12px',
      borderRadius: '16px',
      fontSize: '14px',
      cursor: 'pointer',
      backgroundColor: isActive ? colors.lightGray : 'transparent',
      color: isActive ? colors.primary : colors.textSecondary,
      fontWeight: isActive ? '500' : 'normal',
    }),
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, transform 0.1s',
      border: `1px solid ${colors.border}`,
    },
    cardHover: {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    cardHeader: {
      padding: '16px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '500',
      margin: 0,
    },
    badge: (condition) => ({
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: `${getConditionColor(condition)}20`,
      color: getConditionColor(condition),
    }),
    cardBody: {
      padding: '16px',
    },
    cardSection: {
      marginBottom: '12px',
    },
    cardLabel: {
      fontSize: '12px',
      color: colors.textSecondary,
      marginBottom: '4px',
    },
    cardValue: {
      fontSize: '14px',
    },
    cardFooter: {
      padding: '12px 16px',
      borderTop: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    deleteButton: {
      backgroundColor: 'transparent',
      color: colors.textSecondary,
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    deleteButtonHover: {
      backgroundColor: colors.lightGray,
      color: colors.error,
    },
    confirmDeleteContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    confirmMessage: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    confirmButton: {
      backgroundColor: colors.error,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    cancelButton: {
      backgroundColor: colors.lightGray,
      color: colors.textSecondary,
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    error: {
      backgroundColor: `${colors.error}10`,
      border: `1px solid ${colors.error}30`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: colors.error,
    },
    dismissButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '14px',
      textDecoration: 'underline',
      cursor: 'pointer',
      color: colors.error,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 0',
    },
    spinner: {
      width: '36px',
      height: '36px',
      border: `4px solid ${colors.primary}20`,
      borderTop: `4px solid ${colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    emptyState: {
      padding: '60px 20px',
      textAlign: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: '8px',
      border: `1px dashed ${colors.border}`,
    },
    emptyStateText: {
      color: colors.textSecondary,
      fontSize: '16px',
      marginBottom: '16px',
    },
    linkButton: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: 'none',
      fontSize: '14px',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    listItem: {
      backgroundColor: colors.cardBg,
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${colors.border}`,
    },
    listItemInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    listItemTitle: {
      fontSize: '16px',
      fontWeight: '500',
    },
    listItemMeta: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      fontSize: '14px',
      color: colors.textSecondary,
    },
    listItemActions: {
      display: 'flex',
      gap: '8px',
    },
  };

  const renderGridView = () => (
    <div style={styles.gridContainer}>
      {sortedRequests.map((req) => (
        <div key={req._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>{req.bookOffered}</h3>
            <span style={styles.badge(req.condition)}>{req.condition}</span>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.cardSection}>
              <div style={styles.cardLabel}>Offering</div>
              <div style={styles.cardValue}>{req.bookOffered}</div>
            </div>
            <div style={styles.cardSection}>
              <div style={styles.cardLabel}>Looking for</div>
              <div style={styles.cardValue}>{req.bookWanted}</div>
            </div>
            {req.notes && (
              <div style={styles.cardSection}>
                <div style={styles.cardLabel}>Notes</div>
                <div style={styles.cardValue}>{req.notes}</div>
              </div>
            )}
          </div>
          <div style={styles.cardFooter}>
            {confirmDelete === req._id ? (
              <div style={styles.confirmDeleteContainer}>
                <span style={styles.confirmMessage}>Confirm delete?</span>
                <button onClick={() => deleteRequest(req._id)} style={styles.confirmButton}>Yes</button>
                <button onClick={() => setConfirmDelete(null)} style={styles.cancelButton}>No</button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmDelete(req._id)} 
                style={styles.deleteButton}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.lightGray}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div style={styles.listContainer}>
      {sortedRequests.map((req) => (
        <div key={req._id} style={styles.listItem}>
          <div style={styles.listItemInfo}>
            <div style={styles.listItemTitle}>{req.bookOffered}</div>
            <div style={styles.listItemMeta}>
              <span style={styles.badge(req.condition)}>{req.condition}</span>
              <span>Looking for: {req.bookWanted}</span>
              {req.notes && <span>Notes: {req.notes}</span>}
            </div>
          </div>
          <div style={styles.listItemActions}>
            {confirmDelete === req._id ? (
              <div style={styles.confirmDeleteContainer}>
                <span style={styles.confirmMessage}>Confirm delete?</span>
                <button onClick={() => deleteRequest(req._id)} style={styles.confirmButton}>Yes</button>
                <button onClick={() => setConfirmDelete(null)} style={styles.cancelButton}>No</button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmDelete(req._id)} 
                style={styles.deleteButton}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.lightGray}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.pageTitle}>Book Exchange Requests</h1>
          
          {error && (
            <div style={styles.error}>
              <span>{error}</span>
              <button onClick={() => setError(null)} style={styles.dismissButton}>
                Dismiss
              </button>
            </div>
          )}
          
          <div style={styles.headerRow}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.boxShadow = '0 1px 6px rgba(32,33,36,0.28)'}
                onBlur={(e) => e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'}
              />
            </div>

            <div style={styles.controlGroup}>
              <select
                value={sortOrder}
                onChange={handleSort}
                style={styles.select}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="bookOffered">Book Offered (A-Z)</option>
                <option value="bookWanted">Book Wanted (A-Z)</option>
                <option value="condition">Condition</option>
              </select>
              
              <div style={styles.viewToggle}>
                <span 
                  style={styles.viewOption(viewMode === 'grid')}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </span>
                <span 
                  style={styles.viewOption(viewMode === 'list')}
                  onClick={() => setViewMode('list')}
                >
                  List
                </span>
              </div>
              
              <button 
                style={styles.button} 
                onClick={() => window.location.href = '/exchange/home'}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryHover}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
              >
                Create Request
              </button>
            </div>
          </div>
          
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
            </div>
          ) : sortedRequests.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>
                {searchTerm ? "No requests match your search" : "No book exchange requests available"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={styles.linkButton}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </div>
      </div>
      <Footer />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ViewRequest;

