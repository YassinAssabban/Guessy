import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { createCountryLookup, normalizeCountryInput, resolveCountryName } from '../core/validator';

type MapProps = {
  foundCountries: Set<string>;
};

type MapFeatureProperties = {
  NAME?: string;
  NAME_EN?: string;
  ADMIN?: string;
  name?: string;
  ISO_A3?: string;
  iso_a3?: string;
  ADM0_A3?: string;
};

type SmallCountryMarker = {
  country: string;
  coordinates: [number, number];
};

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

const lookup = createCountryLookup();

const MAP_NAME_OVERRIDES: Record<string, string> = {
  [normalizeCountryInput('Dem. Rep. Congo')]: 'Democratic Republic of the Congo',
  [normalizeCountryInput('Congo')]: 'Congo',
  [normalizeCountryInput('Central African Rep.')]: 'Central African Republic',
  [normalizeCountryInput('Eq. Guinea')]: 'Equatorial Guinea',
  [normalizeCountryInput('S. Sudan')]: 'South Sudan',
  [normalizeCountryInput('Bosnia and Herz.')]: 'Bosnia and Herzegovina',
  [normalizeCountryInput('Dominican Rep.')]: 'Dominican Republic',
  [normalizeCountryInput('eSwatini')]: 'Eswatini',
  [normalizeCountryInput('Côte d’Ivoire')]: "Cote d'Ivoire",
  [normalizeCountryInput('Cote d Ivoire')]: "Cote d'Ivoire"
};

const ISO_TO_COUNTRY: Record<string, string> = {
  COD: 'Democratic Republic of the Congo',
  COG: 'Congo',
  CIV: "Cote d'Ivoire",
  SWZ: 'Eswatini',
  TLS: 'Timor-Leste',
  MKD: 'North Macedonia',
  TUR: 'Turkey',
  KOS: 'Kosovo',
  PSE: 'Palestine',
  VAT: 'Vatican City',
  GRL: 'Denmark'
};

const SMALL_COUNTRY_MARKERS: SmallCountryMarker[] = [
  { country: 'Antigua and Barbuda', coordinates: [-61.8, 17.1] },
  { country: 'Bahamas', coordinates: [-77.4, 25.03] },
  { country: 'Barbados', coordinates: [-59.55, 13.19] },
  { country: 'Cabo Verde', coordinates: [-23.6, 15.1] },
  { country: 'Comoros', coordinates: [43.3, -11.7] },
  { country: 'Dominica', coordinates: [-61.36, 15.41] },
  { country: 'Fiji', coordinates: [178.06, -17.71] },
  { country: 'Grenada', coordinates: [-61.68, 12.12] },
  { country: 'Kiribati', coordinates: [-157.4, 1.9] },
  { country: 'Maldives', coordinates: [73.5, 3.2] },
  { country: 'Malta', coordinates: [14.37, 35.94] },
  { country: 'Marshall Islands', coordinates: [171.18, 7.13] },
  { country: 'Mauritius', coordinates: [57.55, -20.2] },
  { country: 'Micronesia', coordinates: [158.2, 6.9] },
  { country: 'Nauru', coordinates: [166.93, -0.52] },
  { country: 'Palau', coordinates: [134.48, 7.5] },
  { country: 'Saint Kitts and Nevis', coordinates: [-62.73, 17.36] },
  { country: 'Saint Lucia', coordinates: [-60.98, 13.91] },
  { country: 'Saint Vincent and the Grenadines', coordinates: [-61.2, 13.25] },
  { country: 'Samoa', coordinates: [-172.1, -13.75] },
  { country: 'Sao Tome and Principe', coordinates: [6.73, 0.2] },
  { country: 'Seychelles', coordinates: [55.45, -4.68] },
  { country: 'Singapore', coordinates: [103.82, 1.35] },
  { country: 'Solomon Islands', coordinates: [160.2, -9.6] },
  { country: 'Tonga', coordinates: [-175.2, -21.17] },
  { country: 'Trinidad and Tobago', coordinates: [-61.23, 10.51] },
  { country: 'Tuvalu', coordinates: [179.19, -8.51] },
  { country: 'Vanuatu', coordinates: [167.7, -16.3] },
  { country: 'Vatican City', coordinates: [12.45, 41.9] }
];

const resolveMapCountry = (properties: MapFeatureProperties): string | null => {
  const isoCode = properties.ISO_A3 ?? properties.iso_a3 ?? properties.ADM0_A3;
  if (isoCode && ISO_TO_COUNTRY[isoCode]) {
    return ISO_TO_COUNTRY[isoCode];
  }

  const label = properties.NAME_EN ?? properties.NAME ?? properties.ADMIN ?? properties.name;
  if (!label) {
    return null;
  }

  const normalized = normalizeCountryInput(label);
  if (MAP_NAME_OVERRIDES[normalized]) {
    return MAP_NAME_OVERRIDES[normalized];
  }

  return resolveCountryName(label, lookup);
};

export const Map = ({ foundCountries }: MapProps) => (
  <section className="card map-card">
    <h2>World Map</h2>
    <div className="map-container">
      <ComposableMap projectionConfig={{ scale: 150 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies
              .filter((geo: any) => {
                const properties = geo.properties as MapFeatureProperties;
                const label = properties.NAME_EN ?? properties.NAME ?? properties.ADMIN ?? properties.name;
                return normalizeCountryInput(String(label ?? '')) !== 'antarctica';
              })
              .map((geo: any) => {
                const canonicalName = resolveMapCountry(geo.properties as MapFeatureProperties);
                const isFound = canonicalName ? foundCountries.has(canonicalName) : false;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isFound ? '#22c55e' : '#e2e8f0',
                        outline: 'none',
                        stroke: '#94a3b8',
                        strokeWidth: 0.45
                      },
                      hover: {
                        fill: isFound ? '#16a34a' : '#cbd5e1',
                        outline: 'none'
                      },
                      pressed: {
                        fill: isFound ? '#15803d' : '#94a3b8',
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
          }
        </Geographies>

        {SMALL_COUNTRY_MARKERS.map((marker) => {
          const isFound = foundCountries.has(marker.country);

          return (
            <Marker key={marker.country} coordinates={marker.coordinates}>
              <circle
                r={3.8}
                fill={isFound ? '#22c55e' : '#ffffff'}
                stroke={isFound ? '#15803d' : '#334155'}
                strokeWidth={1.2}
              />
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  </section>
);
