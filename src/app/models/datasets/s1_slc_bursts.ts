import { Props } from '../filters.model';

export const s1_slc_bursts = {
  id: 'SENTINEL-1',
  name: 'S1 SLC Bursts',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.SUBTYPE,
    Props.BASELINE_TOOL,
  ],
  apiValue: { processingLevel: 'S1_SLC_BURSTS' },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/sentinel-1/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/sentinel-1/sentinel-1-how-to-cite/',
  frequency: 'C-Band',
  source: {
    name: 'ESA',
    url: 'https://www.esa.int/ESA'
  },
  productTypes: [
    {
      apiValue: 'S1_SLC_BURSTS',
      displayName: 'S1 SLC Bursts'
    },
  ],
  beamModes: [
    'IW', 'EW',
  ],
  polarizations: [
    'VV',
    'VH',
    'HH',
    'HV',
  ],
  subtypes: [{
    displayName: 'Sentinel-1A',
    apiValue: 'SA',
  }, {
    displayName: 'Sentinel-1B',
    apiValue: 'SB',
  }],
  platformDesc: 'Sentinel-1 includes twin satellites that each carry C-band synthetic aperture radar (SAR), ' +
    'together providing all-weather, day-and-night imagery of Earth’s surface.',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
