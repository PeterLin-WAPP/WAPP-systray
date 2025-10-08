import { app, BrowserWindow, Tray, Menu, screen, ipcMain, dialog } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let trayWindow: BrowserWindow | null = null;
let cloudPCWindow: BrowserWindow | null = null;

function createMainWindow() {
  const iconPath = path.join(__dirname, '../assets/icons/icon.png');
  mainWindow = new BrowserWindow({
    width: 824,
    height: 664,
    icon: iconPath,
    frame: false,
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
    mainWindow.loadURL('http://localhost:4003');
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
  const trayBounds = tray?.getBounds();

  trayWindow = new BrowserWindow({
    width: 320,
    height: 456,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    show: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (trayBounds) {
    const windowBounds = trayWindow.getBounds();
    // Position window centered above the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    const y = trayBounds.y - windowBounds.height - 24; // 24px gap above tray icon
    trayWindow.setPosition(x, y);
  }

  if (process.env.NODE_ENV === 'development') {
    trayWindow.loadURL('http://localhost:4003?mode=tray');
  } else {
    trayWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { mode: 'tray' }
    });
  }

  trayWindow.on('blur', () => {
    trayWindow?.hide();
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/icons/icon.ico');
  tray = new Tray(iconPath);
  tray.setToolTip('Windows App');

  // Create context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Main Window',
      click: () => {
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

  // Set the context menu
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (trayWindow?.isVisible()) {
      trayWindow.hide();
    } else {
      trayWindow?.show();
    }
  });
}

function createCloudPCWindow(): void {
  const iconPath = path.join(__dirname, '../assets/icons/CPCicon.png');
  cloudPCWindow = new BrowserWindow({
    width: 1024,
    height: 768,
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
    cloudPCWindow.loadURL('http://localhost:4003?mode=cloudpc');
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
  });
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

// Handle window size changes
ipcMain.on('set-window-size', (event, width: number, height: number) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setSize(width, height);
    mainWindow.center(); // Center the window after resize
  }
});

// Handle animated window size changes
ipcMain.on('set-window-size-animated', (event, width: number, height: number, duration: number = 300) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const currentBounds = mainWindow.getBounds();
    const startWidth = currentBounds.width;
    const startHeight = currentBounds.height;
    const startX = currentBounds.x;
    const startY = currentBounds.y;
    
    // Calculate target position (centered)
    const display = screen.getPrimaryDisplay();
    const targetX = Math.round((display.workAreaSize.width - width) / 2);
    const targetY = Math.round((display.workAreaSize.height - height) / 2);
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate dimensions and position
      const currentWidth = Math.round(startWidth + (width - startWidth) * easeOut);
      const currentHeight = Math.round(startHeight + (height - startHeight) * easeOut);
      const currentX = Math.round(startX + (targetX - startX) * easeOut);
      const currentY = Math.round(startY + (targetY - startY) * easeOut);
      
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setBounds({
          x: currentX,
          y: currentY,
          width: currentWidth,
          height: currentHeight
        });
        
        if (progress < 1) {
          setTimeout(animate, 16); // ~60fps
        }
      }
    };
    
    animate();
  }
});

// Window control handlers
ipcMain.on('minimize-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize();
  }
});

ipcMain.on('maximize-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});
