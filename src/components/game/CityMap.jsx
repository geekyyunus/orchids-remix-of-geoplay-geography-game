
"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { feature } from "topojson-client";
import { CITIES_DATA, MAP_URLS } from "../../lib/geoData";

export default function CityMap({ onMapReady, onCityClick, target, showHint }) {
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    // Load world map as background
    fetch(MAP_URLS.world)
      .then((res) => res.json())
      .then((data) => {
        const countries = feature(data, data.objects.countries).features;
        setGeographies(countries);
        onMapReady(CITIES_DATA);
      });
  }, [onMapReady]);

  return (
    <div className="w-full h-full bg-sky-50 dark:bg-sky-950/20 rounded-3xl overflow-hidden border border-border shadow-inner relative">
      <ComposableMap projectionConfig={{ scale: 140 }}>
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#E2E8F0", outline: "none" },
                    hover: { fill: "#E2E8F0", outline: "none" },
                    pressed: { fill: "#E2E8F0", outline: "none" },
                  }}
                  className="stroke-white dark:stroke-slate-800 stroke-[0.5px]"
                />
              ))
            }
          </Geographies>
          {CITIES_DATA.map((city) => {
            const isTarget = target && city.name === target.name;
            const isHinted = showHint && isTarget;

            return (
              <Marker key={city.name} coordinates={[city.lng, city.lat]}>
                <circle
                  r={isHinted ? 8 : 4}
                  fill={isHinted ? "#F59E0B" : "#F43F5E"}
                  stroke="#fff"
                  strokeWidth={2}
                  className="cursor-pointer hover:scale-150 transition-transform"
                  onClick={() => onCityClick(city)}
                />
                {showHint && isTarget && (
                  <text
                    textAnchor="middle"
                    y={-15}
                    className="text-[10px] font-bold fill-primary dark:fill-white"
                  >
                    {city.name}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md pointer-events-none">
        Use scroll to zoom, drag to pan
      </div>
    </div>
  );
}
