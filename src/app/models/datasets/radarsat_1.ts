import { Props } from '../filters.model';

export const radarsat_1 = {
  id: 'RADARSAT-1',
  name: 'RADARSAT-1',
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.BASELINE_TOOL,
  ],
  apiValue: { platform: 'RADARSAT-1' },
  date: {
    start: new Date('1996/02/01 03:19:17 UTC'),
    end: new Date('2008/05/02 22:05:26 UTC')
  },
  frequency: 'C-Band',
  source: {
    name: 'CSA',
    url: null
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/radarsat-1-2/',
  citationUrl: 'https://www.asf.alaska.edu/how-to-cite-data/',
  productTypes: [{
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [
    'EH3', 'EH4', 'EH6', 'EL1', 'FN1', 'FN2', 'FN3', 'FN4',
    'FN5', 'SNA', 'SNB', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5',
    'ST6', 'ST7', 'SWA', 'SWB', 'WD1', 'WD2', 'WD3'
  ],
  polarizations: [
    'HH'
  ],
  subtypes: [],
};
