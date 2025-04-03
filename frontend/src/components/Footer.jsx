import React, { useState } from 'react';
import { Segment, Container, Grid, Icon, Form, Button, Header, Divider, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import logo from '../assets/BH.png'; // Make sure this path matches your logo location

const Footer = () => {
  const [email, setEmail] = useState('');
  
  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic for subscribing to the newsletter
    alert(`Thank you for subscribing, ${email}!`);
    setEmail('');
  };

  return (
    <Segment inverted style={{ 
      padding: '5em 0 3em', 
      background: 'linear-gradient(180deg, #1C3D5A 0%, #0B1929 100%)',
      marginTop: 'auto', 
      width: '100%', 
      marginLeft: '0', 
      marginRight: '0',
      borderTop: '4px solid #A6BCFF'
    }}>
      <Container>
        {/* Logo and tagline at the top */}
        <div style={{ textAlign: 'center', marginBottom: '2.5em' }}>
          <Image src={logo} alt="BookHive Logo" style={{ height: '40px', marginBottom: '1em' }} centered />
          <Header as="h3" style={{ 
            color: '#FFFFFF',
            fontWeight: 'light',
            fontSize: '18px',
            letterSpacing: '1px',
            margin: '0.5em 0'
          }}>
            Connect, Share, and Discover Books Together
          </Header>
          <Divider inverted style={{ width: '50%', margin: '1.5em auto', opacity: '0.3' }} />
        </div>

        <Grid stackable inverted divided>
          {/* About Us Section */}
          <Grid.Column width={4}>
            <Header as="h4" style={{ 
              color: '#A6BCFF', 
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '1.2em'
            }}>
              About BookHive
            </Header>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#E0E0E0' }}>
              <b>BookHive</b> is your go-to platform for book exchange, lending, and bidding. Our mission is to bring book lovers together and create a vibrant community of readers.
            </p>
            <div style={{ marginTop: '1.5em' }}>
              <Link to="/about" style={{ color: '#A6BCFF', marginRight: '1.5em', fontSize: '15px' }}>About Us</Link>
              <Link to="/blog" style={{ color: '#A6BCFF', marginRight: '1.5em', fontSize: '15px' }}>Blog</Link>
              <Link to="/faq" style={{ color: '#A6BCFF', fontSize: '15px' }}>FAQ</Link>
            </div>
          </Grid.Column>

          {/* Quick Links Section */}
          <Grid.Column width={4}>
            <Header as="h4" style={{ 
              color: '#A6BCFF', 
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '1.2em'
            }}>
              Quick Links
            </Header>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/book-exchange" style={{ color: '#E0E0E0', margin: '0.5em 0', fontSize: '15px' }}>
                <Icon name="exchange" style={{ marginRight: '0.5em' }} />Book Exchange
              </Link>
              <Link to="/book-lending" style={{ color: '#E0E0E0', margin: '0.5em 0', fontSize: '15px' }}>
                <Icon name="handshake" style={{ marginRight: '0.5em' }} />Book Lending
              </Link>
              <Link to="/view-placebid" style={{ color: '#E0E0E0', margin: '0.5em 0', fontSize: '15px' }}>
                <Icon name="gavel" style={{ marginRight: '0.5em' }} />Book Bidding
              </Link>
              <Link to="/book-suggest" style={{ color: '#E0E0E0', margin: '0.5em 0', fontSize: '15px' }}>
                <Icon name="lightbulb" style={{ marginRight: '0.5em' }} />Book Suggestions
              </Link>
              <Link to="/community" style={{ color: '#E0E0E0', margin: '0.5em 0', fontSize: '15px' }}>
                <Icon name="users" style={{ marginRight: '0.5em' }} />Community
              </Link>
            </div>
          </Grid.Column>

          {/* Newsletter Subscription */}
          <Grid.Column width={4}>
            <Header as="h4" style={{ 
              color: '#A6BCFF', 
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '1.2em'
            }}>
              Stay Updated
            </Header>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#E0E0E0' }}>
              Subscribe to our newsletter for the latest book trends and community events!
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                style={{ 
                  marginBottom: '1em', 
                  maxWidth: '100%', 
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid #A6BCFF',
                  color: '#FFFFFF'
                }}
                icon="mail"
                iconPosition="left"
              />
              <Button 
                type="submit" 
                style={{
                  backgroundColor: '#A6BCFF', 
                  color: '#1C3D5A', 
                  fontWeight: 'bold', 
                  borderRadius: '4px', 
                  padding: '10px 20px', 
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#A6BCFF';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Subscribe
              </Button>
            </Form>
          </Grid.Column>

          {/* Contact Information */}
          <Grid.Column width={4}>
            <Header as="h4" style={{ 
              color: '#A6BCFF', 
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '1.2em'
            }}>
              Contact Us
            </Header>
            <div style={{ marginBottom: '1em' }}>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#E0E0E0' }}>
                <Icon name="phone" style={{ marginRight: '0.5em' }} /> +123 456 7890
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#E0E0E0' }}>
                <Icon name="mail" style={{ marginRight: '0.5em' }} /> support@bookhive.com
              </p>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#E0E0E0' }}>
                <Icon name="map marker alternate" style={{ marginRight: '0.5em' }} /> 123 Book St, Library City
              </p>
            </div>
            
            <Header as="h5" style={{ 
              color: '#A6BCFF', 
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '1.5em',
              marginBottom: '1em'
            }}>
              Follow Us
            </Header>
            <div style={{ display: 'flex' }}>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" 
                style={{ 
                  marginRight: '1em',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#A6BCFF';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Icon name="facebook f" style={{ color: '#FFFFFF', margin: 0 }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                style={{ 
                  marginRight: '1em',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#A6BCFF';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Icon name="twitter" style={{ color: '#FFFFFF', margin: 0 }} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                style={{ 
                  marginRight: '1em',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#A6BCFF';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Icon name="instagram" style={{ color: '#FFFFFF', margin: 0 }} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#A6BCFF';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Icon name="linkedin" style={{ color: '#FFFFFF', margin: 0 }} />
              </a>
            </div>
          </Grid.Column>
        </Grid>

        <Divider inverted style={{ margin: '2em 0 1.5em', opacity: '0.3' }} />

        {/* Bottom Section - Copyright & Terms */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <p style={{ color: '#A6BCFF', fontSize: '14px' }}>
            © 2025 BookHive. All Rights Reserved.
          </p>
          <div>
            <Link to="/terms" style={{ color: '#A6BCFF', marginRight: '1.5em', fontSize: '14px' }}>
              Terms of Service
            </Link>
            <Link to="/privacy" style={{ color: '#A6BCFF', marginRight: '1.5em', fontSize: '14px' }}>
              Privacy Policy
            </Link>
            <Link to="/cookies" style={{ color: '#A6BCFF', fontSize: '14px' }}>
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </Segment>
  );
};

export default Footer;