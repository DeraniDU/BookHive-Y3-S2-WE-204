import React, { useState } from 'react';
import { Segment, Container, Grid, Icon, Form, Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic for subscribing to the newsletter (e.g., API call or email validation)
    alert(`Thank you for subscribing, ${email}!`);
    setEmail('');
  };

  return (
    <Segment inverted style={{ padding: '6em 0', backgroundColor: '#000000', marginTop: 'auto', width: '100%', marginLeft: '0', marginRight: '0' }}>
      <Container>
        <Grid stackable inverted divided>
          {/* Left Section - About Us */}
          <Grid.Column width={5} style={{ paddingRight: '6em' }}>
            <Header as="h4" style={{ color: '#A6BCFF', marginBottom: '1em', fontWeight: 'bold' }}>About Us</Header>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <b>BookHive</b> is your go-to platform for book exchange, lending, and bidding. Join our community to share, borrow, and suggest books to others. Our mission is to bring book lovers together and provide an engaging, collaborative space to discover new reads.
            </p>
          </Grid.Column>

          {/* Center Section - Newsletter Subscription */}
          <Grid.Column width={6} style={{ textAlign: 'center', paddingLeft: '2em' }}>
            <Header as="h4" style={{ color: '#A6BCFF', marginBottom: '1em', fontWeight: 'bold' }}>Stay Updated</Header>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>Subscribe to our newsletter for the latest book trends, community events, and exclusive deals!</p>
            <Form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'center' }}>
              <Form.Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                style={{ marginBottom: '1em', maxWidth: '600px', borderRadius: '25px', padding: '12px' }}
              />
              <Button 
                type="submit" 
                style={{
                  backgroundColor: '#A6BCFF', 
                  color: '#1C3D5A', 
                  fontWeight: 'bold', 
                  borderRadius: '25px', 
                  padding: '12px 25px', 
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                // Hover effect to change background color to white
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFFFFF'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#A6BCFF'}
              >
                Subscribe
              </Button>
            </Form>
          </Grid.Column>

          {/* Right Section - Social Media Links & Contact Us */}
          <Grid.Column width={5} style={{ textAlign: 'right' }}>
            <Header as="h4" style={{ color: '#A6BCFF', marginBottom: '1em', fontWeight: 'bold' }}>Follow Us</Header>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: '15px' }}>
              <Icon name="facebook" size="large" style={{ color: '#A6BCFF' }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: '15px' }}>
              <Icon name="twitter" size="large" style={{ color: '#A6BCFF' }} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" size="large" style={{ color: '#A6BCFF' }} />
            </a>

            <Header as="h4" style={{ color: '#A6BCFF', marginTop: '2em', marginBottom: '1em', fontWeight: 'bold' }}>Contact Us</Header>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <Icon name="phone" /> +123 456 7890
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <Icon name="mail" /> support@bookhive.com
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <Icon name="map marker alternate" /> 123 Book St, Library City
            </p>
          </Grid.Column>
        </Grid>

        {/* Bottom Section - Copyright */}
        <div style={{ textAlign: 'center', marginTop: '3em' }}>
          <p style={{ color: '#A6BCFF', fontSize: '14px' }}>© 2025 BookHive. All Rights Reserved.</p>
        </div>
      </Container>
    </Segment>
  );
};

export default Footer;
