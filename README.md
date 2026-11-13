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
<summary><code>debounce(fn, delay)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="async" src="https://img.shields.io/badge/-async-6366f1?style=flat-square"></summary>

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
<summary><code>throttle(fn, interval, options?)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="async" src="https://img.shields.io/badge/-async-6366f1?style=flat-square"></summary>

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

<details>
<summary><code>delay(ms, options?)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="async" src="https://img.shields.io/badge/-async-6366f1?style=flat-square"></summary>

<br>

`await`-able sleep that rejects bad input (negative, `NaN`, `Infinity`) instead of silently firing instantly, and can be cancelled.

```ts
await delay(500);

const ctrl = new AbortController();
delay(5000, { signal: ctrl.signal }).catch(() => {});
ctrl.abort(); // stops waiting; the promise rejects with the signal's reason
```

</details>

<details>
<summary><code>withTimeout(promise, ms, message?)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="async" src="https://img.shields.io/badge/-async-6366f1?style=flat-square"></summary>

<br>

Rejects with a `TimeoutError` if the promise takes too long. Clears its timer once the promise settles.

```ts
try {
  const user = await withTimeout(fetchUser(id), 3000);
} catch (e) {
  if (e instanceof TimeoutError) showRetry();
}
```

> ⚠️ This stops _waiting_, not the work. A timed-out `fetch` keeps running unless you also pass it an `AbortSignal`.

</details>

<details>
<summary><code>safeParseJSON(text, fallback?)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="json" src="https://img.shields.io/badge/-json-f97316?style=flat-square"></summary>

<br>

`JSON.parse` that never throws. Returns the fallback for invalid JSON or for `null`/`undefined` input (like a missing `AsyncStorage` key).

```ts
const settings = safeParseJSON(raw, { theme: "light" });
safeParseJSON("0", 99); // 0, valid falsy values are kept
safeParseJSON("{oops", 1); // 1
```

> The type `T` is a promise from you, not a check. Validate untrusted data before relying on its shape.

</details>

<details>
<summary><code>safeStringify(value, options?)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="json" src="https://img.shields.io/badge/-json-f97316?style=flat-square"></summary>

<br>

`JSON.stringify` that never throws on circular references or `BigInt`.

```ts
const a = { name: "a" };
a.self = a;
safeStringify(a); // '{"name":"a","self":"[Circular]"}'
safeStringify({ n: 10n }); // '{"n":"10"}'
safeStringify(data, { space: 2 });
```

Shared (non-circular) references are kept as they are. Returns `undefined` when there's no JSON form, like `JSON.stringify`.

</details>

<details>
<summary><code>deepClone(value)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="object" src="https://img.shields.io/badge/-object-ec4899?style=flat-square"></summary>

<br>

A real deep copy. `{ ...obj }` only copies the top level, so nested objects stay shared with the original.

```ts
const a = { user: { name: "a", tags: ["x"] } };

const shallow = { ...a };
shallow.user.name = "oops"; // a.user.name is now "oops" too

const copy = deepClone(a);
copy.user.name = "safe"; // a is untouched
```

Handles nested objects and arrays, `Date`, `RegExp`, `Map`, `Set`, typed arrays, circular references, and class instances (prototype kept). Functions, `Promise`, `WeakMap` and `WeakSet` can't be copied and are returned as they are.

> It's one implementation on every platform, so behaviour doesn't change depending on whether `structuredClone` exists in your React Native engine.

</details>

<details>
<summary><code>settle(promises)</code> / <code>getOrDefault(result, fallback)</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="async" src="https://img.shields.io/badge/-async-6366f1?style=flat-square"></summary>

<br>

`Promise.all` rejects on the first failure and throws away everything else. These keep what worked.

```ts
// A list: keep the successes, collect the failures
const { values, errors } = await settle(files.map(upload));

// A few named requests: per-field fallbacks
const [user, orders] = await Promise.allSettled([getUser(), getOrders()]);
render({
  user: getOrDefault(user, null),
  orders: getOrDefault(orders, []),
});
```

`settle` also returns the raw `results`, so you can tell which input failed.

</details>

### React Native

<details>
<summary><code>isIOS</code> / <code>isAndroid</code> &nbsp; <img alt="live" src="https://img.shields.io/badge/-live-22c55e?style=flat-square"> <img alt="react native" src="https://img.shields.io/badge/-react%20native-61DAFB?style=flat-square&logoColor=black"></summary>

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
| ![next](https://img.shields.io/badge/-next-f59e0b?style=flat-square) `getAccessibilityProps`, `createShadow`             | react-native | Accessibility and iOS-only shadows   |
| ![planned](https://img.shields.io/badge/-planned-64748b?style=flat-square) `useInterval`, `useCountdown`, `useIsMounted` | react        | Stale closures and unmounted updates |
| ![planned](https://img.shields.io/badge/-planned-64748b?style=flat-square) `toCents`, `fromCents`, `formatMoney`         | core         | Floating-point money bugs            |

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
