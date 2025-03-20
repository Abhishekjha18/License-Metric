import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  let dimensions = {
    width: 40,
    height: 40,
    fontSize: 20
  };
  
  switch (size) {
    case 'small':
      dimensions = { width: 30, height: 30, fontSize: 16 };
      break;
    case 'large':
      dimensions = { width: 60, height: 60, fontSize: 30 };
      break;
    default:
      break;
  }
  
  return (
    <div className="logo-container d-flex align-items-center justify-content-center mb-2">
      <div 
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: '#4e73df',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: dimensions.fontSize
        }}
      >
        LM
      </div>
    </div>
  );
};

export default Logo;