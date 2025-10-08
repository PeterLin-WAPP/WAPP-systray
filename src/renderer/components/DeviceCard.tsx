import React from 'react';
import { useUIStore } from '../store/UIStore';
import { DEVICE_CARD_SIZES } from '../constants';

// Import images using webpack's module system
const cpcWallpaper = require('../../../assets/wallpapers/CPCwallpaper.png');
const moreIcon = require('../../../assets/icons/More.svg');

interface DeviceCardProps {
  onConnect?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  onConnect,
}) => {
  const { uiState } = useUIStore();
  const { width, height } = DEVICE_CARD_SIZES[uiState];

  const cardStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
  };

  return (
    <div 
      style={cardStyle}
      className="device-card"
      onClick={onConnect}
    >
      <div className="device-bg" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img 
          src={cpcWallpaper} 
          alt="Device wallpaper" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />
      </div>
      <div className="device-info" style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '18px',
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(24px)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontWeight: '600', 
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            fontSize: '14px'
          }}>My Cloud PC</h3>
          <p style={{ 
            fontSize: '12px', 
            margin: '0', 
            color: '#666', 
            fontWeight: '400',
            fontFamily: "'Segoe UI', system-ui, sans-serif" 
          }}>
            8vCPU | 32GB | 512GB
          </p>
        </div>
        <button 
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease',
            marginLeft: '12px'
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking more button
            // Handle more menu here
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <img 
            src={moreIcon} 
            alt="More options" 
            style={{ 
              width: '20px', 
              height: '20px',
              opacity: 0.7
            }} 
          />
        </button>
      </div>
    </div>
  );
};