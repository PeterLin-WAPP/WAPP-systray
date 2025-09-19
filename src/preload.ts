import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    showMainWindow: () => ipcRenderer.send('show-main-window'),
    openCloudPC: () => ipcRenderer.send('open-cloud-pc'),
    onCloudPCDisconnected: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('cloud-pc-disconnected', listener);
      return () => ipcRenderer.removeListener('cloud-pc-disconnected', listener);
    }
  }
);