import { Viewer, Entity, PointGraphics, EntityDescription } from 'resium'
import { Cartesian3, Ion } from 'cesium'
import './App.css'
import { useEffect, useState } from 'react';
import { getSatelliteInfo } from "tle.js";

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmU4MzM0Mi0xN2EyLTQ1MTUtOTJlYi02YzVhMjQ2Njc5NGQiLCJpZCI6MjQ3MDA3LCJpYXQiOjE3Mjg1MTg3MjJ9.yPRy0QbCHvLMNl8PPKBHHR_fIzpWmkUAsmvnSuDod_U';

const App = () => {
  const [entities, setEntities] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const tleArray = [
      `CALSPHERE 1             
      1 00900U 64063C   25019.13281612  .00000996  00000+0  10189-2 0  9993
      2 00900  90.2083  60.0673 0026703  52.4224  12.1797 13.75754559   718`,
      `CALSPHERE 2             
      1 00902U 64063E   25018.64704326  .00000069  00000+0  91299-4 0  9996
      2 00902  90.2229  63.8144 0016548 282.4097 203.1371 13.52843174786690`,
      `STELLA                  
      1 22824U 93061B   25019.19733931 -.00000020  00000+0  10691-4 0  9993
      2 22824  98.8486  74.4989 0005402 295.9144 154.6604 14.27447138631602`,
      `ISS (ZARYA)             
      1 25544U 98067A   25019.33553669  .00022923  00000+0  40538-3 0  9997
      2 25544  51.6396 324.3620 0002413 105.9549  30.8533 15.50215631492078`,
      `CSS (TIANHE)            
      1 48274U 21035A   25019.40955077  .00018050  00000+0  23601-3 0  9998
      2 48274  41.4643 205.9066 0003771 317.1998  42.8546 15.58203608212904`,
    ];

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
  }, []);

 
  return (
    <Viewer animation={false} timeline={false} full>
      {entities}
    </Viewer>
  )
}

export default App
