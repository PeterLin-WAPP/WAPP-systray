import React from 'react';
import { useUIStore } from '../store/UIStore';
import { DEVICE_CARD_SIZES } from '../constants';

// Import images using webpack's module system
const cpcWallpaper = require('../../../assets/wallpapers/CPCwallpaper.png');

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
        borderBottomRightRadius: '8px'
      }}>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          fontWeight: '600', 
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          fontSize: '14px'
        }}>Cloud PC</h3>
        <p style={{ 
          fontSize: '12px', 
          margin: '0', 
          color: '#666', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', system-ui, sans-serif" 
        }}>
          8vCPU | 56GB | 1024GB
        </p>
      </div>
    </div>
  );
};