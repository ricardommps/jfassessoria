'use client';

import polyline from '@mapbox/polyline';
import { Box, Card } from '@mui/material';
import L from 'leaflet';
import React, { useMemo } from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

// Corrige ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function ActivityMap({ encodedPolyline }) {
  const coordinates = useMemo(() => {
    if (!encodedPolyline) return [];

    const decoded = polyline.decode(encodedPolyline);

    return decoded.map(([lat, lng]) => [lat, lng]);
  }, [encodedPolyline]);

  if (coordinates.length < 2) return null;

  const center = coordinates[0];

  return (
    <Card elevation={3}>
      <Box p={2}>
        <MapContainer
          center={center}
          zoom={13}
          style={{
            height: '200px',
            width: '100%',
            borderRadius: '16px',
          }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={coordinates}
            pathOptions={{
              color: '#FC4C02', // cor estilo Strava
              weight: 4,
            }}
          />

          <Marker position={coordinates[0]} />
          <Marker position={coordinates[coordinates.length - 1]} />
        </MapContainer>
      </Box>
    </Card>
  );
}
