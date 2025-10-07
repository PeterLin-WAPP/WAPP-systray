# Windows App System Tray Application

A Windows desktop application with system tray integration and Cloud PC connectivity features.

## Description

Windows App System Tray Application provides a modern interface for managing Cloud PC connections, file uploads, and system integrations through a convenient system tray icon.

## Features

- **System Tray Integration**: Quick access to application features from the Windows system tray
- **Cloud PC Connection**: Connect and manage Cloud PC sessions
- **File Upload**: Upload files to your Cloud PC virtual drive
- **Copilot Mode**: AI-assisted features integration
- **Multi-Window Support**: Main window, tray popup, and Cloud PC session windows

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Windows OS (for full functionality)

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server (runs both renderer and main processes)
npm start

# Or start processes separately
npm run start:renderer  # Start webpack dev server (port 4001)
npm run start:main      # Start Electron main process
```

### Building

```bash
# Build for production
npm run build

# Create distributable packages
npm run dist

# Create Windows installer
npm run dist:win
```

## Project Structure

```
WAPP-systray/
├── assets/              # Application icons and images
├── src/
│   ├── main.ts         # Electron main process
│   ├── preload.js      # Electron preload script
│   └── renderer/       # React renderer process
│       ├── index.tsx   # Renderer entry point
│       ├── App.tsx     # Main React component
│       └── styles.css  # Application styles
├── dist/               # Built files (generated)
└── package.json        # Project dependencies and scripts
```

## Viewing Commit History

To view the commit history of this repository, you can use the following methods:

### Using Git Command Line

```bash
# View commit history with full details
git log

# View compact one-line commit history
git log --oneline

# View commit history with graph visualization
git log --graph --oneline --all

# View last 10 commits
git log -10

# View commits by a specific author
git log --author="author-name"

# View commits with file changes
git log --stat

# View commits with actual code changes
git log -p
```

### Using GitHub Web Interface

1. Navigate to the repository on GitHub: https://github.com/PeterLin-WAPP/WAPP-systray
2. Click on the "Commits" link (showing commit count) near the top of the repository
3. Browse through the commit history with detailed information about each change

### Using GitHub Desktop

1. Open the repository in GitHub Desktop
2. Click on the "History" tab
3. Browse through commits with visual diff view

### Using VS Code

1. Install the "GitLens" extension (optional but recommended)
2. View commit history in the Source Control panel
3. Right-click on any file and select "View File History"

## Technology Stack

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Webpack**: Module bundler
- **Node.js**: Runtime environment

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Getting Help

- Check the commit history for recent changes: `git log`
- Review closed issues on GitHub
- Contact the maintainers for questions
