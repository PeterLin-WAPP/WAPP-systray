import { app, BrowserWindow, Tray, screen, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let trayWindow: BrowserWindow | null = null;
let cloudPCWindow: BrowserWindow | null = null;
let trayWindowPosition: { x: number, y: number } | null = null;

function createMainWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: iconPath,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f4f4f4',
      symbolColor: '#000000',
      height: 32
    },
    backgroundColor: '#f4f4f4',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (process.platform === 'win32') {
    mainWindow.setIcon(iconPath);
    app.setAppUserModelId(app.getName());
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4001');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTrayWindow() {
  const display = screen.getPrimaryDisplay();

  trayWindow = new BrowserWindow({
    width: 320,
    height: 320,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    show: false,
    // transparent: true,
    // backgroundColor: '#00000000',
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (process.env.NODE_ENV === 'development') {
    trayWindow.loadURL('http://localhost:4001?mode=tray');
  } else {
    trayWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { mode: 'tray' }
    });
  }

  trayWindow.on('blur', () => {
    trayWindow?.hide();
  });
}

function positionTrayWindow() {
  if (!trayWindow || !tray) return;

  // Only calculate position if we don't have one stored yet
  if (!trayWindowPosition) {
    const display = screen.getPrimaryDisplay();
    const trayBounds = tray.getBounds();
    const windowBounds = trayWindow.getBounds();
    
    // Calculate position based on tray center (not cursor position)
    let x = trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2);
    let y = trayBounds.y - windowBounds.height - 10; // 10px gap above tray

    // Ensure window stays within screen bounds
    const screenBounds = display.workArea;
    
    // Adjust X position if window would go off screen
    if (x < screenBounds.x) {
      x = screenBounds.x + 10;
    } else if (x + windowBounds.width > screenBounds.x + screenBounds.width) {
      x = screenBounds.x + screenBounds.width - windowBounds.width - 10;
    }
    
    // Adjust Y position if window would go off screen (show below tray instead)
    if (y < screenBounds.y) {
      y = trayBounds.y + trayBounds.height + 10;
    }

    // Store the calculated position
    trayWindowPosition = { x: Math.round(x), y: Math.round(y) };
  }

  // Always use the stored position
  trayWindow.setPosition(trayWindowPosition.x, trayWindowPosition.y);
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/icon.ico');
  tray = new Tray(iconPath);
  tray.setToolTip('Windows App');

  // Function to update context menu based on Cloud PC state
  const updateContextMenu = () => {
    const isCloudPCRunning = cloudPCWindow && !cloudPCWindow.isDestroyed();
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Connect to the last session',
        click: () => {
          if (cloudPCWindow && !cloudPCWindow.isDestroyed()) {
            cloudPCWindow.show();
            cloudPCWindow.focus();
          } else {
            createCloudPCWindow();
            if (cloudPCWindow) {
              cloudPCWindow.show();
              cloudPCWindow.focus();
            }
          }
          // Update menu after action
          setTimeout(updateContextMenu, 100);
        }
      },
      {
        label: 'Disconnect all sessions',
        enabled: !!isCloudPCRunning,
        click: () => {
          if (cloudPCWindow && !cloudPCWindow.isDestroyed()) {
            cloudPCWindow.close();
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        click: () => {
          app.quit();
        }
      }
    ]);

    if (tray) {
      tray.setContextMenu(contextMenu);
    }
  };

  // Initial context menu setup
  updateContextMenu();

  tray.on('click', () => {
    if (trayWindow?.isVisible()) {
      trayWindow.hide();
      // Keep stored position - don't reset it
    } else {
      // Position window (only calculates on first time)
      positionTrayWindow();
      trayWindow?.show();
    }
  });

  // Store reference to update function for use in Cloud PC window creation
  (global as any).updateTrayContextMenu = updateContextMenu;
}

function createCloudPCWindow(): void {
  const iconPath = path.join(__dirname, '../assets/CPCicon.png');
  cloudPCWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: iconPath,
    title: 'Cloud PC',
    autoHideMenuBar: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#f4f4f4',
    //   symbolColor: '#000000',
    //   height: 32
    // },
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (process.platform === 'win32') {
    cloudPCWindow.setIcon(iconPath);
  }

  // For now, load a blank page or the main content
  if (process.env.NODE_ENV === 'development') {
    cloudPCWindow.loadURL('http://localhost:4001?mode=cloudpc');
  } else {
    cloudPCWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { mode: 'cloudpc' }
    });
  }

  cloudPCWindow.on('closed', () => {
    cloudPCWindow = null;
    // Notify tray window that Cloud PC is disconnected
    if (trayWindow && !trayWindow.isDestroyed()) {
      trayWindow.webContents.send('cloud-pc-disconnected');
    }
    // Update tray context menu to reflect disconnection
    if ((global as any).updateTrayContextMenu) {
      (global as any).updateTrayContextMenu();
    }
  });

  // Update tray context menu to reflect connection
  if ((global as any).updateTrayContextMenu) {
    setTimeout(() => (global as any).updateTrayContextMenu(), 100);
  }
}

app.whenReady().then(() => {
  createMainWindow();
  createTray();
  createTrayWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Handle showing the main window from tray
ipcMain.on('show-main-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createMainWindow();
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  }
});

// Handle opening Cloud PC window
ipcMain.on('open-cloud-pc', () => {
  if (cloudPCWindow && !cloudPCWindow.isDestroyed()) {
    cloudPCWindow.show();
    cloudPCWindow.focus();
  } else {
    createCloudPCWindow();
    if (cloudPCWindow) {
      cloudPCWindow.show();
      cloudPCWindow.focus();
    }
  }
});

// Handle file upload dialog
ipcMain.on('open-file-upload', async (event) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp'] },
        { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] }
      ]
    });

    if (!result.canceled) {
      console.log('Files selected:', result.filePaths);
      // Send to both tray window (for logging) and Cloud PC window (for toast)
      event.reply('files-selected', result.filePaths);
      
      // Also send to Cloud PC window if it exists
      if (cloudPCWindow && !cloudPCWindow.isDestroyed()) {
        cloudPCWindow.webContents.send('files-selected', result.filePaths);
      }
    }
  } catch (error) {
    console.error('File upload error:', error);
  }
});
