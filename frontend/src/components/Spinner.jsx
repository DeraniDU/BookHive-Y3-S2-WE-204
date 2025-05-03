import React from 'react';

const Spinner = () => {
  const spinnerStyle = {
    width: '64px',
    height: '64px',
    margin: '32px',
    borderRadius: '50%',
    backgroundColor: '#0ea5e9', // Tailwind's bg-sky-600
    animation: 'ping 1s infinite'
  };

  return <div style={spinnerStyle}></div>;
};

export default Spinner;
