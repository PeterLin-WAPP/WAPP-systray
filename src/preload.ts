import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    showMainWindow: () => ipcRenderer.send('show-main-window'),
    openCloudPC: () => ipcRenderer.send('open-cloud-pc'),
    openFileUpload: () => ipcRenderer.send('open-file-upload'),
    onCloudPCDisconnected: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('cloud-pc-disconnected', listener);
      return () => ipcRenderer.removeListener('cloud-pc-disconnected', listener);
    },
    onFilesSelected: (callback: (filePaths: string[]) => void) => {
      const listener = (_: any, filePaths: string[]) => callback(filePaths);
      ipcRenderer.on('files-selected', listener);
      return () => ipcRenderer.removeListener('files-selected', listener);
    }
  }
);