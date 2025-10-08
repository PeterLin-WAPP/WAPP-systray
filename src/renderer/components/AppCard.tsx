import React from 'react';
import { APP_CARD_SIZE } from '../constants';

const app1Icon = require('../../../assets/icons/app1.png');
const app2Icon = require('../../../assets/icons/app2.png');

// Import app icons from the app icons folder
const edgeIcon = require('../../../assets/icons/app icons/Edge.png');
const outlookIcon = require('../../../assets/icons/app icons/Outlook.png');
const powerPointIcon = require('../../../assets/icons/app icons/PowerPoint 2019.png');
const teamsIcon = require('../../../assets/icons/app icons/Teams.png');
const vivaConnectionsIcon = require('../../../assets/icons/app icons/Viva Connections.png');
const vivaIcon = require('../../../assets/icons/app icons/Viva.png');
const wordIcon = require('../../../assets/icons/app icons/Word.png');
const moreIcon = require('../../../assets/icons/More.svg');

interface AppCardProps {
  appId?: 'app1' | 'app2' | string;
  icon?: string;
  name?: string;
  onClick?: () => void;
}

const DEFAULT_APPS = {
  app1: { icon: app1Icon, name: 'App 1' },
  app2: { icon: app2Icon, name: 'App 2' },
  edge: { icon: edgeIcon, name: 'Edge' },
  outlook: { icon: outlookIcon, name: 'Outlook' },
  powerpoint: { icon: powerPointIcon, name: 'PowerPoint' },
  teams: { icon: teamsIcon, name: 'Teams' },
  vivaconnections: { icon: vivaConnectionsIcon, name: 'Viva Connections' },
  viva: { icon: vivaIcon, name: 'Viva' },
  word: { icon: wordIcon, name: 'Word' },
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
      className="app-card"
      onClick={onClick}
    >
      {/* Background with extremely blurred app icon */}
      <div className="app-bg" style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        {appData.icon && (
          <img 
            src={appData.icon} 
            alt="Background" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'blur(20px)',
              opacity: 0.3,
              transform: 'scale(1.2)' // Slightly scale to avoid blur edge artifacts
            }} 
          />
        )}
      </div>

      {/* App icon in centered container */}
      {appData.icon && (
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          paddingTop: '6px',
          transform: 'translate(-50%, -60%)', // Slightly higher than center to account for bottom info bar
          width: '46px',
          height: '40px',
          borderRadius: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1
        }}>
          <img 
            src={appData.icon} 
            alt={appData.name || 'App'} 
            className="app-icon"
            style={{ 
              width: '32px', 
              height: '32px',
              objectFit: 'contain'
            }} 
          />
        </div>
      )}

      {/* App info container (similar to device-info) */}
      {appData.name && (
        <div className="app-info" style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(24px)',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: 0, 
              fontWeight: '500', 
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              fontSize: '11px',
              color: '#333',
              textAlign: 'left'
            }}>{appData.name}</h3>
          </div>
          
          {/* More button (moved inside app-info container) */}
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
              marginLeft: '8px'
            }}
            className="app-more-button"
            onClick={(e) => {
              e.stopPropagation();
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
                width: '16px', 
                height: '16px',
                opacity: 0.7
              }} 
            />
          </button>
        </div>
      )}
    </div>
  );
};