import React, { useState } from 'react';
import { Segment, Image, Button, Container, Dropdown, Icon } from 'semantic-ui-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import swal from 'sweetalert';
import logo from '../assets/BH.png'; // Keeping the same logo path

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the current path matches the link
  const isActive = (path) => location.pathname === path;

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      swal("Logged Out!", "You have been logged out successfully.", "success").then(() => {
        navigate('/signin');
      });
    } catch (error) {
      swal("Error", error.message, "error");
    }
  };

  return (
    <Segment inverted style={{ 
      padding: '15px 25px', 
      margin: 0, 
      borderRadius: 0,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, #1C3D5A 0%, #2C5282 100%)'
    }}>
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '95%' }}>
        
        {/* Logo and BookHive Text - Kept the same */}
        <Link to="/" style={{ 
          fontSize: '26px', 
          fontWeight: 'bold', 
          color: '#A6BCFF', 
          display: 'flex', 
          alignItems: 'center',
          textDecoration: 'none',
          transition: 'transform 0.3s ease'
        }} className="hover-grow">
          <Image src={logo} alt="BookHive Logo" style={{ maxHeight: '30px', marginRight: '12px' }} />
          <span style={{ 
            background: 'linear-gradient(90deg, #A6BCFF, #FFFFFF)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>BookHive</span>
        </Link>

        {/* Navigation Links - Desktop View */}
        <div className="desktop-nav" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flex: 1,
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}>
          {[
            { path: '/book-exchange', label: 'Book Exchange' },
            { path: '/book-lending', label: 'Book Lending' },
            { path: '/view-placebid', label: 'Book Bidding' },
            { path: '/recommender', label: 'Book Suggest' }
          ].map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              style={{ 
                padding: '10px 25px', 
                color: isActive(link.path) ? '#FFFFFF' : '#E0E0E0', 
                textDecoration: 'none',
                fontWeight: isActive(link.path) ? 'bold' : 'normal',
                borderBottom: isActive(link.path) ? '2px solid #A6BCFF' : 'none',
                marginRight: '5px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!isActive(link.path)) e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseOut={(e) => {
                if (!isActive(link.path)) e.currentTarget.style.color = '#E0E0E0';
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button" style={{ 
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block'
          }
        }}>
          <Button icon onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', color: '#FFFFFF' }}>
            <Icon name={mobileMenuOpen ? 'close' : 'bars'} />
          </Button>
        </div>

        {/* User Controls */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Dropdown 
            icon={null}
            trigger={
              <Button circular icon="user" style={{
                marginRight: '15px',
                background: '#A6BCFF',
                color: '#1C3D5A'
              }} />
            }
            pointing="top right"
            direction="left"
          >
            <Dropdown.Menu>
              <Dropdown.Item 
                icon="user" 
                text="Profile" 
                onClick={() => navigate('/profile')} 
              />
              <Dropdown.Item 
                icon="setting" 
                text="Settings" 
                onClick={() => navigate('/settings')} 
              />
              <Dropdown.Divider />
              <Dropdown.Item 
                icon="sign-out" 
                text="Logout" 
                onClick={handleLogout} 
              />
            </Dropdown.Menu>
          </Dropdown>

          <Button 
            style={{
              fontWeight: 'bold', 
              backgroundColor: '#A6BCFF', 
              color: '#1C3D5A',
              borderRadius: '20px',
              padding: '10px 20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#A6BCFF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Container>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          right: 0,
          background: '#1C3D5A',
          zIndex: 1000,
          padding: '10px 0',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          {[
            { path: '/book-exchange', label: 'Book Exchange' },
            { path: '/book-lending', label: 'Book Lending' },
            { path: '/view-placebid', label: 'Book Bidding' },
            { path: '/book-suggest', label: 'Book Suggest' }
          ].map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              style={{ 
                padding: '15px 25px', 
                color: '#FFFFFF', 
                textDecoration: 'none',
                fontWeight: isActive(link.path) ? 'bold' : 'normal',
                borderLeft: isActive(link.path) ? '4px solid #A6BCFF' : 'none',
                display: 'block',
                background: isActive(link.path) ? 'rgba(166, 188, 255, 0.1)' : 'transparent'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Add CSS for proper media queries and hover effects */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
        }
        .hover-grow:hover {
          transform: scale(1.05);
        }
      `}</style>
    </Segment>
  );
};

export default Header;