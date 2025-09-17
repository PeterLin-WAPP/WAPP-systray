import React, { useState } from 'react';
import './styles.css';
// Import the icon using webpack's module system
const appIcon = require('../../assets/icon.ico');

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
    <i className="material-icons icon">{icon}</i>
    <span className="label">{label}</span>
  </div>
);

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('devices');
  const isTrayWindow = new URLSearchParams(window.location.search).get('mode') === 'tray';

  return (
    <>
      <div className="titlebar">
        <div className="drag-region">
          <div className="window-title">
            <img src={appIcon} className="window-icon" alt="Windows App" />
            <span>Windows App</span>
          </div>
        </div>
      </div>
      <div className={`app-container ${isTrayWindow ? 'tray-mode' : ''}`}>
        {!isTrayWindow && (
          <nav className="nav-sidebar">
            <NavItem
              icon="star"
              label="Favorites"
              isActive={activeNav === 'favorites'}
              onClick={() => setActiveNav('favorites')}
            />
            <NavItem
              icon="devices"
              label="Devices"
              isActive={activeNav === 'devices'}
              onClick={() => setActiveNav('devices')}
            />
            <NavItem
              icon="apps"
              label="Apps"
              isActive={activeNav === 'apps'}
              onClick={() => setActiveNav('apps')}
            />
          </nav>
        )}
        <main className={`main-content ${isTrayWindow ? 'tray-mode' : ''}`}>
          {isTrayWindow ? (
            <div className="tray-content">
              <h2>Quick Actions</h2>
              <div className="tray-actions">
                <button className="tray-action">
                  <i className="material-icons">phonelink_ring</i>
                  <span>Connect Device</span>
                </button>
                <button className="tray-action">
                  <i className="material-icons">settings</i>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Main content area */}
            </div>
          )}
        </main>
      </div>
    </>
  );
};