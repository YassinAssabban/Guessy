import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { createCountryLookup, resolveCountryName } from '../core/validator';

type MapProps = {
  foundCountries: Set<string>;
};

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const lookup = createCountryLookup();

export const Map = ({ foundCountries }: MapProps) => (
  <section className="card map-card">
    <h2>World Map</h2>
    <div className="map-container">
      <ComposableMap projectionConfig={{ scale: 155 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = String(geo.properties.name ?? '');
              const canonicalName = resolveCountryName(name, lookup);
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
                      strokeWidth: 0.5
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
      </ComposableMap>
    </div>
  </section>
);
