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
    transition: 'all 0.2s ease',
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
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Cloud PC</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
          8vCPU | 56GB | 1024GB
        </p>
      </div>
    </div>
  );
};