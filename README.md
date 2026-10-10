<div align="center">

# 🛠️ @useless-engineer/utils

**Small, typed utilities distilled from real production bugs.**
One package. Multiple entry points. Only pay for what you import.

[![npm version](https://img.shields.io/npm/v/@useless-engineer/utils?style=for-the-badge&logo=npm&color=CB3837&labelColor=1a1a1a)](https://www.npmjs.com/package/@useless-engineer/utils)
[![npm downloads](https://img.shields.io/npm/dm/@useless-engineer/utils?style=for-the-badge&color=7c3aed&labelColor=1a1a1a)](https://www.npmjs.com/package/@useless-engineer/utils)
[![license](https://img.shields.io/npm/l/@useless-engineer/utils?style=for-the-badge&color=22c55e&labelColor=1a1a1a)](./LICENSE)

![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-10b981?style=flat-square)
![Zero deps](https://img.shields.io/badge/dependencies-0-f59e0b?style=flat-square)
![ESM + CJS](https://img.shields.io/badge/ESM%20%2B%20CJS-both-0ea5e9?style=flat-square)
![React Native](https://img.shields.io/badge/React%20Native-supported-61DAFB?style=flat-square&logo=react&logoColor=black)

[**📦 Install**](#-install) ·
[**⚡ Quick start**](#-quick-start) ·
[**📚 API**](#-api) ·
[**🗺️ Roadmap**](#️-roadmap) ·
[**📸 Follow**](https://www.instagram.com/useless_engineer.dev/)

</div>

---

## ✨ Why this exists

Every utility here started as an [Instagram post](https://www.instagram.com/useless_engineer.dev/) about a bug that actually shipped. The post explains the problem; this package is the fix, typed and tested, so you never copy-paste it again.

|                          |                                                        |
| ------------------------ | ------------------------------------------------------ |
| 🎯 **Focused**           | Each function does one thing and has tests             |
| 🌲 **Tree-shakeable**    | `sideEffects: false`, import only what you use         |
| 🧩 **Split by platform** | Core, React Native, and more, each its own import path |
| 🔒 **Strictly typed**    | Written in TypeScript with strict mode on              |

---

## 📦 Install

```bash
npm install @useless-engineer/utils
```

<details>
<summary><b>pnpm / yarn / bun</b></summary>

```bash
pnpm add @useless-engineer/utils
yarn add @useless-engineer/utils
bun add @useless-engineer/utils
```

</details>

---

## ⚡ Quick start

```ts
import { debounce, throttle } from "@useless-engineer/utils";

const onSearch = debounce((query: string) => fetchResults(query), 300);
const onScroll = throttle(() => updateHeader(), 100);
```

```ts
import { isIOS, isAndroid } from "@useless-engineer/utils/react-native";

const padding = isIOS ? 20 : 16;
```

> 💡 `react` and `react-native` are **optional** peer dependencies. If you only use the core entry, you never need to install either.

---

## 🧭 Entry points

| Import path                            | For                       | Status                                                                        |
| -------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `@useless-engineer/utils`              | Platform-agnostic helpers | ![live](https://img.shields.io/badge/-live-22c55e?style=flat-square)          |
| `@useless-engineer/utils/react-native` | React Native helpers      | ![live](https://img.shields.io/badge/-live-22c55e?style=flat-square)          |
| `@useless-engineer/utils/react`        | React hooks               | ![soon](https://img.shields.io/badge/-coming%20soon-f59e0b?style=flat-square) |

---

## 📚 API

### Core

<details>
<summary><code>debounce(fn, delay)</code> &nbsp; ![live](https://img.shields.io/badge/-live-22c55e?style=flat-square) ![async](https://img.shields.io/badge/-async-6366f1?style=flat-square)</summary>

<br>

Waits for quiet. Every call resets the timer, and only the last call fires. Good for search inputs and autosave.

```ts
const save = debounce((text: string) => api.save(text), 500);

save("h");
save("he");
save("hello"); // only this one runs, 500ms after the last call

// In a React effect cleanup, so nothing fires after unmount:
save.cancel();
```

| Param       | Type                | Description                         |
| ----------- | ------------------- | ----------------------------------- |
| `fn`        | `(...args) => void` | Function to debounce                |
| `delay`     | `number`            | Milliseconds of quiet before firing |
| **returns** | `Debounced`         | Callable with a `.cancel()` method  |

</details>

<details>
<summary><code>throttle(fn, interval, options?)</code> &nbsp; ![live](https://img.shields.io/badge/-live-22c55e?style=flat-square) ![async](https://img.shields.io/badge/-async-6366f1?style=flat-square)</summary>

<br>

Keeps a steady beat. Runs at most once per interval, however often it's called. Good for scroll, drag, and resize.

```ts
const onScroll = throttle(() => updateHeader(), 100);

// Skip the immediate first call:
throttle(fn, 100, { leading: false });

// Skip the final catch-up call:
throttle(fn, 100, { trailing: false });
```

| Option     | Default | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| `leading`  | `true`  | Fire right away on the first call of a burst        |
| `trailing` | `true`  | Fire once more at the end with the latest arguments |

Returns a function with `.cancel()`.

</details>

<details>
<summary><b>debounce or throttle?</b></summary>

<br>

|              | `debounce`                        | `throttle`                       |
| ------------ | --------------------------------- | -------------------------------- |
| Fires        | Once, after calls **stop**        | On a fixed beat **during** calls |
| Use for      | Search box, autosave, validation  | Scroll, drag, resize             |
| Ask yourself | "Do I only need the final state?" | "Does it need to stay live?"     |

</details>

### React Native

<details>
<summary><code>isIOS</code> / <code>isAndroid</code> &nbsp; ![live](https://img.shields.io/badge/-live-22c55e?style=flat-square) ![react native](https://img.shields.io/badge/-react%20native-61DAFB?style=flat-square&logoColor=black)</summary>

<br>

Plain booleans derived from `Platform.OS`.

```ts
import { isIOS, isAndroid } from "@useless-engineer/utils/react-native";

const behavior = isIOS ? "padding" : "height";
```

</details>

---

## 🗺️ Roadmap

Released one or two at a time, each matching a post that's already live.

| Next up                                                                                                                  | Entry        | Origin                               |
| ------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------ |
| ![next](https://img.shields.io/badge/-next-f59e0b?style=flat-square)`safeParseJSON`, `safeStringify`, `deepClone`        | core         | JSON and shallow-copy gotchas        |
| ![planned](https://img.shields.io/badge/-planned-64748b?style=flat-square) `getAccessibilityProps`, `createShadow`       | react-native | Accessibility and iOS-only shadows   |
| ![planned](https://img.shields.io/badge/-planned-64748b?style=flat-square) `useInterval`, `useCountdown`, `useIsMounted` | react        | Stale closures and unmounted updates |

---

## 🤝 Contributing

Found a bug or have a post idea that deserves a utility? [Open an issue](https://github.com/<your-username>/useless-engineer/issues).

```bash
npm install
npm test
npm run build
```

---

<div align="center">

**Built from real bugs, one post at a time.**

[![Instagram](https://img.shields.io/badge/Follow-@useless__engineer.dev-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/useless_engineer.dev/)

MIT © Saurabh Bandkar

</div>
