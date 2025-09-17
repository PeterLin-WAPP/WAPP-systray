import React, { useState } from 'react';
import './styles.css';
// Import the icon using webpack's module system
const appIcon = require('../../assets/icon.png');

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
      <div className="app-container">
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
        <main className="main-content">
          {/* Content will go here */}
        </main>
      </div>
    </>
  );
};