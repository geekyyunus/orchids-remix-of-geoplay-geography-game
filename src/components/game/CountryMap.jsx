
"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { MAP_URLS } from "../../lib/geoData";
import { feature } from "topojson-client";

export default function CountryMap({ onMapReady, onCountryClick, target, showHint }) {
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    fetch(MAP_URLS.world)
      .then((res) => res.json())
      .then((data) => {
        const countries = feature(data, data.objects.countries).features;
        // Filter out Antarctica and small islands if needed
        const validCountries = countries.filter(d => d.properties.name !== "Antarctica");
        setGeographies(validCountries);
        onMapReady(validCountries.map(d => ({ name: d.properties.name, id: d.id })));
      });
  }, [onMapReady]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-sky-50 dark:bg-sky-950/20 rounded-3xl overflow-hidden border border-border shadow-inner">
      <ComposableMap projectionConfig={{ scale: 140 }}>
        <Geographies geography={geographies}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isTarget = target && (geo.properties.name === target.name);
              const isHinted = showHint && isTarget;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onCountryClick(geo)}
                  style={{
                    default: {
                      fill: isHinted ? "#F59E0B" : "#D1D5DB",
                      outline: "none",
                      transition: "all 250ms",
                    },
                    hover: {
                      fill: "#6366F1",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#4338CA",
                      outline: "none",
                    },
                  }}
                  className="stroke-white dark:stroke-slate-800 stroke-[0.5px] cursor-pointer"
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
