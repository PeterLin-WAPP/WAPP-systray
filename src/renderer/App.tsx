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
const addIcon = require('../../assets/icons/Add.svg');
const moreIcon = require('../../assets/icons/More.svg');
const notificationsIcon = require('../../assets/icons/notifications.svg');
const settingsIcon = require('../../assets/icons/settings.svg');
const chevronHelpIcon = require('../../assets/icons/Chevron-help.svg');
const quicktourIcon = require('../../assets/icons/quicktour.svg');
const helpIcon = require('../../assets/icons/help.svg');
// Navigation Icons
const navStarActive = require('../../assets/icons/nav-star-active.svg');
const navStarRest = require('../../assets/icons/nav-star-rest.svg');
const navDevicesActive = require('../../assets/icons/nav-devices-active.svg');
const navDevicesRest = require('../../assets/icons/nav-devices-rest.svg');
const navAppActive = require('../../assets/icons/nav-app-active.svg');
const navAppRest = require('../../assets/icons/nav-app-rest.svg');
const navManagementActive = require('../../assets/icons/nav-management-active.svg');
const navManagementRest = require('../../assets/icons/nav-management-rest.svg');
const chevronIcon = require('../../assets/icons/Chevron.svg');
const searchIcon = require('../../assets/icons/search.svg');
const listViewIcon = require('../../assets/icons/✅ Admin/listview.svg');
const gridViewIcon = require('../../assets/icons/✅ Admin/gridview.svg');
// Wallpapers
const cpcLoadingBackground = require('../../assets/wallpapers/CPCloadingbackground.png');
const cpcSession = require('../../assets/wallpapers/CPCsession.png');
// Illustrations
const favoritesEmptyState = require('../../assets/illustrations/favorites-empty-state.png');

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

// Collapsible Row Component for State 2+
interface CollapsibleRowProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ title, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{ marginBottom: '24px' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          padding: '8px 0',
          cursor: 'pointer',
          fontFamily: '"Segoe UI"',
          fontSize: '16.017px',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: '22.882px',
          color: '#333',
          marginBottom: '6px',
          outline: 'none'
        }}
        onFocus={(e) => e.target.style.outline = '2px solid #0078d4'}
        onBlur={(e) => e.target.style.outline = 'none'}
        role="button"
        aria-expanded={isExpanded}
      >
        <img 
          src={chevronIcon}
          alt="Chevron"
          style={{
            transform: isExpanded ? 'rotate(270deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease-in-out',
            width: '16px',
            height: '16px'
          }}
        />
        {title}
      </button>
      <div
        style={{
          maxHeight: isExpanded ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.2s ease-in-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Search Bar Component (for header)
const SearchBar: React.FC = () => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <input 
      type="text" 
      placeholder=""
      style={{ 
        width: '200px', 
        padding: '8px 12px 8px 40px', 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        fontSize: '14px'
      }}
    />
    <img 
      src={searchIcon}
      alt="Search"
      style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '16px',
        height: '16px',
        opacity: 0.6
      }}
    />
  </div>
);

