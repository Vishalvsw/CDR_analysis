
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { CdrRecord, GeoPoint } from '../types';
import AnalysisCard from './AnalysisCard';

interface LocationMapProps {
  data: CdrRecord[];
}

const LocationMap: React.FC<LocationMapProps> = ({ data }) => {
    const geoPoints = useMemo<GeoPoint[]>(() => {
        const pointMap = new Map<string, GeoPoint>();
        data.forEach(record => {
            const latLongStr = record['lat-long-azimuth(firstcellid)'] as string;
            if (latLongStr && typeof latLongStr === 'string') {
                const parts = latLongStr.split(',');
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);

                if (!isNaN(lat) && !isNaN(lng)) {
                    const key = `${lat},${lng}`;
                    if (pointMap.has(key)) {
                        pointMap.get(key)!.count += 1;
                    } else {
                        pointMap.set(key, { lat, lng, count: 1 });
                    }
                }
            }
        });
        return Array.from(pointMap.values());
    }, [data]);

    if (geoPoints.length === 0) {
        return (
            <AnalysisCard title="Location Analysis (Cell ID)">
                <div className="flex items-center justify-center h-full text-slate-400">
                    No valid latitude/longitude data found in the 'Lat-Long-Azimuth (First CellID)' column.
                </div>
            </AnalysisCard>
        );
    }
    
    // Calculate center of map
    const centerLat = geoPoints.reduce((sum, p) => sum + p.lat, 0) / geoPoints.length;
    const centerLng = geoPoints.reduce((sum, p) => sum + p.lng, 0) / geoPoints.length;


    return (
        <AnalysisCard title="Location Analysis (Cell ID)">
            <MapContainer center={[centerLat, centerLng]} zoom={6} scrollWheelZoom={true} className="leaflet-container">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {geoPoints.map((point, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[point.lat, point.lng]}
                        radius={Math.min(5 + Math.log(point.count) * 2, 20)} // Scale radius by call count
                        pathOptions={{ color: '#ec4899', fillColor: '#ec4899', fillOpacity: 0.6 }}
                    >
                        <Popup>
                           <strong>Location:</strong> {point.lat.toFixed(4)}, {point.lng.toFixed(4)}<br />
                           <strong>Calls:</strong> {point.count.toLocaleString()}
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </AnalysisCard>
    );
};

export default LocationMap;
