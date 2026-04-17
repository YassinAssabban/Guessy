import { TOTAL_COUNTRIES } from './countries';

export const calculateScore = (foundCount: number): number => foundCount;

export const calculateProgressPercentage = (foundCount: number): number =>
  Math.round((foundCount / TOTAL_COUNTRIES) * 100);
