import axios from 'axios';

const BASE_URL = 'https://celestrak.org/NORAD/elements/gp.php';

export const fetchSatelliteData = async (group) => {
  try {
    const response = await axios.get(`${BASE_URL}?GROUP=${group}&FORMAT=JSON`);
    return response.data;
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    throw error;
  }
};