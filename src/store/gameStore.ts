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
  start: () => void;
  submit: (guess: string) => boolean;
  tickTimer: () => void;
  revealAll: () => void;
  reset: () => void;
};

const initialSnapshot = createInitialSnapshot();

export const useGameStore = create<GameStore>((set) => ({
  ...initialSnapshot,
  totalCountries: TOTAL_COUNTRIES,
  lastAcceptedCountry: null,
  start: () => set((state) => ({ ...startGame(state), lastAcceptedCountry: null })),
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
  tickTimer: () => set((state) => tick(state)),
  revealAll: () => set((state) => giveUp(state)),
  reset: () =>
    set(() => ({
      ...createInitialSnapshot(),
      totalCountries: TOTAL_COUNTRIES,
      lastAcceptedCountry: null
    }))
}));

export const isGameActive = (status: GameStatus): boolean => status === 'playing';
