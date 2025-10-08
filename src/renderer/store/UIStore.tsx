import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UIState, WINDOW_SIZES } from '../constants';

// Global UI Store interface
interface UIStore {
  uiState: UIState;
  setUIState: (state: UIState) => void;
  setWindowSize: (width: number, height: number, animated?: boolean) => void;
  incrementState: () => void;
  decrementState: () => void;
}

// Context for global UI state
const UIContext = createContext<UIStore | null>(null);

// Provider component
export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uiState, setUIStateInternal] = useState<UIState>(0);

  const setWindowSize = (width: number, height: number, animated: boolean = false) => {
    // @ts-ignore (window.electron is injected)
    if (animated && window.electron?.setWindowSizeAnimated) {
      // @ts-ignore (window.electron is injected)
      window.electron.setWindowSizeAnimated(width, height, 350); // 350ms transition
    } else if (window.electron?.setWindowSize) {
      // @ts-ignore (window.electron is injected)
      window.electron.setWindowSize(width, height);
    }
  };

  const setUIState = (state: UIState) => {
    const previousState = uiState;
    setUIStateInternal(state);
    const { width, height } = WINDOW_SIZES[state];
    
    // Use animation for window size changes (especially between state 0 and 1+)
    const shouldAnimate = (previousState === 0 && state > 0) || (previousState > 0 && state === 0);
    setWindowSize(width, height, shouldAnimate);
  };

  const incrementState = () => {
    if (uiState < 4) {
      setUIState((uiState + 1) as UIState);
    }
  };

  const decrementState = () => {
    if (uiState > 0) {
      setUIState((uiState - 1) as UIState);
    }
  };

  const store: UIStore = {
    uiState,
    setUIState,
    setWindowSize,
    incrementState,
    decrementState,
  };

  return (
    <UIContext.Provider value={store}>
      {children}
    </UIContext.Provider>
  );
};

// Hook to use the UI store
export const useUIStore = (): UIStore => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIStore must be used within a UIProvider');
  }
  return context;
};