# Changelog

All notable changes to ReserveUX-CPConly will be documented in this file.

## [1.0.0] - 2025-09-24

### Added
- Initial release of Cloud PC loading experience
- 5-stage animated loading sequence with precise timing
- WAPPloader with smooth fade-in and movement transitions (64px left movement)
- WAPPloaderBranded with scale animation (50% → 100% size + opacity fade)
- Smooth background crossfades using CSS pseudo-elements
- Proportional taskbar scaling (3.33vw height maintains aspect ratio)
- Toast notification system for file upload feedback
- Professional cubic-bezier easing for natural animations

### Technical Features
- Electron + React + TypeScript architecture
- CSS-based animations with no visual artifacts or morphing
- Viewport-responsive design
- Optimized layer management with proper z-index stacking
- Background transitions using opacity instead of background-image (prevents stretching)

### Animation Timeline
- 800ms: WAPPloader fade-in
- 1600ms: WAPPloader movement (400ms cubic-bezier easing)
- 2000ms: WAPPloaderBranded scale + fade (300ms)
- 3300ms: Both loaders fade out (300ms)
- 3600ms: Background transition to desktop wallpaper (800ms)
- 3600ms: Taskbar synchronized appearance with wallpaper

### UI Enhancements
- Dimmer grey titlebar and navbar (#e8e8e8) for better visual hierarchy
- Fixed main-content background display issues
- Enhanced pseudo-element architecture for smooth crossfades