// Filter Pills Component (above content)
const FilterPills: React.FC = () => (
  <div style={{ 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingTop: '24px'
  }}>
    {/* Left side - Filter pills */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button style={{ 
        padding: '6px 12px', 
        border: 'none', 
        borderRadius: '16px', 
        backgroundColor: '#333',
        color: 'white',
        fontSize: '14px',
        cursor: 'pointer'
      }}>
        All
      </button>
      <button style={{ 
        padding: '6px 12px', 
        border: '1px solid #ccc', 
        borderRadius: '16px', 
        backgroundColor: 'white',
        color: '#333',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        Type
        <img 
          src={chevronIcon}
          alt="Chevron"
          style={{
            width: '12px',
            height: '12px',
            transform: 'rotate(180deg)'
          }}
        />
      </button>
    </div>

    {/* Right side - Sorting and view options */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button style={{ 
        padding: '6px 12px', 
        border: 'none', 
        borderRadius: '4px', 
        backgroundColor: 'transparent',
        color: '#333',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        A-Z
        <img 
          src={chevronIcon}
          alt="Chevron"
          style={{
            width: '12px',
            height: '12px',
            transform: 'rotate(270deg)'
          }}
        />
      </button>
      
      <div style={{ 
        width: '1px', 
        height: '20px', 
        backgroundColor: '#ccc',
        margin: '0 4px'
      }} />
      
      <button style={{ 
        padding: '8px',
        border: 'none', 
        borderRadius: '4px', 
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={listViewIcon}
          alt="List view"
          style={{
            width: '20px',
            height: '20px'
          }}
        />
      </button>
      
      <button style={{ 
        padding: '8px',
        border: 'none', 
        borderRadius: '4px', 
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={gridViewIcon}
          alt="Grid view"
          style={{
            width: '20px',
            height: '20px'
          }}
        />
      </button>
    </div>
  </div>
);

// Main Content Layout for different UI states
interface MainContentLayoutProps {
  uiState: UIState;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  uiState,
  activeNav,
  setActiveNav,
}) => {
  const deviceCount = uiState === 0 ? 1 : uiState === 1 ? 2 : uiState >= 2 ? Math.min(uiState, 3) : 1;

  // State 4: Management page
  if (uiState === 4 && activeNav === 'management') {
    return (
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: `${UI_TOKENS.GAP}px` }}>
        <div>
          <h1 style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '600' }}>Management</h1>
          <p style={{ margin: '8px 0 24px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
            Manage who can access apps and services included in your Microsoft 365 subscriptions. Add or remove users, manage licenses, and reset passwords.
          </p>

          {/* Search bar */}
          <div style={{ marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Search your users list"
              style={{ 
                width: '300px', 
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  Name <span style={{ fontSize: '12px', color: '#666' }}>↕</span>
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                  Username for sign-in
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                  Licenses
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'A.J. Smith', initials: 'AS', username: 'anthons@windows365-demo.microsoft.com', license: 'Enterprise Mobility + Security E5 , Cloud PC - Internal', color: '#8764b8' },
                { name: 'Aaron', initials: 'A', username: 'aaron@windows365-demo.microsoft.com', license: 'Unlicensed', color: '#6bb6ff' },
                { name: 'Aaron', initials: 'A', username: 'aawong@windows365-demo.microsoft.com', license: 'Unlicensed', color: '#6bb6ff' },
                { name: 'Abena Edugyan', initials: 'AE', username: 'abenaedugyan@windows365-demo.microsoft.com', license: 'Unlicensed', color: '#0078d4' },
                { name: 'Abraham Pineda', initials: 'AP', username: 'abpineda@windows365-demo.microsoft.com', license: 'Enterprise Mobility + Security E5 , Windows 365 Enterprise 2 vCPU, 8 GB, 128 GB', color: '#8764b8' },
                { name: 'AD join account', initials: 'AA', username: 'ADJOIN@windows365-demo.microsoft.com', license: 'Unlicensed', color: '#8764b8' },
                { name: 'Adele Vance', initials: 'AV', username: 'officetest@windows365-demo.microsoft.com', license: 'Unlicensed', color: '#8764b8' },
                { name: 'Akash Chawla', initials: 'AC', username: 'akashchawla@windows365-demo.microsoft.com', license: 'Enterprise Mobility + Security E5', color: '#8764b8' }
              ].map((user, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: user.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.initials}
                    </div>
                    <span style={{ fontSize: '14px' }}>{user.name}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                    {user.username}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                    {user.license}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '2px',
                      fontSize: '16px',
                      color: '#666'
                    }}>
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // State 2+ Favorites page - empty state
  if (uiState === 2 && activeNav === 'favorites') {
    return (
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: `${UI_TOKENS.GAP}px` }}>
        <div>
          <h1 style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '600' }}>Favorites</h1>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          paddingTop: '48px',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '300px',
          color: '#666',
          fontSize: '16px',
          gap: '8px'
        }}>
          <img 
            src={favoritesEmptyState} 
            alt="Empty favorites illustration"
            style={{ 
              width: '200px',
              height: 'auto'
            }}
          />
          <span>Add your resources to favorites to see them here</span>
        </div>
      </div>
    );
  }

  // State 3+ Favorites page - populated
  if (uiState >= 3 && activeNav === 'favorites') {
    return (
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: `${UI_TOKENS.GAP}px` }}>
        <div>
          <h1 style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '600' }}>Favorites</h1>
        </div>
        <div>
          {/* Devices Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Devices</h2>
              <button 
                onClick={() => setActiveNav('devices')}
                style={{ 
                  background: 'none',
                  border: '1px solid #ccc',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666'
                }}
              >
                see devices
              </button>
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 300px)',
              gap: `${UI_TOKENS.GAP}px`
            }}>
              {Array.from({ length: 3 }).map((_, index) => {
                const deviceVariations = [
                  { name: "My Cloud PC", specs: "8vCPU | 32GB | 512GB" },
                  { name: "Project PC", specs: "4vCPU | 16GB | 256GB" },
                  { name: "Testing Environment", specs: "2vCPU | 8GB | 128GB" }
                ];
                return (
                  <DeviceCard 
                    key={index} 
                    name={deviceVariations[index]?.name}
                    specs={deviceVariations[index]?.specs}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Apps Section */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Apps</h2>
              <button 
                onClick={() => setActiveNav('apps')}
                style={{ 
                  background: 'none',
                  border: '1px solid #ccc',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666'
                }}
              >
                see apps
              </button>
            </div>
            <div style={{ 
              display: 'flex',
              gap: `${UI_TOKENS.GAP}px`,
              flexWrap: 'wrap'
            }}>
              {Array.from({ length: uiState >= 3 ? 5 : Math.min(7, 5 + uiState) }).map((_, index) => {
                const appIds = ['word', 'teams', 'outlook', 'edge', 'powerpoint'];
                return (
                  <AppCard
                    key={index}
                    appId={index < appIds.length ? appIds[index] : undefined}
                    name={index >= appIds.length ? `App ${index + 1}` : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 3+ Apps page
  if (uiState >= 3 && activeNav === 'apps') {
    return (
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: `${UI_TOKENS.GAP}px` }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '0',
            marginTop: '12px'
          }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Apps</h1>
            <SearchBar />
          </div>
          <FilterPills />
        </div>
        <div>
          <CollapsibleRow title="Contoso North" defaultExpanded={true}>
            <div style={{ 
              display: 'flex',
              gap: `${UI_TOKENS.GAP}px`,
              flexWrap: 'wrap',
              marginBottom: '16px'
            }}>
              <AppCard appId="word" />
              <AppCard appId="teams" />
              <AppCard appId="outlook" />
            </div>
          </CollapsibleRow>
          
          <CollapsibleRow title="Contoso South" defaultExpanded={true}>
            <div style={{ 
              display: 'flex',
              gap: `${UI_TOKENS.GAP}px`,
              flexWrap: 'wrap'
            }}>
              <AppCard appId="edge" />
              <AppCard appId="powerpoint" />
              <AppCard appId="viva" />
              <AppCard appId="vivaconnections" />
            </div>
          </CollapsibleRow>
        </div>
      </div>
    );
  }

  // Default Devices page for states 0-2+
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateRows: 'auto 1fr', 
      gap: `${UI_TOKENS.GAP}px`,
      transition: 'all 0.2s ease-in-out'
    }}>
      {/* Header */}
      <div style={{ transition: 'all 0.2s ease-in-out' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: uiState >= 2 ? '0' : '0',
          marginTop: '12px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              {uiState === 0 ? 'Your Cloud PC' : 'Devices'}
            </h1>
            {uiState === 0 && (
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666', fontWeight: '400' }}>
                Contoso Finance
              </p>
            )}
          </div>
          {uiState >= 2 && <SearchBar />}
        </div>
        {uiState >= 2 && <FilterPills />}
      </div>

      {/* Content */}
      <div>
        {uiState >= 2 ? (
          // State 2+: Collapsible rows layout
          <>
            <CollapsibleRow title="Contoso North" defaultExpanded={true}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 300px)',
                gap: `${UI_TOKENS.GAP}px`,
                transition: 'all 0.2s ease-in-out'
              }}>
                {Array.from({ length: 3 }).map((_, index) => {
                  const deviceVariations = [
                    { name: "My Cloud PC", specs: "8vCPU | 32GB | 512GB" },
                    { name: "Project PC", specs: "16vCPU | 64GB | 1TB" },
                    { name: "Testing Environment", specs: "12vCPU | 48GB | 512GB" }
                  ];
                  return (
                    <DeviceCard
                      key={index}
                      name={deviceVariations[index]?.name}
                      specs={deviceVariations[index]?.specs}
                      onConnect={() => {
                        if (index === 0) {
                          // @ts-ignore (window.electron is injected)
                          window.electron?.openCloudPC();
                        }
                      }}
                    />
                  );
                })}
              </div>
            </CollapsibleRow>
            
            <CollapsibleRow title="Contoso South" defaultExpanded={true}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 300px)',
                gap: `${UI_TOKENS.GAP}px`,
                transition: 'all 0.2s ease-in-out'
              }}>
                {Array.from({ length: Math.max(1, deviceCount - 2) }).map((_, index) => {
                  const deviceVariations = [
                    { name: "Finance PC", specs: "4vCPU | 16GB | 256GB" },
                    { name: "HR Workstation", specs: "6vCPU | 24GB | 512GB" },
                    { name: "Marketing PC", specs: "8vCPU | 32GB | 256GB" }
                  ];
                  return (
                    <DeviceCard
                      key={index + 2}
                      name={deviceVariations[index]?.name}
                      specs={deviceVariations[index]?.specs}
                      onConnect={() => {
                        // @ts-ignore (window.electron is injected)
                        window.electron?.openCloudPC();
                      }}
                    />
                  );
                })}
              </div>
            </CollapsibleRow>
          </>
        ) : (
          // State 0-1: Simple grid layout
          <div 
            style={{
              display: 'grid',
              gap: `${UI_TOKENS.GAP}px`,
              gridTemplateColumns: uiState === 0 ? 'auto' : uiState === 1 ? 'repeat(2, 464px)' : 'repeat(auto-fill, 300px)',
              gridAutoFlow: 'row',
              justifyContent: 'flex-start',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {Array.from({ length: deviceCount }).map((_, index) => {
              const deviceVariations = [
                { name: "My Cloud PC", specs: "8vCPU | 32GB | 512GB" },
                { name: "Project PC", specs: "6vCPU | 24GB | 256GB" }
              ];
              return (
                <DeviceCard
                  key={index}
                  name={deviceVariations[index]?.name}
                  specs={deviceVariations[index]?.specs}
                  onConnect={() => {
                    if (index === 0) {
                      // @ts-ignore (window.electron is injected)
                      window.electron?.openCloudPC();
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Dropdown Menu Component
interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onHelpSubmenuOpen: () => void;
  onHelpSubmenuClose: () => void;
  isHelpSubmenuOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, onHelpSubmenuOpen, onHelpSubmenuClose, isHelpSubmenuOpen }) => {
  const [submenuTimeout, setSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleHelpMouseEnter = () => {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      setSubmenuTimeout(null);
    }
    onHelpSubmenuOpen();
  };

  const handleHelpMouseLeave = () => {
    const timeout = setTimeout(() => {
      onHelpSubmenuClose();
    }, 300);
    setSubmenuTimeout(timeout);
  };

  if (!isOpen) return null;

  return (
    <div className="dropdown-overlay" onClick={onClose}>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-item" onClick={onClose}>
          <img src={notificationsIcon} alt="Notifications" className="dropdown-icon" />
          <span>Notifications</span>
        </div>
        <div className="dropdown-item" onClick={onClose}>
          <img src={settingsIcon} alt="Settings" className="dropdown-icon" />
          <span>Settings</span>
        </div>
        <div 
          className="dropdown-item has-submenu"
          onMouseEnter={handleHelpMouseEnter}
          onMouseLeave={handleHelpMouseLeave}
        >
          <img src={helpIcon} alt="Help" className="dropdown-icon" />
          <span>Help</span>
          <img src={chevronHelpIcon} alt="Chevron" className="dropdown-chevron" />
        </div>
        
        {/* Help Submenu */}
        {isHelpSubmenuOpen && (
          <div 
            className="dropdown-submenu"
            onMouseEnter={handleHelpMouseEnter}
            onMouseLeave={handleHelpMouseLeave}
          >
            <div className="dropdown-item submenu-item" onClick={onClose}>
              <span>Health</span>
            </div>
            <div className="dropdown-item submenu-item" onClick={onClose}>
              <span>Quick tour</span>
            </div>
            <div className="dropdown-item submenu-item" onClick={onClose}>
              <span>Feedback</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { uiState, incrementState, decrementState } = useUIStore();
  const [activeNav, setActiveNav] = useState('devices');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isHelpSubmenuOpen, setIsHelpSubmenuOpen] = useState(false);

  // Set appropriate nav based on state
  useEffect(() => {
    if (uiState === 4) {
      setActiveNav('management');
    } else if (uiState === 3) {
      setActiveNav('favorites');
    } else if (uiState >= 1) {
      setActiveNav('devices');
    }
  }, [uiState]);

  // Close dropdown menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreMenuOpen(false);
        setIsHelpSubmenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMoreMenuOpen]);

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
                <div className="titlebar-controls">
                  {/* Minus Button - invisible at state 0 */}
                  <button 
                    className={`titlebar-button ${uiState === 0 ? 'hidden' : ''}`}
                    onClick={decrementState}
                    disabled={uiState === 0}
                    title={uiState === 0 ? "" : "Remove content"}
                  >
                    <span className="minus-icon">−</span>
                  </button>
                  
                  {/* Add Button */}
                  <button 
                    className="titlebar-button"
                    onClick={incrementState}
                    disabled={uiState >= 4}
                    title={uiState >= 4 ? "Maximum state reached" : "Add resources"}
                  >
                    <img src={addIcon} alt="Add" style={{ width: '16px', height: '16px' }} />
                  </button>
                  
                  {/* Divider */}
                  <div className="titlebar-divider" />
                  
                  {/* More Button */}
                  <button 
                    className="titlebar-button"
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    title="More options"
                  >
                    <img src={moreIcon} alt="More" style={{ width: '16px', height: '16px' }} />
                  </button>
                  
                  {/* Me Control */}
                  <div className="titlebar-me-control">
                    <img 
                      src={profileIcon} 
                      alt="Profile" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  </div>
                  
                  {/* Window Controls */}
                  <div className="window-controls">
                    <button 
                      className="window-control-button minimize"
                      onClick={() => {
                        // @ts-ignore
                        window.electron?.minimizeWindow?.();
                      }}
                    >
                      &#8212;
                    </button>
                    <button 
                      className="window-control-button maximize"
                      onClick={() => {
                        // @ts-ignore
                        window.electron?.maximizeWindow?.();
                      }}
                    >
                      &#9633;
                    </button>
                    <button 
                      className="window-control-button close"
                      onClick={() => {
                        // @ts-ignore
                        window.electron?.closeWindow?.();
                      }}
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <DropdownMenu 
                isOpen={isMoreMenuOpen}
                onClose={() => {
                  setIsMoreMenuOpen(false);
                  setIsHelpSubmenuOpen(false);
                }}
                onHelpSubmenuOpen={() => setIsHelpSubmenuOpen(true)}
                onHelpSubmenuClose={() => setIsHelpSubmenuOpen(false)}
                isHelpSubmenuOpen={isHelpSubmenuOpen}
              />
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
        <div className={`app-container ${isTrayWindow ? 'tray-mode' : ''}`} style={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden'
        }}>
        {!isTrayWindow && (
          <nav className={`nav-sidebar ${uiState <= 1 ? 'hidden' : 'visible'}`} style={{
            flexShrink: 0,
            width: `${UI_TOKENS.NAV_WIDTH}px`,
            height: '100vh',
            overflow: 'hidden'
          }}
          >
            {uiState >= 2 && (
              <NavItem
                activeIcon={navStarActive}
                restIcon={navStarRest}
                label="Favorites"
                isActive={activeNav === 'favorites'}
                onClick={() => setActiveNav('favorites')}
              />
            )}
            <NavItem
              activeIcon={navDevicesActive}
              restIcon={navDevicesRest}
              label="Devices"
              isActive={activeNav === 'devices'}
              onClick={() => setActiveNav('devices')}
            />
            {uiState >= 3 && (
              <NavItem
                activeIcon={navAppActive}
                restIcon={navAppRest}
                label="Apps"
                isActive={activeNav === 'apps'}
                onClick={() => setActiveNav('apps')}
              />
            )}
            {uiState === 4 && (
              <NavItem
                activeIcon={navManagementActive}
                restIcon={navManagementRest}
                label="Admin"
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
            gap: `${UI_TOKENS.GAP}px`,
            overflow: 'auto',
            maxHeight: '100vh'
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
                  <AppCard appId="word" />
                  <AppCard appId="teams" />
                </div>
              </section>
            </div>
          ) : (
            <MainContentLayout 
              uiState={uiState}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
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