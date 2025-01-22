import { Viewer, Entity, PointGraphics, EntityDescription } from 'resium';
import { Cartesian3, Ion } from 'cesium';
import './App.css';
import { useEffect, useState } from 'react';
import { getSatelliteInfo } from 'tle.js';

// 1. Calculate the altitude of the satellites
// 2. Fetch the data straight from the API
// 3. Get multiple satellites from sat number range???

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
  // Add more TLE JSON objects if needed
];

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmU4MzM0Mi0xN2EyLTQ1MTUtOTJlYi02YzVhMjQ2Njc5NGQiLCJpZCI6MjQ3MDA3LCJpYXQiOjE3Mjg1MTg3MjJ9.yPRy0QbCHvLMNl8PPKBHHR_fIzpWmkUAsmvnSuDod_U';

const App = () => {
  const [entities, setEntities] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const updateEntities = () => {
      const newEntities = mockSatData.map((sat, index) => {
        const { name, line1, line2 } = sat; // Destructure properties
        const observationDate = new Date().getTime(); // Current time
        const satInfo = getSatelliteInfo([line1, line2], observationDate); // Use tle.js

        if (!satInfo) {
          console.warn(`Failed to process satellite: ${name}`);
          return null;
        }

        const { lat, lng } = satInfo;

        return (
          <Entity
            key={index}
            position={Cartesian3.fromDegrees(lng, lat, 400000)}
            point={{ pixelSize: 10 }}
          >
            <PointGraphics pixelSize={10} />
            <EntityDescription>
              <h1>{name}</h1>
              <p>Latitude: {lat.toFixed(2)}</p>
              <p>Longitude: {lng.toFixed(2)}</p>
            </EntityDescription>
          </Entity>
        );
      });

      setEntities(newEntities.filter((entity): entity is JSX.Element => entity !== null)); // Remove any null entities
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
