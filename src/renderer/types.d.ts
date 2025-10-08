declare module '*.png' {
    const content: any;
    export default content;
}

interface Window {
  electron: {
    showMainWindow: () => void;
    openCloudPC: () => void;
    openFileUpload: () => void;
    setWindowSize: (width: number, height: number) => void;
    setWindowSizeAnimated: (width: number, height: number, duration?: number) => void;
    onCloudPCDisconnected: (callback: () => void) => () => void;
    onFilesSelected: (callback: (filePaths: string[]) => void) => () => void;
  };
}