import React, { useState, useEffect } from 'react';
import './styles.css';
// Import images using webpack's module system
const appIcon = require('../../assets/icon.ico');
const expandIcon = require('../../assets/expand.svg');
const profileIcon = require('../../assets/profile.png');
const cpcWallpaper = require('../../assets/CPCwallpaper.png');
const cpcLoadingBackground = require('../../assets/CPCloadingbackground.png');
const cpcLoadingBranded = require('../../assets/CPCloadingBranded.png');
const cpcSession = require('../../assets/CPCsession.png');
const wappLoader = require('../../assets/WAPPloader.svg');
const wappLoaderBranded = require('../../assets/WAPPloaderBranded.png');
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
  const [loadingStage, setLoadingStage] = useState(0); // 0: initial, 1: wappLoader rendered, 1.5: wappLoader visible, 2: wappLoader moved, 3: branded loader rendered, 3.5: branded loader visible, 4: loaders fade out, 5: session
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
      // Stage 1: After 800ms, render WAPPloader
      const stage1Timer = setTimeout(() => {
        setLoadingStage(1);
        // Small delay to allow CSS transition to work
        setTimeout(() => setLoadingStage(1.5), 50);
      }, 800);

      // Stage 2: After another 800ms, move WAPPloader (400ms duration)
      const stage2Timer = setTimeout(() => {
        setLoadingStage(2);
      }, 1600); // 800 + 800

      // Stage 3: After WAPPloader finishes moving, render branded loader
      const stage3Timer = setTimeout(() => {
        setLoadingStage(3);
        // Small delay to allow CSS transition to work
        setTimeout(() => setLoadingStage(3.5), 50);
      }, 2000); // stage2 + 400ms movement

      // Stage 4: After another 1000ms, fade out both loaders (300ms duration)
      const stage4Timer = setTimeout(() => {
        setLoadingStage(4);
      }, 3300); // stage3 + 300ms branded fade-in + 1000ms delay

      // Stage 5: After fade-out completes, show session wallpaper
      const stage5Timer = setTimeout(() => {
        setLoadingStage(5);
        setShowSession(true);
      }, 3600); // stage4 + 300ms fade-out

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
        clearTimeout(stage1Timer);
        clearTimeout(stage2Timer);
        clearTimeout(stage3Timer);
        clearTimeout(stage4Timer);
        clearTimeout(stage5Timer);
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
          {loadingStage >= 1 && loadingStage < 5 && (
            <div className={`cloud-pc-loader ${loadingStage >= 2 ? 'moved-left' : ''}`}>
              <img 
                src={wappLoader} 
                alt="Loading" 
                className={`loader-icon ${loadingStage >= 1.5 ? 'visible' : ''} ${loadingStage >= 4 ? 'fade-out' : ''}`} 
              />
            </div>
          )}
          
          {loadingStage >= 3 && loadingStage < 5 && (
            <div className={`cloud-pc-loader-branded ${loadingStage >= 3.5 ? 'visible' : ''} ${loadingStage >= 4 ? 'fade-out' : ''}`}>
              <img src={wappLoaderBranded} alt="Loading Branded" className="loader-branded-icon" />
            </div>
          )}
          
          {/* CPCtaskbar */}
          <div className="cloud-pc-taskbar"></div>
          
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
                <div className="section-header">
                  <img src={wappLoaderBranded} alt="Company Icon" className="company-icon" />
                  <h2>Contoso</h2>
                </div>
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
                      <h3>Reserve Cloud PC</h3>
                      <p>{isCloudPCConnected ? 'Connected' : 'Last connected today'}</p>
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