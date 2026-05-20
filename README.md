# CounterApp

A React Native counter app built with React native and TypeScript.

## Screenshot
<img width="500" alt="image" src="https://github.com/user-attachments/assets/19a7c07d-98c4-48bd-8d57-8d71fdce76a2" />


## Getting Started

```bash
npm install
npm run ios
```

## Project Structure

```
CounterApp/
├── App.tsx                        # Entry point
└── src/
    ├── hooks/
    │   └── useCounter.ts          # All counter logic
    ├── components/
    │   └── CounterButton.tsx      # Reusable button component
    └── screens/
        └── CounterScreen.tsx      # UI layer
```

## How the logic is structured

All business logic lives in `useCounter.ts` as a custom React hook. The screen is a pure UI layer — it only calls the hook and renders the state. This keeps logic and UI completely separate.

## Where state is stored and why

State is stored inside the `useCounter` hook using React's `useState`. A global store (like Redux) wasn't needed since this is a single-screen app. `useRef` is used for timer handles so they don't trigger unnecessary re-renders.

## Features

**Basic**
- Increment, Decrement, Reset buttons
- Counter display

**Non-trivial behaviours**
- Every 5th increment adds +5 instead of +1
- Decrement cannot go below 0
- Auto-decrements after 3 seconds of inactivity
- Reset gradually brings value to 0 (not an instant jump)

**Extras**
- Long-press + or − for rapid changes
- History of last 10 values
- Stats panel (total increments, bonus count)

**Avoiding unnecessary re-renders:** All action functions are wrapped in `useCallback` with stable dependency arrays so React doesn't recreate them on every render.
