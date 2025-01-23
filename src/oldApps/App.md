import { Viewer, Entity, PointGraphics, EntityDescription } from 'resium'
import { Cartesian3, Ion } from 'cesium'
import './App.css'
import { useEffect, useState } from 'react';
import { getSatelliteInfo } from "tle.js";
import { mockSatData } from '../mockTLE/mockSatData';

// Pulls data from raw string

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmU4MzM0Mi0xN2EyLTQ1MTUtOTJlYi02YzVhMjQ2Njc5NGQiLCJpZCI6MjQ3MDA3LCJpYXQiOjE3Mjg1MTg3MjJ9.yPRy0QbCHvLMNl8PPKBHHR_fIzpWmkUAsmvnSuDod_U';

const App = () => {
  
  const [entities, setEntities] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const updateEntities = () => {
    const tleArray = mockSatData

    const newEntities = tleArray.map((tle, index) => {
      const observationDate = new Date().getTime(); // Current time
      const getSatInfo = getSatelliteInfo(tle, observationDate);
      // const latAndLong = getLatLngObj(tle);
      const { lat, lng } = getSatInfo;

      const satName = tle.split('\n')[0].trim(); // Extract satellite name

      return (
        <Entity
          key={index}
          position={Cartesian3.fromDegrees(lng, lat, 400000)}
          point={{ pixelSize: 10 }}
        >
          <PointGraphics pixelSize={10} />
          <EntityDescription>
            <h1>{satName}</h1>
            <p>Latitude: {lat}</p>
            <p>Longitude: {lng}</p>
          </EntityDescription>
        </Entity>
      );
    });

    setEntities(newEntities);
  };

  updateEntities(); // Initial call
  const intervalId = setInterval(updateEntities, 5000); // Update every 5 seconds

  return () => clearInterval(intervalId); // Cleanup on unmount
}, []);
 
  return (
    <Viewer animation={false} timeline={false} full>
      {entities}
    </Viewer>
  )
}

export default App
