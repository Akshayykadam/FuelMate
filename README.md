# FuelMate ⛽

**FuelMate** is a modern, minimal mobile application designed to help you track your vehicle's fuel consumption, expenses, and efficiency. Built with **React Native** and **Expo**, it features an elegant **Charcoal & Warm White** theme inspired by Notion's aesthetics.

## ✨ Features

### 🚗 Vehicle Management
- **Multi-Vehicle Support**: Manage unlimited vehicles (Cars & Motorcycles)
- **Multiple Fuel Types**: Petrol, Diesel, CNG, Electric, and Hybrid vehicles
- **Vehicle Details**: Track make, model, year, tank capacity, and initial odometer

### ⛽ Fuel Tracking
- **Quick Fuel Logging**: Easy entry of fuel logs with price, volume, and odometer
- **Full Tank / Partial Fill**: Track both complete and partial fill-ups
- **Automatic Calculations**: Fuel efficiency calculated automatically

### 📊 Statistics & Insights
- **Efficiency Tracking**: Real-time km/l or mpg calculations
- **Expense Dashboard**: Visualize spending with clean statistics cards
- **Monthly Reports**: Detailed monthly breakdown of fuel expenses
- **Vehicle-specific Stats**: Per-vehicle efficiency and spending analysis

### 🎨 Design
- **Ultra-Minimal UI**: Clean Charcoal & Warm White theme (Notion-inspired)
- **Dark Mode**: Beautiful, battery-friendly dark interface
- **Custom Modals**: Themed selection dialogs for units and currency
- **Smooth Animations**: Polished micro-interactions throughout

### 📱 Additional Features
- **Map Integration**: One-tap access to find nearby petrol pumps
- **Data Export**: Export your data as CSV or JSON
- **Multi-Currency**: Support for INR, USD, EUR, GBP, and more
- **Flexible Units**: Customize distance (km/mi) and volume (L/gal) units
- **Local Storage**: Secure on-device data storage with AsyncStorage
- **Personalization**: Custom profile image and greeting

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Storage** | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) |
| **Icons** | [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) |
| **File System** | [Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/) |
| **Sharing** | [Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) |

## 📁 Project Structure

```
FuelMate/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── vehicles.tsx   # Vehicles list
│   │   ├── expenses.tsx   # Expenses/fuel entries
│   │   └── settings.tsx   # Settings screen
│   ├── add-fuel.tsx       # Add fuel entry
│   ├── add-vehicle.tsx    # Add vehicle
│   ├── vehicle-details/   # Vehicle details screen
│   └── monthly-stats.tsx  # Monthly statistics
├── components/            # Reusable UI components
├── constants/             # Colors and theme
├── store/                 # Zustand state stores
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions (formatting, export)
```

## 🎨 Color Palette

The app uses an ultra-minimal Charcoal & Warm White theme:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#18181B` | Primary background |
| Card | `#27272A` | Card backgrounds |
| Card Alt | `#3F3F46` | Nested elements |
| Text | `#FAFAFA` | Primary text |
| Text Secondary | `#A1A1AA` | Muted text |
| Border | `#3F3F46` | Subtle borders |
| Success | `#4ADE80` | Positive indicators |
| Warning | `#FBBF24` | Warnings, prices |
| Danger | `#F87171` | Errors, delete actions |

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your iOS or Android device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fuelmate.git
   cd fuelmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with **Expo Go** (Android) or Camera (iOS)
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator

### Building for Production

```bash
# Build Android APK
npx eas build --platform android --profile production

# Build iOS
npx eas build --platform ios --profile production
```

## 📱 Screenshots

<!-- Add your screenshots here -->
<!-- 
<p align="center">
  <img src="assets/screenshots/home.png" width="200" />
  <img src="assets/screenshots/vehicle-details.png" width="200" />
  <img src="assets/screenshots/add-fuel.png" width="200" />
  <img src="assets/screenshots/settings.png" width="200" />
</p>
-->

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

Made with ❤️ by [@akshayyysk](https://www.instagram.com/akshayyysk/)

---

<p align="center">
  <strong>FuelMate</strong> — Track smarter, drive better.
</p>
