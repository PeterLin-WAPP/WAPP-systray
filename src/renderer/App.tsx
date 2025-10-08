import React, { useState, useEffect } from 'react';
import './styles/index.css';
import { UIProvider, useUIStore } from './store/UIStore';
import { DeviceCard } from './components/DeviceCard';
import { AppCard } from './components/AppCard';
import { UI_TOKENS, UIState } from './constants';

// Import images using webpack's module system
// Icons
const appIcon = require('../../assets/icons/icon.ico');
const expandIcon = require('../../assets/icons/expand.svg');
const profileIcon = require('../../assets/icons/profile.png');
const wappLoader = require('../../assets/icons/WAPPloader.svg');
// Navigation Icons
const navStarActive = require('../../assets/icons/nav-star-active.svg');
const navStarRest = require('../../assets/icons/nav-star-rest.svg');
const navDevicesActive = require('../../assets/icons/nav-devices-active.svg');
const navDevicesRest = require('../../assets/icons/nav-devices-rest.svg');
const navAppActive = require('../../assets/icons/nav-app-active.svg');
const navAppRest = require('../../assets/icons/nav-app-rest.svg');
// Wallpapers
const cpcLoadingBackground = require('../../assets/wallpapers/CPCloadingbackground.png');
const cpcSession = require('../../assets/wallpapers/CPCsession.png');

interface NavItemProps {
  activeIcon: string;
  restIcon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ activeIcon, restIcon, label, isActive, onClick }) => (
  <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
    <img src={isActive ? activeIcon : restIcon} className="icon" alt={label} />
    <span className="label">{label}</span>
  </div>
);

// Main Content Layout for different UI states
interface MainContentLayoutProps {
  uiState: UIState;
  activeNav: string;
}

