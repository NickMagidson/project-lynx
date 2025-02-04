// src/utils/entityUtils.ts
import { Entity, PointGraphics, EntityDescription } from 'resium';
import { Cartesian3 } from 'cesium';
import { Satellite, getSatellitePosition } from './tleUtils';

export const createEntities = (satelliteData: Satellite[]): JSX.Element[] => {
  return satelliteData.slice(0, 1900).map((sat, index) => {
    const satInfo = getSatellitePosition(sat);
    if (!satInfo) {
      console.warn(`Failed to process satellite: ${sat.OBJECT_NAME}`);
      return null;
    }

    const { lat, lng, height } = satInfo;

    return (
      <Entity key={index} position={Cartesian3.fromDegrees(lng, lat, height * 1000)}>
        <PointGraphics pixelSize={2} />
        <EntityDescription>
          <h1>{sat.OBJECT_NAME}</h1>
          <p>Latitude: {lat.toFixed(2)}</p>
          <p>Longitude: {lng.toFixed(2)}</p>
          <p>Altitude: {height.toFixed(2)} km</p>
        </EntityDescription>
      </Entity>
    );
  }).filter((entity): entity is JSX.Element => entity !== null);
};
