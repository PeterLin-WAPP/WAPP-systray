# ReserveUX-CPConly

A sophisticated Cloud PC loading experience with smooth animations and transitions, built with Electron and React.

## Features

### 🎨 **Animated Loading Sequence**
- **5-stage loading animation** with precise timing
- **WAPPloader** with smooth fade-in and movement transitions
- **WAPPloaderBranded** with scale and opacity animations
- **Background crossfades** from loading screen to desktop wallpaper
- **Proportional taskbar** that scales with window dimensions

### 🖥️ **Cloud PC Experience**
- Full-screen Cloud PC simulation
- Smooth background transitions using CSS pseudo-elements
- Professional loading sequence mimicking real Cloud PC behavior
- Toast notifications for file upload feedback

### ⚡ **Technical Highlights**
- **Electron + React** architecture
- **CSS-based animations** with cubic-bezier easing
- **Viewport-responsive design** (taskbar scales with 3.33vw height)
- **Layer management** with proper z-index stacking
- **Optimized transitions** to prevent visual artifacts

## Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/ReserveUX-CPConly.git

# Navigate to project directory
cd ReserveUX-CPConly

# Install dependencies
npm install

# Start development server
npm start
```

## Build

```bash
# Build for Windows
npm run build

# Create distribution package
npm run dist
```

## Animation Sequence

The Cloud PC loading experience follows this timeline:

1. **0ms**: Window opens with loading background
2. **800ms**: WAPPloader fades in (300ms transition)
3. **1600ms**: WAPPloader moves 64px left (400ms movement)
4. **2000ms**: WAPPloaderBranded appears with scale animation (300ms)
5. **3300ms**: Both loaders fade out (300ms)
6. **3600ms**: Background transitions to desktop wallpaper (800ms)
7. **3600ms**: Taskbar appears synchronized with wallpaper

## Project Structure

```
src/
├── renderer/
│   ├── App.tsx          # Main application component
│   ├── styles.css       # All styling and animations
│   └── index.html       # HTML template
├── main.ts              # Electron main process
└── assets/
    ├── CPCloadingbackground.png
    ├── CPCwallpaper2.png
    ├── WAPPloader.svg
    ├── WAPPloaderBranded.png
    └── CPCtaskbar.png
```

## Key Technologies

- **Electron** - Cross-platform desktop app framework
- **React** - UI component library
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Advanced animations and transitions
- **Webpack** - Module bundler

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

**ReserveUX Team** - Creating exceptional user experiences for Cloud PC environments.