const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  uiState,
  activeNav,
}) => {
  const deviceCount = uiState === 0 ? 1 : uiState === 1 ? 1 : uiState >= 2 ? Math.min(uiState, 3) : 1;

  if (uiState === 4 && activeNav === 'management') {
    // State 4: Management list view
    return (
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: `${UI_TOKENS.GAP}px` }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Management</h1>
          <div style={{ marginTop: '16px' }}>
            <input 
              type="text" 
              placeholder="Search devices and apps"
              style={{ 
                width: '300px', 
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                marginRight: '12px'
              }}
            />
            <button style={{ padding: '8px 12px', marginRight: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}>Status</button>
            <button style={{ padding: '8px 12px', marginRight: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}>Type</button>
            <button style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}>Location</button>
          </div>
        </div>
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Owner</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Last Active</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Cloud PC</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Device</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>User</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Available</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>Now</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                  <button style={{ padding: '4px 8px', fontSize: '12px', border: 'none', backgroundColor: '#0078d4', color: 'white', borderRadius: '2px' }}>
                    Manage
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: `${UI_TOKENS.GAP}px` }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          {uiState === 0 ? 'Cloud PC' : 'Devices and Apps'}
        </h1>
        {uiState === 3 && (
          <div style={{ marginTop: '16px' }}>
            <input 
              type="text" 
              placeholder="Search devices and apps"
              style={{ 
                width: '300px', 
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                marginRight: '12px'
              }}
            />
            <button style={{ padding: '8px 12px', marginRight: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}>Status</button>
            <button style={{ padding: '8px 12px', marginRight: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}>Type</button>
            <button style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }}>Location</button>
          </div>
        )}
      </div>

      {/* Devices Section */}
      <div>
        <div 
          style={{
            display: 'grid',
            gap: `${UI_TOKENS.GAP}px`,
            gridTemplateColumns: uiState >= 2 ? `repeat(auto-fill, 464px)` : 'auto',
            gridAutoFlow: uiState >= 2 ? 'row' : 'column',
            justifyContent: uiState === 0 ? 'flex-start' : 'flex-start'
          }}
        >
          {Array.from({ length: deviceCount }).map((_, index) => (
            <DeviceCard
              key={index}
              onConnect={() => {
                if (index === 0) {
                  // @ts-ignore (window.electron is injected)
                  window.electron?.openCloudPC();
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Apps Section - only visible for states 1+ */}
      {uiState >= 1 && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Apps</h2>
          <div 
            style={{
              display: 'flex',
              gap: `${UI_TOKENS.GAP}px`,
              flexWrap: 'wrap'
            }}
          >
            {Array.from({ length: Math.min(7, 5 + uiState) }).map((_, index) => (
              <AppCard
                key={index}
                appId={index < 2 ? (index === 0 ? 'app1' : 'app2') : undefined}
                name={index >= 2 ? `App ${index + 1}` : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { uiState, incrementState, decrementState } = useUIStore();
  const [activeNav, setActiveNav] = useState('devices');

  // Set Management as active when reaching state 4
  useEffect(() => {
    if (uiState === 4) {
      setActiveNav('management');
    } else if (uiState > 0 && activeNav === 'management') {
      setActiveNav('devices');
    }
  }, [uiState, activeNav]);

  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [showSession, setShowSession] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastDismissing, setToastDismissing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const isTrayWindow = mode === 'tray';
  const isCloudPCWindow = mode === 'cloudpc';

  // Toast dismiss function with animation
  const dismissToast = () => {
    setToastDismissing(true);
    setTimeout(() => {
      setToastVisible(false);
      setToastDismissing(false);
    }, 300); // Match CSS animation duration
  };

  // Keyboard shortcuts for UI state navigation
  useEffect(() => {
    if (!isTrayWindow && !isCloudPCWindow) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey)) {
          if (event.key === '=' || event.key === '+') {
            event.preventDefault();
            incrementState();
          } else if (event.key === '-') {
            event.preventDefault();
            decrementState();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isTrayWindow, isCloudPCWindow, incrementState, decrementState]);

  useEffect(() => {
    if (isTrayWindow) {
      // Listen for file selection (prototype logging)
      // @ts-ignore (window.electron is injected)
      const removeFileListener = window.electron?.onFilesSelected((filePaths: string[]) => {
        console.log('Files selected for upload:', filePaths);
        // In a real app, you'd handle the file paths here
      });

      return () => {
        if (removeFileListener) {
          removeFileListener();
        }
      };
    }
  }, [isTrayWindow]);

  // Cloud PC loading sequence
  useEffect(() => {
    if (isCloudPCWindow) {
      // After loader appears (600ms) + 2000ms delay = transition at 2600ms total
      const timer = setTimeout(() => {
        setIsLoaderVisible(false);
        // Small delay before showing session to allow loader fade-out
        setTimeout(() => {
          setShowSession(true);
        }, 500);
      }, 2000);

      // Listen for file uploads in Cloud PC window
      // @ts-ignore (window.electron is injected)
      const removeFileListener = window.electron?.onFilesSelected((filePaths: string[]) => {
        if (filePaths.length > 0) {
          const fileName = filePaths[0].split('\\').pop() || filePaths[0].split('/').pop() || 'Unknown file';
          setUploadedFileName(fileName);
          setToastVisible(true);
          setToastDismissing(false);
          
          // Auto-dismiss after 5 seconds
          const autoTimer = setTimeout(() => {
            dismissToast();
          }, 5000);
          
          // Store timer to clear if manually dismissed
          return () => clearTimeout(autoTimer);
        }
      });

      return () => {
        clearTimeout(timer);
        if (removeFileListener) {
          removeFileListener();
        }
      };
    }
  }, [isCloudPCWindow]);

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
                <button 
                  className="add-button"
                  onClick={incrementState}
                  disabled={uiState >= 4}
                  style={{
                    marginLeft: 'auto',
                    marginRight: '16px',
                    padding: '6px 12px',
                    backgroundColor: uiState >= 4 ? '#e0e0e0' : '#0078d4',
                    color: uiState >= 4 ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: uiState >= 4 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',

                  }}
                >
                  Add
                </button>
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
        <div className={`cloud-pc-container ${showSession ? 'session-mode' : ''}`}>
          {isLoaderVisible && (
            <div className="cloud-pc-loader">
              <img src={wappLoader} alt="Loading" className="loader-icon" />
            </div>
          )}
          
          {/* Toast Notification */}
          {toastVisible && (
            <div className={`toast-notification ${toastDismissing ? 'dismissing' : ''}`}>
              <div className="toast-header">
                <div className="toast-title">
                  <img src={appIcon} className="toast-icon" alt="Windows App" />
                  <span>Windows App</span>
                </div>
                <button 
                  className="toast-close"
                  onClick={dismissToast}
                >
                  ×
                </button>
              </div>
              <div className="toast-content">
                <h3>File uploaded</h3>
                <p>Upload complete. {uploadedFileName} is now on \This PC\Windows365 virtual drive\Downloads.</p>
                <button className="toast-button">Go to file location</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Main Window and Tray Window Content
        <div className={`app-container ${isTrayWindow ? 'tray-mode' : ''}`}>
        {!isTrayWindow && uiState > 0 && (
          <nav className="nav-sidebar"
          >
            <NavItem
              activeIcon={navStarActive}
              restIcon={navStarRest}
              label="Favorites"
              isActive={activeNav === 'favorites'}
              onClick={() => setActiveNav('favorites')}
            />
            <NavItem
              activeIcon={navDevicesActive}
              restIcon={navDevicesRest}
              label="Devices"
              isActive={activeNav === 'devices'}
              onClick={() => setActiveNav('devices')}
            />
            <NavItem
              activeIcon={navAppActive}
              restIcon={navAppRest}
              label="Apps"
              isActive={activeNav === 'apps'}
              onClick={() => setActiveNav('apps')}
            />
            {uiState === 4 && (
              <NavItem
                activeIcon={navDevicesActive}
                restIcon={navDevicesRest}
                label="Management"
                isActive={activeNav === 'management'}
                onClick={() => setActiveNav('management')}
              />
            )}
          </nav>
        )}
        <main 
          className={`main-content ${isTrayWindow ? 'tray-mode' : ''}`}
          style={{
            flex: 1,
            padding: !isTrayWindow ? `${UI_TOKENS.PAGE_MARGIN}px` : undefined,
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: `${UI_TOKENS.GAP}px`
          }}
        >
          {isTrayWindow ? (
            <div className="tray-content">
              <section className="resource-section">
                <h2>Devices</h2>
                <div className="device-cards">
                  <DeviceCard
                    onConnect={() => {
                      // @ts-ignore (window.electron is injected)
                      window.electron?.openCloudPC();
                    }}
                  />
                </div>
              </section>
              
              <section className="resource-section">
                <h2>Apps</h2>
                <div className="app-cards" style={{ display: 'flex', gap: '8px' }}>
                  <AppCard appId="app1" />
                  <AppCard appId="app2" />
                </div>
              </section>
            </div>
          ) : (
            <MainContentLayout 
              uiState={uiState}
              activeNav={activeNav}
            />
          )}
        </main>
        </div>
      )}
    </>
  );
};

// Main App component wrapped with UIProvider
export const App: React.FC = () => {
  return (
    <UIProvider>
      <AppContent />
    </UIProvider>
  );
};