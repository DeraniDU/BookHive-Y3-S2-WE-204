// components/HeroSection.jsx
import React from 'react';
import { Segment, Header, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Segment inverted textAlign="center" style={{ padding: '100px 0', backgroundColor: '#a11919' }}>
      <Header as="h2" style={{ fontSize: '32px', fontWeight: 'bold' }}>
        Welcome to BookHive
      </Header>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>Exchange, lend, or bid for books with ease!</p>
      <Button primary size="large" onClick={() => navigate('#explore')}>Explore Now</Button>
    </Segment>
  );
};

export default HeroSection;
