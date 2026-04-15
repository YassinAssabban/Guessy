# Countries of the World Quiz

A React + TypeScript quiz game inspired by JetPunk where players try to name all 193 UN member states before the timer ends.

## Stack

- React (hooks)
- Zustand (global state)
- TypeScript
- Vite
- `react-simple-maps` for the interactive world map

## Project structure

```txt
src/
  core/
    countries.ts
    validator.ts
    gameEngine.ts
    scoring.ts
  store/
    gameStore.ts
  components/
    Map.tsx
    Input.tsx
    Score.tsx
    Timer.tsx
  pages/
    Game.tsx
```

## Features

- Real-time country validation with aliases (`USA`, `United States`, etc.)
- Duplicate prevention
- Score and progress tracking (`x/193`)
- 15-minute countdown timer
- Interactive world map with found countries highlighted
- Give up button to reveal all countries
- Reset flow to start over quickly

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```
