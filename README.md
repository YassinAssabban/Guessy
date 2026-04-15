# Countries of the World Quiz

A React + TypeScript quiz game inspired by JetPunk where players try to name all 196 countries in the quiz before the timer ends.


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

- Score and progress tracking (`x/196`)
- 15-minute countdown timer
- Improved world map coverage using a no-Antarctica dataset
- Micro-state / island markers (to make small countries visible)
- Denmark also highlights Greenland on the map
- Give up button to reveal all countries
- Reset flow to start over quickly

## Countries list

The quiz now contains **196 entries**:
- 193 UN member states
- Palestine
- Vatican City
- Kosovo

=======
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
