import React from 'react';

const MainCard: React.FC<any> = ({ children }) => {
  const cardStyle = {
    height: '500px',
    // width: '500px',
    flex:1,
    border: '1px solid #ccc',
    borderRadius: '4px',
    // padding: '10px',
    // margin: '10px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={cardStyle} className="main-card">
      {children}
    </div>
  );
}

export default MainCard;