import { Viewer, Entity, PointGraphics, EntityDescription } from 'resium';
import { Cartesian3, Ion } from 'cesium';
import './App.css';
import { act, useEffect, useState } from 'react';
import { getSatelliteInfo } from 'tle.js';
// import { activeSatData } from './activeSatData'; ACTIVE file
import { fetchSatelliteData } from './api';

// API now pulls ACTIVE satellites and can change GROUPS
// So far fetching speed is an issue. Error 403

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmU4MzM0Mi0xN2EyLTQ1MTUtOTJlYi02YzVhMjQ2Njc5NGQiLCJpZCI6MjQ3MDA3LCJpYXQiOjE3Mjg1MTg3MjJ9.yPRy0QbCHvLMNl8PPKBHHR_fIzpWmkUAsmvnSuDod_U';



// Function to convert JSON to TLE lines
interface Satellite {
  NORAD_CAT_ID: number;
  OBJECT_ID: string;
  EPOCH: string;
  INCLINATION: number;
  RA_OF_ASC_NODE: number;
  ECCENTRICITY: number;
  ARG_OF_PERICENTER: number;
  MEAN_ANOMALY: number;
  MEAN_MOTION: number;
  OBJECT_NAME: string;
}

const convertToTLE = (sat: Satellite): [string, string] => {
  const line1 = `1 ${sat.NORAD_CAT_ID.toString().padStart(5, '0')}U ${sat.OBJECT_ID.slice(0, 8)} ${sat.EPOCH.slice(2, 8)}.${Math.floor(
    (new Date(sat.EPOCH).getTime() % 86400000) / 86400
  ).toString().padStart(8, '0')}  .00000000  00000-0  00000-0 0  9990`;
  const line2 = `2 ${sat.NORAD_CAT_ID.toString().padStart(5, '0')} ${sat.INCLINATION.toFixed(4).padStart(8, ' ')} ${sat.RA_OF_ASC_NODE.toFixed(4).padStart(
    8,
    ' '
  )} ${sat.ECCENTRICITY.toString().slice(2, 8).padStart(7, '0')} ${sat.ARG_OF_PERICENTER.toFixed(4).padStart(8, ' ')} ${sat.MEAN_ANOMALY.toFixed(4).padStart(
    8,
    ' '
  )} ${sat.MEAN_MOTION.toFixed(8).padStart(11, ' ')}`;

  return [line1, line2];
};

const App = () => {
  const [entities, setEntities] = useState<JSX.Element[]>([]);  
  const [activeSatData, setActiveSatData] = useState<Satellite[]>([]);

  const groups = ['STARLINK', 'Beidou', 'GEO', 'IRIDIUM', 'COSMOS', 'GPS', 'GALILEO', 'GLONASS', 'BEIDOU', 'SBAS', 'SCN', 'AMATEUR', 'X-COMM', 'OTHER'];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSatelliteData('ACTIVE'); // Replace 'STARLINK' with the desired group
        setActiveSatData(data);
      } catch (error) {
        console.error('Error fetching satellite data:', error);
      }
    };

    fetchData();
    // console.log(JSON.stringify(activeSatData));
  }, [activeSatData]);


  useEffect(() => {
    const updateEntities = () => {
      const newEntities = activeSatData.slice(0, 600).map((sat, index) => {
        const tle = convertToTLE(sat);
        const observationDate = new Date().getTime();

        const satInfo = getSatelliteInfo(tle, observationDate);
        if (!satInfo) {
          console.warn(`Failed to process satellite: ${sat.OBJECT_NAME}`);
          return null;
        }

        const { lat, lng, height } = satInfo;

        return (
          <Entity
            key={index}
            position={Cartesian3.fromDegrees(lng, lat, height * 1000)} // Convert km to meters
            // point={{ pixelSize: 10 }}
          >
            <PointGraphics pixelSize={2} />
            <EntityDescription>
              <h1>{sat.OBJECT_NAME}</h1>
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
    const intervalId = setInterval(updateEntities, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [activeSatData]);

  return (
    <Viewer animation={false} timeline={false} full>
      {entities}
    </Viewer>
  );
};

export default App;