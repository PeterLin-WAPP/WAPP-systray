# Contributing to ReserveUX-CPConly

Thank you for your interest in contributing to the ReserveUX Cloud PC experience! This document provides guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YourUsername/ReserveUX-CPConly.git
   cd ReserveUX-CPConly
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm start
   ```

## Development Guidelines

### Animation Development
- Use CSS transitions with cubic-bezier easing for natural motion
- Maintain the 5-stage loading sequence timing
- Test animations across different window sizes
- Ensure no visual artifacts or morphing during transitions

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Use meaningful variable names for animation states
- Comment complex animation timing logic

### File Organization
- Keep animations in `styles.css` with clear section comments
- Use React state management for loading stages
- Organize assets by their usage in the sequence

## Submitting Changes

### Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit with descriptive messages:
   ```bash
   git commit -m "feat: add smooth loader transition"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request with:
   - Clear description of changes
   - Screenshots/videos of animation improvements
   - Testing notes

### Commit Message Format
- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - Animation/visual improvements
- `refactor:` - Code restructuring
- `docs:` - Documentation updates

## Animation Guidelines

### Timing Standards
- Maintain the established 800ms interval pattern
- Use smooth transitions (300-400ms duration)
- Synchronize elements that appear together

### Visual Quality
- No stretching or morphing effects
- Smooth opacity transitions
- Proper z-index layering
- Responsive scaling (use vw units for proportional elements)

### Testing Checklist
- [ ] Animations run smoothly at 60fps
- [ ] No visual artifacts during transitions
- [ ] Proper timing alignment across all stages
- [ ] Responsive behavior on different screen sizes
- [ ] Memory usage remains stable during animations

## Reporting Issues

When reporting issues, please include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if visual issue
- System information (OS, screen resolution)
- Browser/Electron version

## Feature Requests

For new features, please:
1. Check existing issues first
2. Describe the user experience improvement
3. Include mockups or examples if possible
4. Explain how it fits with the current design

## Questions?

Feel free to open an issue for questions about:
- Animation implementation
- Code architecture
- Design decisions
- Development setup

Thank you for helping make ReserveUX-CPConly even better! 🚀