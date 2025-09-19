import React, { useState, useEffect } from 'react';
import './styles.css';
// Import images using webpack's module system
const appIcon = require('../../assets/icon.ico');
const expandIcon = require('../../assets/expand.svg');
const profileIcon = require('../../assets/profile.png');
const cpcWallpaper = require('../../assets/CPCwallpaper.png');
const cpcLoadingBackground = require('../../assets/CPCloadingbackground.png');
const cpcSession = require('../../assets/CPCsession.png');
const wappLoader = require('../../assets/WAPPloader.svg');
const app1Icon = require('../../assets/app1.png');
const app2Icon = require('../../assets/app2.png');
const actionButtonUpload = require('../../assets/action-button-upload.png');
const actionButtonCopilot = require('../../assets/action-button-copilot.png');

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
  const [isCloudPCConnected, setIsCloudPCConnected] = useState(false);
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

  useEffect(() => {
    if (isTrayWindow) {
      // Listen for Cloud PC disconnection
      // @ts-ignore (window.electron is injected)
      const removeListener = window.electron?.onCloudPCDisconnected(() => {
        setIsCloudPCConnected(false);
      });

      // Listen for file selection (prototype logging)
      // @ts-ignore (window.electron is injected)
      const removeFileListener = window.electron?.onFilesSelected((filePaths: string[]) => {
        console.log('Files selected for upload:', filePaths);
        // In a real app, you'd handle the file paths here
      });

      return () => {
        if (removeListener) {
          removeListener();
        }
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
                    className={`device-card ${isCloudPCConnected ? 'connected' : ''}`}
                    onClick={() => {
                      setIsCloudPCConnected(true);
                      // @ts-ignore (window.electron is injected)
                      window.electron?.openCloudPC();
                    }}
                  >
                    <div className="device-bg">
                      <img src={cpcWallpaper} alt="Device wallpaper" />
                    </div>
                    <div className="device-info">
                      <h3>Cloud PC</h3>
                      <p>{isCloudPCConnected ? 'Connected' : '8vCPU | 56GB | 1024GB'}</p>
                      {isCloudPCConnected && (
                        <div className="action-buttons">
                          <button className="action-button" onClick={(e) => {
                            e.stopPropagation();
                            // @ts-ignore (window.electron is injected)
                            window.electron?.openFileUpload();
                          }}>
                            <img src={actionButtonUpload} alt="Upload" className="action-icon" />
                            <span className="action-text">Upload files</span>
                          </button>
                          <button className="action-button" onClick={(e) => {
                            e.stopPropagation();
                            // Handle copilot mode action
                          }}>
                            <img src={actionButtonCopilot} alt="Copilot" className="action-icon" />
                            <span className="action-text">Copilot mode</span>
                          </button>
                        </div>
                      )}
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