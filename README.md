# Daily Task Manager

A React Native ToDo app built around a "Liquid Glass" design system — real native glass materials on iOS 26+ (via [`@callstack/liquid-glass`](https://github.com/callstack/liquid-glass)) with a blurred-glass fallback everywhere else, native bottom tabs, and a custom animated bottom sheet for task creation/editing.

## Tech stack

- **React Native 0.81.6** (New Architecture / Fabric), **React 19**
- **TypeScript**
- **Navigation**: [`@react-navigation/native`](https://reactnavigation.org/) + [`react-native-bottom-tabs`](https://github.com/callstackincubator/react-native-bottom-tabs) (native tab bar, not a JS-rendered one)
- **State**: [Zustand](https://github.com/pmndrs/zustand)
- **Data fetching**: [TanStack Query](https://tanstack.com/query) + Axios
- **Persistence**: [`react-native-mmkv`](https://github.com/mrousavy/react-native-mmkv)
- **UI glass effects**: `@callstack/liquid-glass` (iOS 26+) with `@react-native-community/blur` as the cross-platform/older-OS fallback
- **Icons**: `react-native-vector-icons` (Ionicons)

## Project structure

```
src/
  api/            React Query hooks and client setup
  components/
    glass/        Glass design system primitives (GlassSurface, Screen, BottomSheet, AuroraBackground, ...)
    todo/          Task-list building blocks (TaskRow, SearchField, AddTaskFAB, ...)
  constants/       Colors, typography, screen names, storage keys
  navigation/      Root stack + native bottom tab navigator
  screens/         One folder per screen (home, tasks, archived, events, search, task)
  store/           Zustand stores (todos, app state)
  types/           Shared TS types (navigation, theme, todo)
  utils/           Theming, date helpers
android/           Native Android project
ios/               Native iOS project
```

## Prerequisites

- Node.js >= 20 (see `engines` in `package.json`)
- A working [React Native environment](https://reactnative.dev/docs/set-up-your-environment) for the platform(s) you're targeting:
  - **iOS**: Xcode + CocoaPods (macOS only)
  - **Android**: Android Studio, an SDK/emulator or a physical device with USB/wireless debugging enabled
- pnpm (this repo uses `pnpm-lock.yaml`)

## Getting started

Install dependencies:

```sh
pnpm install
```

iOS only — install CocoaPods dependencies:

```sh
cd ios && pod install && cd ..
```

Start Metro:

```sh
pnpm start
```

Run on a platform (in a separate terminal, with Metro running):

```sh
pnpm ios
pnpm android
```

> This project's glass effects are tuned for and best verified on a **physical device** rather than a simulator/emulator — blur and native glass rendering don't always represent accurately in software-rendered simulators.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm start` | Start the Metro bundler |
| `pnpm ios` | Build and run the iOS app |
| `pnpm android` | Build and run the Android app |
| `pnpm test` | Run Jest tests |
| `pnpm lint` | Lint the project with ESLint |
| `pnpm typecheck` | Type-check with `tsc --noEmit` |

## Platform notes

- **Liquid Glass** (`@callstack/liquid-glass`) only renders on iOS 26+; `GlassSurface` automatically falls back to `@react-native-community/blur` everywhere else (older iOS and all of Android).
- **Android blur types**: `@react-native-community/blur`'s Android `BlurView` only accepts `"dark" | "light" | "xlight"` for `blurType` — the richer iOS material names (e.g. `ultraThinMaterialLight`) will crash the app on Android if passed through unconditionally.
- **Vector icon fonts on Android** require `react-native-vector-icons/fonts.gradle` to be applied in `android/app/build.gradle`, or icons render as fallback glyphs instead of the correct symbols.
- **Native bottom tab icons**: `react-native-bottom-tabs` accepts `{ sfSymbol }` on iOS but needs a rasterized image source on Android (this project generates one via `Ionicons.getImageSourceSync`).
- The Android `windowSoftInputMode` is set to `adjustPan` so the custom animated bottom sheet (used for creating/editing tasks) doesn't jump when the keyboard appears.

## Contributing

Run `pnpm lint` and `pnpm typecheck` before committing. Prefer testing UI/visual changes on a physical device over a simulator.
