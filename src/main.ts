import { app, BrowserWindow, Tray, screen } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let trayWindow: BrowserWindow | null = null;

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
      nodeIntegration: true,
      contextIsolation: false
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
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f4f4f4',
      symbolColor: '#000000',
      height: 32
    },
    backgroundColor: '#f4f4f4',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  if (trayBounds) {
    const windowBounds = trayWindow.getBounds();
    trayWindow.setPosition(
      display.workArea.width - windowBounds.width,
      display.workArea.height - windowBounds.height
    );
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
