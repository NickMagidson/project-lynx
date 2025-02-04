// src/utils/tleUtils.ts
import { getSatelliteInfo } from 'tle.js';

export interface Satellite {
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

export const convertToTLE = (sat: Satellite): [string, string] => {
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

export const getSatellitePosition = (sat: Satellite) => {
  const tle = convertToTLE(sat);
  const observationDate = new Date().getTime();
  return getSatelliteInfo(tle, observationDate);
};
