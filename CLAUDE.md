# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A React Native ToDo app ("Daily Task Manager", app identifier `DailyTaskManager` / `com.dailytaskmanager`) built around a "Liquid Glass" design system: real native glass materials on iOS 26+ via `@callstack/liquid-glass`, with a blurred-glass fallback everywhere else, a native bottom tab bar, and a custom animated bottom sheet for task creation/editing.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` + `pnpm-workspace.yaml` are the source of truth — do not use npm/yarn).

```sh
pnpm install              # install deps
cd ios && pod install     # iOS only, after installing/updating native deps

pnpm start                # start Metro (run this first, in its own terminal)
pnpm ios                  # build + run iOS
pnpm android               # build + run Android

pnpm typecheck             # tsc --noEmit
pnpm lint                  # eslint . --ext .js,.jsx,.ts,.tsx
pnpm test                  # jest
```

There is no `jest.config.js` or `.eslintrc` in the repo at present, and no test files exist yet — `pnpm test`/`pnpm lint` rely on whatever config gets added.

Both platforms have New Architecture (Fabric) and Hermes enabled (`android/gradle.properties`: `newArchEnabled=true`, `hermesEnabled=true`).

**Always verify UI/visual changes on a physical device, not a simulator/emulator** — glass/blur rendering does not represent accurately in software-rendered simulators, and several Android-only native crashes in this app have only ever reproduced on-device (see "Android gotchas" below).

## Architecture

### Navigation

- `App.tsx` → `NavigationContainer` (theme built from `useTheme()`) → `RootNavigator` (native stack, headers hidden).
- `RootNavigator` (`src/navigation/RootNavigator.tsx`) has three routes: `MainTabs`, `AddTask`, `TaskDetail`. The latter two are pushed as `presentation: 'transparentModal'` with `animation: 'none'` — they render as an overlay (see `BottomSheet` below) rather than a sliding screen, so the stack's own transition is intentionally disabled.
- `MainTabs` (`src/navigation/MainTabs.tsx`) uses `@bottom-tabs/react-navigation`'s `createNativeBottomTabNavigator` — this is a **native** tab bar (SwiftUI on iOS, `BottomNavigationView` on Android), not a JS-rendered one. Tab bar styling/tint colors and icons must be passed as navigator-level props (`tabBarStyle`, `tabBarActiveTintColor`, `tabBarInactiveTintColor`), not inside `screenOptions`.
- Tab icons are platform-conditional: `{ sfSymbol }` on iOS, a rasterized `Ionicons.getImageSourceSync(...)` image on Android (SF Symbols aren't supported there). See the `tabIcon` helper in `MainTabs.tsx`.
- Screen name constants live in `src/constants/screens.ts` (`Screens.*`) — use these instead of raw strings when navigating.

### Glass design system (`src/components/glass/`)

- `Screen.tsx` — the standard screen wrapper (aurora background + safe-area padding + optional `ScrollView`/`header`/`floatingAction`). Used by all tab screens instead of raw `View`/`SafeAreaView`.
- `GlassSurface.tsx` — the core "glass card" primitive. Branches at render time: if `isLiquidGlassSupported` (iOS 26+), renders a real `LiquidGlassView`; otherwise falls back to `@react-native-community/blur`'s `BlurView` with a tint overlay. Any new platform-specific glass behavior belongs in this branch.
- `BottomSheet.tsx` — a custom animated (not library) bottom sheet using `Animated.Value` + `PanResponder`, absolutely positioned and sized off `useWindowDimensions()`. Used by `AddEditTaskScreen`/`TaskDetailScreen` via the `transparentModal` routes above.
- `AuroraBackground.tsx` / `GlassTextField.tsx` — supporting pieces of the same system.
- Theming: `useTheme()` (`src/utils/useTheme.ts`) returns `{ isDark, colors }` from `src/constants/colors.ts` (`Colors.light` / `Colors.dark`), driven by `useColorScheme()`. All glass/theme colors (including glass-specific tokens like `glassTint`, `glassBorder`, `auroraOne/Two/Three`) are defined there — add new color tokens to `ColorTokens` in that file, not inline.

### State & persistence

- `src/store/useTodoStore.ts` — a single Zustand store (`persist` middleware) is the source of truth for todos. It's seeded with demo data on first run and persisted synchronously to MMKV (`src/store/storage.ts`, `mmkvStorage` adapter).
- Selectors (`selectActiveTodos`, `selectArchivedTodos`, `selectTodoById`) return **new array references on every call** — they must be used inside a `useMemo`, never passed directly as the Zustand selector function, or you get an infinite `useSyncExternalStore` update loop.
- `src/api/` (Axios client + a `useUsers` React Query hook against `jsonplaceholder.typicode.com`) is a demo/scaffold layer for data-fetching patterns — it is not wired to any real backend for this app's actual todo data (that's all local, via the store above).

### Path aliases

`@/*` maps to `src/*` (configured in both `babel.config.js` via `babel-plugin-module-resolver` and `tsconfig.json` paths) — use `@/...` imports, not relative `../../` chains, for anything under `src/`.

## Android gotchas (learned the hard way — don't regress these)

- `@react-native-community/blur`'s Android `BlurView` only accepts `blurType` of `"dark" | "light" | "xlight"`. The richer iOS material names (e.g. `ultraThinMaterialLight`) crash the app on Android (native abort) if passed through unconditionally — always branch on `Platform.OS` before setting `blurType`.
- `react-native-vector-icons` fonts must be linked via `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")` in `android/app/build.gradle`, or icons render as fallback/tofu glyphs on Android (iOS auto-links fonts via CocoaPods, so this only breaks Android).
- The native bottom tab bar's Android icon loader (Coil) defaults to hardware bitmaps, which crashes `@react-native-community/blur`'s `BlurView` (it does a software canvas snapshot of the whole window). This is patched via `pnpm patch` — see `patches/react-native-bottom-tabs@1.4.0.patch` (adds `.allowHardware(false)` to the icon `ImageRequest`). If this package is ever upgraded, re-verify the patch still applies/is still needed.
- `android/app/src/main/AndroidManifest.xml` sets `android:windowSoftInputMode="adjustPan"` (not the RN default `adjustResize`) so the absolutely-positioned `BottomSheet` doesn't jump/resize when the keyboard opens. If you touch keyboard-avoidance behavior on any screen, keep this in mind — screens using `Screen.tsx`'s plain flex layout don't need JS-side `KeyboardAvoidingView` handling, but the modal `BottomSheet` does (see `AddEditTaskScreen.tsx`'s `KeyboardAvoidingView` with `behavior="height"` on Android).
