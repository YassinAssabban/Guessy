import { countries, type CountryDefinition } from './countries';

export type CountryLookup = {
  aliasToCountry: Map<string, string>;
  countryMap: Map<string, CountryDefinition>;
};

export const normalizeCountryInput = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const createCountryLookup = (): CountryLookup => {
  const aliasToCountry = new Map<string, string>();
  const countryMap = new Map<string, CountryDefinition>();

  countries.forEach((country) => {
    countryMap.set(country.name, country);

    const canonical = normalizeCountryInput(country.name);
    aliasToCountry.set(canonical, country.name);

    country.aliases.forEach((alias) => {
      aliasToCountry.set(normalizeCountryInput(alias), country.name);
    });
  });

  return { aliasToCountry, countryMap };
};

export type ValidationResult =
  | { isValid: true; countryName: string }
  | { isValid: false; countryName: null };

export const resolveCountryName = (guess: string, lookup: CountryLookup): string | null => {
  const normalized = normalizeCountryInput(guess);
  if (!normalized) {
    return null;
  }

  return lookup.aliasToCountry.get(normalized) ?? null;
};

export const validateCountryGuess = (
  guess: string,
  lookup: CountryLookup,
  foundCountries: Set<string>
): ValidationResult => {
  const normalized = normalizeCountryInput(guess);
  if (!normalized) {
    return { isValid: false, countryName: null };
  }

  const countryName = resolveCountryName(guess, lookup);
  if (!countryName || foundCountries.has(countryName)) {
    return { isValid: false, countryName: null };
  }

  return { isValid: true, countryName };
};
