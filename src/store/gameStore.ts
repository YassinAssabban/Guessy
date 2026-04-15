import { create } from 'zustand';
import {
  createGameContext,
  createInitialSnapshot,
  giveUp,
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
  start: () => void;
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
  start: () => set((state) => ({ ...startGame(state), lastAcceptedCountry: null, showMissingCountries: false })),
  submit: (guess) => {
    let accepted = false;

    set((state) => {
      const { snapshot, result } = submitGuess(guess, state, context);
      accepted = result.accepted;

      return {
        ...snapshot,
        lastAcceptedCountry: result.countryName
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
        showMissingCountries: shouldRevealMissing ? true : state.showMissingCountries
      };
    }),
  revealAll: () => set((state) => ({ ...giveUp(state), showMissingCountries: true })),
  revealMissingCountries: () => set(() => ({ showMissingCountries: true })),
  reset: () =>
    set(() => ({
      ...createInitialSnapshot(),
      totalCountries: TOTAL_COUNTRIES,
      lastAcceptedCountry: null,
      showMissingCountries: false
    }))
}));

export const isGameActive = (status: GameStatus): boolean => status === 'playing';
