import React from 'react';
import { APP_CARD_SIZE } from '../constants';

const app1Icon = require('../../../assets/icons/app1.png');
const app2Icon = require('../../../assets/icons/app2.png');

interface AppCardProps {
  appId?: 'app1' | 'app2' | string;
  icon?: string;
  name?: string;
  onClick?: () => void;
}

const DEFAULT_APPS = {
  app1: { icon: app1Icon, name: 'App 1' },
  app2: { icon: app2Icon, name: 'App 2' },
};

export const AppCard: React.FC<AppCardProps> = ({
  appId,
  icon,
  name,
  onClick,
}) => {
  const { width, height } = APP_CARD_SIZE;
  
  // Use default app data if appId matches, otherwise use provided icon/name
  const appData = appId && DEFAULT_APPS[appId as keyof typeof DEFAULT_APPS] 
    ? DEFAULT_APPS[appId as keyof typeof DEFAULT_APPS]
    : { icon, name };

  const cardStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div 
      style={cardStyle}
      className="app-card"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f0f0f0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f9f9f9';
      }}
    >
      {appData.icon && (
        <img 
          src={appData.icon} 
          alt={appData.name || 'App'} 
          className="app-icon"
          style={{ 
            width: '48px', 
            height: '48px', 
            marginBottom: '8px',
            objectFit: 'contain'
          }} 
        />
      )}
      {appData.name && (
        <span style={{ 
          fontSize: '12px', 
          textAlign: 'center',
          color: '#333',
          fontWeight: '500'
        }}>
          {appData.name}
        </span>
      )}
    </div>
  );
};