import { Viewer, Entity, PointGraphics, EntityDescription } from 'resium';
import { Cartesian3, Ion } from 'cesium';
import './App.css';
import { useEffect, useState } from 'react';
import { getSatelliteInfo } from 'tle.js';

// Calculates Data from TLE API

// Mock JSON data in the new format
const mockSatData = [
  {
    "@context": "https://www.w3.org/ns/hydra/context.jsonld",
    "@id": "https://tle.ivanstanojevic.me/api/tle/25544",
    "@type": "Tle",
    "satelliteId": 25544,
    "name": "ISS (ZARYA)",
    "date": "2025-01-19T06:36:19+00:00",
    "line1": "1 25544U 98067A   25021.64298662  .00029436  00000+0  51543-3 0  9997",
    "line2": "2 25544  51.6409 312.9268 0002244 106.4400 316.7944 15.50350408492432"  ,
  },
  {
    "@context": "https://www.w3.org/ns/hydra/context.jsonld",
    "@id": "https://tle.ivanstanojevic.me/api/tle/40075",
    "@type": "Tle",
    "satelliteId": 40075,
    "name": "AISSAT 2",
    "date": "2023-12-28T11:59:02+00:00",
    "line1": "1 40075U 14037G   23362.49933056  .00003465  00000+0  40707-3 0  9994",
    "line2": "2 40075  98.3401 268.4723 0004780 335.0232  25.0749 14.85601820512563"
  }
  
  // Add more TLE JSON objects if needed
];

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmU4MzM0Mi0xN2EyLTQ1MTUtOTJlYi02YzVhMjQ2Njc5NGQiLCJpZCI6MjQ3MDA3LCJpYXQiOjE3Mjg1MTg3MjJ9.yPRy0QbCHvLMNl8PPKBHHR_fIzpWmkUAsmvnSuDod_U';

const App = () => {
  const [entities, setEntities] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const updateEntities = () => {
      const newEntities = mockSatData.map((sat, index) => {
        const { name, line1, line2 } = sat;
        const observationDate = new Date().getTime();

        const satInfo = getSatelliteInfo([line1, line2], observationDate);
        if (!satInfo) {
          console.warn(`Failed to process satellite: ${name}`);
          return null;
        }

        const { lat, lng, height } = satInfo; // `height` is the altitude in kilometers

        return (
          <Entity
            key={index}
            position={Cartesian3.fromDegrees(lng, lat, height * 1000)} // Convert km to meters
            point={{ pixelSize: 10 }}
          >
            <PointGraphics pixelSize={10} />
            <EntityDescription>
              <h1>{name}</h1>
              <p>Latitude: {lat.toFixed(2)}</p>
              <p>Longitude: {lng.toFixed(2)}</p>
              <p>Altitude: {height.toFixed(2)} km</p>
            </EntityDescription>
          </Entity>
        );
      });

      setEntities(newEntities.filter((entity): entity is JSX.Element => entity !== null));
    };

    updateEntities(); // Initial call
    const intervalId = setInterval(updateEntities, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <Viewer animation={false} timeline={false} full>
      {entities}
    </Viewer>
  );
};

export default App;
