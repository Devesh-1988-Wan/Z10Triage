import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Loading application...</h2>
    </div>
  );
};

export default Spinner;