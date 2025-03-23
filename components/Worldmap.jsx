import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import React, { useEffect, useState } from "react";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map country names from your sales data to ISO Alpha-3 codes
const countryMappings = {
  UK: "GBR",
  Germany: "DEU",
  USA: "USA",
  India: "IND",
  France: "FRA",
  Canada: "CAN",
  Australia: "AUS",
};

const WorldMap = ({ salesData }) => {
  const [highlightedCountries, setHighlightedCountries] = useState(new Set());

  useEffect(() => {
    if (salesData?.length > 0) {
      const uniqueCountries = new Set(
        salesData
          .map((sale) => countryMappings[sale.Region]) // Convert Region to ISO code
          .filter(Boolean) // Remove undefined values
      );
      setHighlightedCountries(uniqueCountries);
    }
  }, [salesData]);

  return (
    <div className="w-full h-64">
      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryISO = geo.properties.ISO_A3;
              const isHighlighted = highlightedCountries.has(countryISO);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? "#FF5733" : "#E0E0E0"} // Highlights customer countries
                  stroke="#FFF"
                  strokeWidth={0.5}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
