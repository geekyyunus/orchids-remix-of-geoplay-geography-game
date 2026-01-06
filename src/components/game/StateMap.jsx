
"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";

export default function StateMap({ onMapReady, onStateClick, target, showHint, country }) {
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    if (!country) return;

    fetch(country.url)
      .then((res) => res.json())
      .then((data) => {
        let states;
        if (country.id === "usa") {
          states = feature(data, data.objects.states).features;
        } else {
          // India and others
          const objectKey = Object.keys(data.objects)[0];
          states = feature(data, data.objects[objectKey]).features;
        }
        
        setGeographies(states);
        onMapReady(states.map(d => ({ 
          name: d.properties.name || d.properties.NAME || d.properties.ST_NM, 
          id: d.id || d.properties.name 
        })));
      });
  }, [country, onMapReady]);

  if (!country) return null;

  return (
    <div className="w-full h-full flex items-center justify-center bg-sky-50 dark:bg-sky-950/20 rounded-3xl overflow-hidden border border-border shadow-inner">
      <ComposableMap 
        projection={country.id === "usa" ? "geoAlbersUsa" : "geoMercator"}
        projectionConfig={country.id === "usa" ? {} : { scale: country.id === "india" ? 800 : 100, center: country.id === "india" ? [78, 22] : [0, 0] }}
      >
        <Geographies geography={geographies}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name || geo.properties.NAME || geo.properties.ST_NM;
              const isTarget = target && (name === target.name);
              const isHinted = showHint && isTarget;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onStateClick(geo)}
                  style={{
                    default: {
                      fill: isHinted ? "#F59E0B" : "#D1D5DB",
                      outline: "none",
                      transition: "all 250ms",
                    },
                    hover: {
                      fill: "#10B981",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#059669",
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
