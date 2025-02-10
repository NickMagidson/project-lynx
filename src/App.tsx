import { Viewer } from 'resium';
import { Ion } from 'cesium';
import './App.css';
import { useEffect, useState } from 'react';
// import { fetchSatelliteData } from './api';
import About from './About';
import { updateEntities } from './components/entityUtils';

// API now pulls ACTIVE satellites and can change GROUPS
// So far fetching speed is an issue. Error 403

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmU4MzM0Mi0xN2EyLTQ1MTUtOTJlYi02YzVhMjQ2Njc5NGQiLCJpZCI6MjQ3MDA3LCJpYXQiOjE3Mjg1MTg3MjJ9.yPRy0QbCHvLMNl8PPKBHHR_fIzpWmkUAsmvnSuDod_U';


const App = () => {
  const [entities, setEntities] = useState<JSX.Element[]>([]);  
  // const [activeSatData, setActiveSatData] = useState<Satellite[]>([]);

  // const groups = ['STARLINK', 'Beidou', 'GEO', 'IRIDIUM', 'COSMOS', 'GPS', 'GALILEO', 'GLONASS', 'BEIDOU', 'SBAS', 'SCN', 'AMATEUR', 'X-COMM', 'OTHER'];


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchSatelliteData('ACTIVE'); // Replace 'STARLINK' with the desired group
  //       setActiveSatData(data);
  //     } catch (error) {
  //       console.error('Error fetching satellite data:', error);
  //     }
  //   };

  //   fetchData();
  //   // console.log(JSON.stringify(activeSatData));
  // }, [activeSatData]);


  useEffect(() => {
    updateEntities(setEntities); // Initial call
    const intervalId = setInterval(updateEntities, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <>
      <Viewer animation={false} timeline={false} full>
        {entities}
      </Viewer>
      <About />
    </>

  );
};

export default App;