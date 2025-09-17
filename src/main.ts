import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  // Create the browser window.
  const iconPath = path.join(__dirname, '../assets/icon.png');
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: iconPath,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#ddddddff',
      symbolColor: '#000000',
      height: 32
    },
    backgroundColor: '#ddddddff',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // Set the taskbar icon explicitly
  if (process.platform === 'win32') {
    mainWindow.setIcon(iconPath);
    app.setAppUserModelId(app.getName());
  }

  // Load the index.html file.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4001');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});