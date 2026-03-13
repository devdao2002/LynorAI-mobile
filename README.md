# Lynor AI Assistant - React Native Copilot

A cross-platform React Native (Expo) mobile application serving as the frontend interface for the Lynor AI intenal assistant. This application provides a native mobile experience for interacting with the RAG (Retrieval-Augmented Generation) backend.

## Features

- 💬 **Real-time Chat**: Connects to the Lynor AI backend using Server-Sent Events (SSE) for fluid, streaming responses.
- 📁 **Document Management**: Upload and manage context documents directly from your device using `expo-document-picker`. The backend will index these for the AI to reference.
- 🎨 **Modern Native UI**: Features a custom-animated bottom tab bar, smooth transitions, and a polished Apple/Material-inspired design system.
- 🔌 **Integration Guides**: View setup instructions for connecting the bot to Microsoft Teams, Power Apps, and Web Chat, complete with a copy-to-clipboard code viewer.
- ⚙️ **Sandbox Environment**: Manages secure temporary backend sessions, checking status and time remaining limits directly within the app.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.83.2)
- **Toolchain**: [Expo](https://expo.dev/) SDK 55 (Canary)
- **Navigation**: React Navigation v7 (Bottom Tabs)
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: Context-aware custom theme system

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install) (for macOS users)
- An iOS Simulator (via Xcode) or an Android Emulator (via Android Studio), OR a physical device with the Expo Go app installed.

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd mobile
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Server (Expo Go)
To start the React Native packager (Metro bundler), run:
```bash
npx expo start
```
From here, you can:
- Press `i` to open the app in an iOS Simulator.
- Press `a` to open the app in an Android Emulator.
- Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android) to run it on a physical device.

### Native Build (Physical Device via USB)
To compile the app into a standalone native binary and deploy it directly to a connected phone:

**For iOS:**
```bash
npx expo run:ios --device
```
*(Note: Requires Xcode 16+, CocoaPods, and a valid Apple Developer code signing certificate configured in the generated `.xcworkspace` file).*

**For Android:**
```bash
npx expo run:android --device
```

## Troubleshooting

### "No script URL provided" crash on iOS
If the compiled app crashes immediately on a physical iOS device with the error `No script URL provided`:
1. Ensure your Mac and iPhone are connected to the exact same Wi-Fi network.
2. The `AppDelegate.swift` file has been configured with a fallback IP address to locate the Metro bundler. If your Mac's IP address changes, update the fallback URL inside `ios/LynorAICopilot/AppDelegate.swift`:
   ```swift
   override func bundleURL() -> URL? {
   #if DEBUG
       return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry") ?? URL(string: "http://YOUR_MAC_IP_HERE:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true&minify=false")
   ```

### Xcode 16 Swift Concurrency Errors
This project uses an Expo 55 Canary release which may encounter Swift 6 strict concurrency errors (`MainActor` / `Sendable`) when built with Xcode 16.
These issues have been patched out locally via `patch-package`. If you reinstall `node_modules`, ensure you run `npx patch-package` to re-apply the fixes to `expo-modules-core`.

## Project Structure

- `/src`
  - `/api` - API client configurations and Server-Sent Events (SSE) streaming logic.
  - `/components` - Reusable UI components (TopBar, etc).
  - `/hooks` - Custom React hooks (`useChat`, `useDocuments`, `useBootstrap`) for state management.
  - `/navigation` - React Navigation routers and custom animated tab bars.
  - `/screens` - Main application views (Chat, Documents, Integrations, Settings).
  - `/theme.js` - Global design tokens (colors, typography, spacing).
- `/assets` - Static images, fonts, and splash screens.
- `/ios` - Generated native iOS Xcode project.
- `/android` - Generated native Android Studio project.

## License

MIT
