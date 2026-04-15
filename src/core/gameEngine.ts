import { TOTAL_COUNTRIES, countries } from './countries';
import { calculateProgressPercentage, calculateScore } from './scoring';
import { createCountryLookup, type CountryLookup, validateCountryGuess } from './validator';

export const GAME_DURATION_SECONDS = 15 * 60;

export type GameStatus = 'idle' | 'playing' | 'completed' | 'gave_up';

export type GameSnapshot = {
  foundCountries: Set<string>;
  score: number;
  progress: number;
  remainingSeconds: number;
  status: GameStatus;
};

export type GuessResult = {
  accepted: boolean;
  countryName: string | null;
};

export type GameContext = {
  lookup: CountryLookup;
};

export const createGameContext = (): GameContext => ({
  lookup: createCountryLookup()
});

export const createInitialSnapshot = (): GameSnapshot => ({
  foundCountries: new Set<string>(),
  score: 0,
  progress: 0,
  remainingSeconds: GAME_DURATION_SECONDS,
  status: 'idle'
});

export const startGame = (snapshot: GameSnapshot): GameSnapshot => ({
  ...snapshot,
  status: 'playing'
});

export const submitGuess = (
  guess: string,
  snapshot: GameSnapshot,
  context: GameContext
): { snapshot: GameSnapshot; result: GuessResult } => {
  if (snapshot.status !== 'playing') {
    return {
      snapshot,
      result: { accepted: false, countryName: null }
    };
  }

  const validation = validateCountryGuess(guess, context.lookup, snapshot.foundCountries);
  if (!validation.isValid) {
    return {
      snapshot,
      result: { accepted: false, countryName: null }
    };
  }

  const foundCountries = new Set(snapshot.foundCountries);
  foundCountries.add(validation.countryName);

  const score = calculateScore(foundCountries.size);
  const progress = calculateProgressPercentage(foundCountries.size);
  const hasFinished = foundCountries.size === TOTAL_COUNTRIES;

  return {
    snapshot: {
      ...snapshot,
      foundCountries,
      score,
      progress,
      status: hasFinished ? 'completed' : snapshot.status
    },
    result: { accepted: true, countryName: validation.countryName }
  };
};

export const tick = (snapshot: GameSnapshot): GameSnapshot => {
  if (snapshot.status !== 'playing') {
    return snapshot;
  }

  if (snapshot.remainingSeconds <= 1) {
    return {
      ...snapshot,
      remainingSeconds: 0,
      status: 'completed'
    };
  }

  return {
    ...snapshot,
    remainingSeconds: snapshot.remainingSeconds - 1
  };
};

export const giveUp = (snapshot: GameSnapshot): GameSnapshot => ({
  ...snapshot,
  foundCountries: new Set(countries.map((country) => country.name)),
  score: TOTAL_COUNTRIES,
  progress: 100,
  status: 'gave_up'
});
