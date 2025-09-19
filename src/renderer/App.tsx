import React, { useState } from 'react';
import './styles.css';
// Import images using webpack's module system
const appIcon = require('../../assets/icon.ico');
const expandIcon = require('../../assets/expand.svg');
const profileIcon = require('../../assets/profile.png');
const cpcWallpaper = require('../../assets/CPCwallpaper.png');
const cpcLoadingBackground = require('../../assets/CPCloadingbackground.png');
const wappLoader = require('../../assets/WAPPloader.svg');
const app1Icon = require('../../assets/app1.png');
const app2Icon = require('../../assets/app2.png');

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
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const isTrayWindow = mode === 'tray';
  const isCloudPCWindow = mode === 'cloudpc';

  return (
    <>
      {/* Render titlebar only for main and tray windows, not Cloud PC */}
      {!isCloudPCWindow && (
        <>
          {!isTrayWindow ? (
            <div className="titlebar">
              <div className="drag-region">
                <div className="window-title">
                  <img src={appIcon} className="window-icon" alt="Windows App" />
                  <span>Windows App</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="tray-titlebar">
              <div className="window-title">
                <img src={appIcon} className="window-icon" alt="Windows App" />
                <span>Windows App</span>
              </div>
              <div className="tray-controls">
                <button 
                  className="tray-control-button"
                  onClick={() => {
                    // @ts-ignore (window.electron is injected)
                    window.electron?.showMainWindow();
                  }}
                >
                  <img src={expandIcon} alt="Expand" width="14" height="14" />
                </button>
                <div className="me-control">
                  <img src={profileIcon} alt="Profile" className="profile-icon" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Main content area */}
      {isCloudPCWindow ? (
        // Cloud PC Window Content
        <div className="cloud-pc-container">
          <div className="cloud-pc-loader">
            <img src={wappLoader} alt="Loading" className="loader-icon" />
          </div>
        </div>
      ) : (
        // Main Window and Tray Window Content
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
              <section className="resource-section">
                <h2>Devices</h2>
                <div className="device-cards">
                  <div 
                    className="device-card"
                    onClick={() => {
                      // @ts-ignore (window.electron is injected)
                      window.electron?.openCloudPC();
                    }}
                  >
                    <div className="device-bg">
                      <img src={cpcWallpaper} alt="Device wallpaper" />
                    </div>
                    <div className="device-info">
                      <h3>Cloud PC</h3>
                      <p>8vCPU | 56GB | 1024GB</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="resource-section">
                <h2>Apps</h2>
                <div className="app-cards">
                  <div className="app-card">
                    <img src={app1Icon} alt="App 1" className="app-icon" />
                  </div>
                  <div className="app-card">
                    <img src={app2Icon} alt="App 2" className="app-icon" />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div>
              {/* Main content area */}
            </div>
          )}
        </main>
        </div>
      )}
    </>
  );
};