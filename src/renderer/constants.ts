// UI Layout Tokens
export const UI_TOKENS = {
  NAV_WIDTH: 72,
  PAGE_MARGIN: 24,
  GAP: 24,
  TITLEBAR_HEIGHT: 48,
} as const;

// Window size configurations for each UI state
export const WINDOW_SIZES = {
  0: { width: 800, height: 600 },
  1: { width: 1080, height: 768 },
  2: { width: 1080, height: 768 },
  3: { width: 1080, height: 768 },
  4: { width: 1080, height: 768 },
} as const;

// UI States
export type UIState = 0 | 1 | 2 | 3 | 4;

// Device card sizes for each state
export const DEVICE_CARD_SIZES = {
  0: { width: 600, height: 400 },
  1: { width: 464, height: 309 },
  2: { width: 300, height: 210 },
  3: { width: 300, height: 210 },
  4: { width: 300, height: 210 },
} as const;

// App card size (consistent across states)
export const APP_CARD_SIZE = { width: 100, height: 100 } as const;