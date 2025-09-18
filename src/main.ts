import { app, BrowserWindow, Tray, screen, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let trayWindow: BrowserWindow | null = null;
let cloudPCWindow: BrowserWindow | null = null;

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
}

function createTrayWindow() {
  const display = screen.getPrimaryDisplay();
  const trayBounds = tray?.getBounds();

  trayWindow = new BrowserWindow({
    width: 320,
    height: 480,
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
    const y = trayBounds.y - windowBounds.height - 80; // 80px gap above tray icon
    trayWindow.setPosition(x, y);
  }

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

function createTray() {
  const iconPath = path.join(__dirname, '../assets/icon.ico');
  tray = new Tray(iconPath);
  tray.setToolTip('Windows App');

  tray.on('click', () => {
    if (trayWindow?.isVisible()) {
      trayWindow.hide();
    } else {
      trayWindow?.show();
    }
  });
}

function createCloudPCWindow(): void {
  const iconPath = path.join(__dirname, '../assets/CPCicon.png');
  cloudPCWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    title: 'Cloud PC',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f4f4f4',
      symbolColor: '#000000',
      height: 32
    },
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
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createMainWindow();
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
