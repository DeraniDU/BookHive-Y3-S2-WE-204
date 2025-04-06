import React, { useState, useRef, useEffect } from 'react';
import { Segment, Image, Button, Container, Dropdown } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import swal from 'sweetalert';

import logo from '../assets/BH.png';

const Header = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Ensure sign-out completes
      swal("Logged Out!", "You have been logged out successfully.", "success").then(() => {
        navigate('/signin'); // Navigate after SweetAlert is confirmed
      });
    } catch (error) {
      swal("Error", error.message, "error");
    }
  };

  // Navigate functions
  const navigateToAvailableBooks = () => {
    navigate('/exchange/home');
    setDropdownVisible(false);
  };

  const navigateToManageRequests = () => {
    navigate('/exchange/mybooks');
    setDropdownVisible(false);
  };

  const navigateToAddBook = () => {
    navigate('/exchange/add');
    setDropdownVisible(false);
  };

  return (
    <Segment inverted style={{ padding: '20px 25px' }}>
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
        
        {/* Logo and BookHive Text */}
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#A6BCFF', display: 'flex', alignItems: 'center' }}>
          <Image src={logo} alt="BookHive Logo" style={{ maxHeight: '30px', marginRight: '10px' }} />
          BookHive
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          {/* Custom Book Exchange Dropdown */}
          <div 
            ref={dropdownRef}
            style={{ 
              position: 'relative', 
              padding: '10px 30px',
              cursor: 'pointer'
            }}
          >
            <div 
              onClick={() => setDropdownVisible(!dropdownVisible)}
              style={{ 
                color: '#fff', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span>Book Exchange</span>
              <i className={`caret ${dropdownVisible ? 'up' : 'down'} icon`} style={{ marginLeft: '5px' }}></i>
            </div>
            
            {dropdownVisible && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
                width: '240px',
                marginTop: '5px'
              }}>
                <div 
                  onClick={navigateToAvailableBooks}
                  style={{ 
                    padding: '12px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    color: '#333',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    hover: { backgroundColor: '#f5f5f5' }
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="search icon" style={{ marginRight: '10px', color: '#1C3D5A' }}></i>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Available Books</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Browse books for exchange</div>
                  </div>
                </div>
                <div 
                  onClick={navigateToManageRequests}
                  style={{ 
                    padding: '12px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="sync icon" style={{ marginRight: '10px', color: '#1C3D5A' }}></i>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>My Books</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>View and manage your exchanges</div>
                  </div>
                </div>
                <div 
                  onClick={navigateToAddBook}
                  style={{ 
                    padding: '12px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="plus icon" style={{ marginRight: '10px', color: '#1C3D5A' }}></i>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Add Your Book</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Share a book for exchange</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link to="/book-lending" style={{ padding: '10px 30px', color: '#fff', textDecoration: 'none' }}>Book Lending</Link>
          <Link to="/view-placebid" style={{ padding: '10px 30px', color: '#fff', textDecoration: 'none' }}>Book Bidding</Link>
          <Link to="/book-suggest" style={{ padding: '10px 30px', color: '#fff', textDecoration: 'none' }}>Book Suggest</Link>
        </div>
        
        {/* Logout Button */}
        <Button
          style={{
            fontWeight: 'bold', 
            backgroundColor: '#A6BCFF', 
            color: '#1C3D5A',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#FFFFFF'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#A6BCFF'}
          onClick={handleLogout} // Attach the logout function here
        >
          Logout
        </Button>
      </Container>
    </Segment>
  );
};

export default Header;