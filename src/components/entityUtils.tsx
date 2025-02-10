// src/utils/entityUtils.ts
import { Entity, PointGraphics, EntityDescription } from 'resium';
import { Cartesian3 } from 'cesium';
import { convertToTLE } from './tleUtils';
import { getSatelliteInfo } from 'tle.js';
import { activeSatData } from '../activeSatData';
import InfoRow from './InfoRow';
import { SetStateAction } from 'react';

export const updateEntities = (setEntities: { (value: SetStateAction<JSX.Element[]>): void; (arg0: JSX.Element[]): void; }) => {
  const newEntities = activeSatData.slice(0, 1900).map((sat, index) => {
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
        name="Orbital Elements"
        // point={{ pixelSize: 10 }}
      >
        <PointGraphics pixelSize={2} />
        <EntityDescription>
          <h1>{sat.OBJECT_NAME}</h1>
          <hr style={{ border: '1px solid lightgray' }} />
          <div className='orbit-elems'>
            <InfoRow label="NORAD ID" value={sat.NORAD_CAT_ID} />
            <InfoRow label="Launch Year" value={sat.OBJECT_ID.slice(0, 4)} />
            <InfoRow label="Inclination" value={sat.INCLINATION} />
            <InfoRow label="Right Ascension" value={sat.RA_OF_ASC_NODE} />
            <InfoRow label="Mean Motion" value={sat.MEAN_MOTION} />
            <InfoRow label="Epoch" value={sat.EPOCH} />
            <InfoRow label="Latitude" value={lat.toFixed(2)} />
            <InfoRow label="Longitude" value={lng.toFixed(2)} />
            <InfoRow label="Altitude" value={`${height.toFixed(2)} km`} />
          </div>
        </EntityDescription>
      </Entity>
    );
  });

  setEntities(newEntities.filter((entity): entity is JSX.Element => entity !== null));
};