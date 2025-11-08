"use client";

import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { ExchangeServer } from "../types";

interface MapMarkerProps {
  server: ExchangeServer;
  onClick: (server: ExchangeServer) => void;
}

const providerColors = {
  AWS: "#FF9900",
  GCP: "#4285F4",
  Azure: "#0078D4",
};

const createCustomIcon = (color: string) => {
  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M16 0C9.4 0 4 5.4 4 12c0 8 12 28 12 28s12-20 12-28c0-6.6-5.4-12-12-12z" 
              fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="12" r="6" fill="white" opacity="0.9"/>
        <circle cx="16" cy="12" r="4" fill="${color}"/>
      </g>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-map-marker",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

export default function MapMarker({ server, onClick }: MapMarkerProps) {
  const color = providerColors[server.cloudProvider];
  const icon = createCustomIcon(color);

  return (
    <Marker
      position={[server.location.lat, server.location.lon]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(server),
      }}
    >
      <Tooltip direction="top" offset={[0, -42]} opacity={0.95}>
        <div className="text-sm">
          <div className="font-bold">{server.name}</div>
          <div className="text-xs text-gray-600">{server.location.city}</div>
        </div>
      </Tooltip>

      <Popup>
        <div className="text-sm min-w-[200px]">
          <div className="font-bold text-base mb-2">{server.name}</div>
          <div className="text-gray-700 mb-1">
            📍 {server.location.city}, {server.location.country}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{server.cloudProvider}</span>
            <span>•</span>
            <span>{server.region}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
