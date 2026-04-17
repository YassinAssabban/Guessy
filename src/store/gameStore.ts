import { create } from 'zustand';
import {
  MAX_PAUSES,
  createGameContext,
  createInitialSnapshot,
  giveUp,
  pauseGame,
  resumeGame,
  setNoTimeMode,
  startGame,
  submitGuess,
  tick,
  type GameSnapshot,
  type GameStatus
} from '../core/gameEngine';
import { TOTAL_COUNTRIES } from '../core/countries';

const context = createGameContext();

type GameStore = GameSnapshot & {
  totalCountries: number;
  lastAcceptedCountry: string | null;
  showMissingCountries: boolean;
  pausesRemaining: number;
  startTimed: () => void;
  startNoTime: () => void;
  enableNoTimeMode: () => void;
  togglePause: () => void;
  submit: (guess: string) => boolean;
  tickTimer: () => void;
  revealAll: () => void;
  revealMissingCountries: () => void;
  reset: () => void;
};

const initialSnapshot = createInitialSnapshot();

export const useGameStore = create<GameStore>((set) => ({
  ...initialSnapshot,
  totalCountries: TOTAL_COUNTRIES,
  lastAcceptedCountry: null,
  showMissingCountries: false,
  pausesRemaining: MAX_PAUSES,
  startTimed: () =>
    set((state) => {
      const nextSnapshot = startGame(state, false);
      return {
        ...nextSnapshot,
        lastAcceptedCountry: null,
        showMissingCountries: false,
        pausesRemaining: MAX_PAUSES - nextSnapshot.pausesUsed
      };
    }),
  startNoTime: () =>
    set((state) => {
      const nextSnapshot = startGame(state, true);
      return {
        ...nextSnapshot,
        lastAcceptedCountry: null,
        showMissingCountries: false,
        pausesRemaining: MAX_PAUSES
      };
    }),
  enableNoTimeMode: () =>
    set((state) => {
      const nextSnapshot = setNoTimeMode(state);
      return {
        ...nextSnapshot,
        pausesRemaining: MAX_PAUSES - nextSnapshot.pausesUsed
      };
    }),
  togglePause: () =>
    set((state) => {
      const nextSnapshot = state.status === 'paused' ? resumeGame(state) : pauseGame(state);
      return {
        ...nextSnapshot,
        pausesRemaining: MAX_PAUSES - nextSnapshot.pausesUsed
      };
    }),
  submit: (guess) => {
    let accepted = false;

    set((state) => {
      const { snapshot, result } = submitGuess(guess, state, context);
      accepted = result.accepted;

      return {
        ...snapshot,
        lastAcceptedCountry: result.countryName,
        pausesRemaining: MAX_PAUSES - snapshot.pausesUsed
      };
    });

    return accepted;
  },
  tickTimer: () =>
    set((state) => {
      const nextSnapshot = tick(state);
      const shouldRevealMissing =
        nextSnapshot.status === 'completed' && nextSnapshot.foundCountries.size < TOTAL_COUNTRIES;

      return {
        ...nextSnapshot,
        lastAcceptedCountry: state.lastAcceptedCountry,
        showMissingCountries: shouldRevealMissing ? true : state.showMissingCountries,
        pausesRemaining: MAX_PAUSES - nextSnapshot.pausesUsed
      };
    }),
  revealAll: () =>
    set((state) => ({
      ...giveUp(state),
      showMissingCountries: true,
      pausesRemaining: MAX_PAUSES - state.pausesUsed
    })),
  revealMissingCountries: () => set(() => ({ showMissingCountries: true })),
  reset: () =>
    set(() => ({
      ...createInitialSnapshot(),
      totalCountries: TOTAL_COUNTRIES,
      lastAcceptedCountry: null,
      showMissingCountries: false,
      pausesRemaining: MAX_PAUSES
    }))
}));

export const isGameActive = (status: GameStatus): boolean => status === 'playing';
