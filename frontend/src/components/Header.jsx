import React from 'react';
import { Segment, Image, Button, Container } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import swal from 'sweetalert'; 
import logo from '../assets/BH.png';

<<<<<<< HEAD


=======
>>>>>>> 0f906d588a1b3e85b3a4ed2b28e896148a8ff8f5
const Header = () => {
  const navigate = useNavigate();


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
          <Link to="/exchangebook" style={{ padding: '10px 30px', color: '#fff', textDecoration: 'none' }}>Book Exchange</Link>
          <Link to="/book-lending" style={{ padding: '10px 30px', color: '#fff', textDecoration: 'none' }}>Book Lending</Link>
          <Link to="/view-placebid" style={{ padding: '10px 30px', color: '#fff', textDecoration: 'none' }}>Book Bidding</Link> {/* Update to your desired path */}
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
