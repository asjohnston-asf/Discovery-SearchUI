import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FiltersActionType, FiltersActions } from './filters.action';
import * as models from '@models';


export interface FiltersState {
  datasets: DatasetsState;

  dateRange: DateRangeState;

  pathRange: models.Range<number | null>;
  frameRange: models.Range<number | null>;
  season: models.Range<number | null>;
  shouldOmitSearchPolygon: boolean;

  listSearchMode: models.ListSearchType;

  productTypes: models.DatasetProductTypes;
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  flightDirections: Set<models.FlightDirection>;

  maxResults: number;
}

export type DateRangeState = models.Range<null | Date>;

export interface DatasetsState {
  entities: {[id: string]: models.Dataset };
  selected: string;
}

export const initState: FiltersState = {
  datasets: {
    entities: models.datasets.reduce(
      (datasetsObj, dataset) => {
        datasetsObj[dataset.name] = dataset;

        return datasetsObj;
      },
      {}
    ),
    selected: 'SENTINEL-1'
  },
  dateRange: {
    start: null,
    end: null
  },
  season: {
    start: null,
    end: null
  },
  pathRange: {
    start: null,
    end: null
  },
  frameRange: {
    start: null,
    end: null
  },
  shouldOmitSearchPolygon: false,
  listSearchMode: models.ListSearchType.GRANULE,

  productTypes: {},
  beamModes: {},
  polarizations: {},
  flightDirections: new Set<models.FlightDirection>([]),
  maxResults: 101,
};


export function filtersReducer(state = initState, action: FiltersActions): FiltersState {
  switch (action.type) {
    case FiltersActionType.SET_SELECTED_DATASET: {
      const selected = action.payload.toUpperCase();

      return {
        ...state,
        datasets: {
          ...state.datasets,
          selected
        },
        productTypes: {
        },
        beamModes: {
        },
        polarizations: {
        }
      };
    }

    case FiltersActionType.SET_START_DATE: {
      const start = !!action.payload ?
        new Date(action.payload.setHours(0, 0, 0, 0)) :
        action.payload;

      return {
        ...state,
        dateRange: {
          ...state.dateRange, start
        }
      };
    }

    case FiltersActionType.SET_END_DATE: {
      const end = !!action.payload ?
        new Date(action.payload.setHours(23, 59, 59, 999)) :
        action.payload;

      return {
        ...state,
        dateRange: {
          ...state.dateRange, end
        }
      };
    }

    case FiltersActionType.SET_SEASON_START: {
      return {
        ...state,
        season: {
          ...state.season,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_SEASON_END: {
      return {
        ...state,
        season: {
          ...state.season,
          end: action.payload
        }
      };
    }

    case FiltersActionType.CLEAR_DATE_RANGE: {
      return {
        ...state,
        dateRange: initState.dateRange
      };
    }

    case FiltersActionType.CLEAR_SEASON: {
      return {
        ...state,
        season: initState.season
      };
    }

    case FiltersActionType.SET_PATH_START: {
      return {
        ...state,
        pathRange: {
          ...state.pathRange,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_PATH_END: {
      return {
        ...state,
        pathRange: {
          ...state.pathRange,
          end: action.payload
        }
      };
    }

    case FiltersActionType.SET_FRAME_START: {
      return {
        ...state,
        frameRange: {
          ...state.frameRange,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_FRAME_END: {
      return {
        ...state,
        frameRange: {
          ...state.frameRange,
          end: action.payload
        }
      };
    }

    case FiltersActionType.CLEAR_FILTERS: {
      return {
        ...state,
        dateRange: {
          start: null,
          end: null
        },
        season: {
          start: null,
          end: null
        },
        pathRange: {
          start: null,
          end: null
        },
        frameRange: {
          start: null,
          end: null
        },
        shouldOmitSearchPolygon: false,
        listSearchMode: models.ListSearchType.GRANULE,

        productTypes: {},
        beamModes: {},
        polarizations: {},
        flightDirections: new Set<models.FlightDirection>([]),
      };
    }

    case FiltersActionType.USE_SEARCH_POLYGON: {
      return { ...state, shouldOmitSearchPolygon: false };
    }

    case FiltersActionType.OMIT_SEARCH_POLYGON: {
      return { ...state, shouldOmitSearchPolygon: true };
    }

    case FiltersActionType.SET_LIST_SEARCH_TYPE: {
      return {
        ...state,
        listSearchMode: action.payload
      };
    }

    case FiltersActionType.SET_DATASET_PRODUCT_TYPES: {
      return {
        ...state,
        productTypes: { ...state.productTypes, ...action.payload }
      };
    }

    case FiltersActionType.SET_ALL_PRODUCT_TYPES: {
      return {
        ...state,
        productTypes: action.payload
      };
    }

    case FiltersActionType.ADD_BEAM_MODE: {
      const dataset = state.datasets.selected;

      const selectedBeamModes = [
        ...(state.beamModes[dataset] || [])
      ];

      const newModes = Array.from(
        new Set([...selectedBeamModes, action.payload])
      );

      return {
        ...state,
        beamModes: {
          ...state.beamModes,
          ...{ [dataset]: newModes }
        }
      };
    }

    case FiltersActionType.SET_DATASET_BEAM_MODES: {
      return {
        ...state,
        beamModes: { ...state.beamModes, ...action.payload }
      };
    }

    case FiltersActionType.SET_ALL_BEAM_MODES: {
      return {
        ...state,
        beamModes: { ...action.payload }
      };
    }

    case FiltersActionType.ADD_POLARIZATION: {
      const dataset = state.datasets.selected;

      const selectedPols = [
        ...(state.polarizations[dataset] || [])
      ];

      const newPols = Array.from(
        new Set([...selectedPols, action.payload])
      );

      return {
        ...state,
        polarizations: {
          ...state.polarizations,
          ...{ [dataset]: newPols }
        }
      };
    }

    case FiltersActionType.SET_DATASET_POLARIZATIONS: {
      return {
        ...state,
        polarizations: { ...state.polarizations, ...action.payload }
      };
    }

    case FiltersActionType.SET_ALL_POLARIZATIONS: {
      return {
        ...state,
        polarizations: { ...action.payload }
      };
    }

    case FiltersActionType.ADD_FLIGHT_DIRECTION: {
      return {
        ...state,
        flightDirections: new Set([action.payload, ...Array.from(state.flightDirections)])
      };
    }

    case FiltersActionType.SET_FLIGHT_DIRECTIONS: {
      return {
        ...state,
        flightDirections: new Set(action.payload)
      };
    }

    case FiltersActionType.SET_MAX_RESULTS: {
      return {
        ...state,
        maxResults: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export const getFiltersState = createFeatureSelector<FiltersState>('filters');

export const getDatasetsState = createSelector(
  getFiltersState,
  (state: FiltersState) => state.datasets
);

export const getDateRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.dateRange
);

export const getStartDate = createSelector(
  getDateRange,
  (state: DateRangeState) => state.start
);

export const getEndDate = createSelector(
  getDateRange,
  (state: DateRangeState) => state.end
);

export const getSeason = createSelector(
  getFiltersState,
  (state: FiltersState) => state.season
);

export const getSeasonStart = createSelector(
  getSeason,
  (state: models.Range<number | null>) => state.start
);

export const getSeasonEnd = createSelector(
  getSeason,
  (state: models.Range<number | null>) => state.end
);

export const getDatasetsList = createSelector(
  getDatasetsState ,
  (state: DatasetsState) => Object.values(state.entities)
);


export const getSelectedDatasetName = createSelector(
  getDatasetsState ,
  ({ selected }) => selected
);

export const getSelectedDataset = createSelector(
  getDatasetsState ,
  (state: DatasetsState) => state.entities[state.selected]
);

export const getPathRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.pathRange
);

export const getFrameRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.frameRange
);

export const getPathFrameRanges = createSelector(
  getFiltersState,
  ({ frameRange, pathRange }) => ({ frameRange, pathRange })
);

export const getShouldOmitSearchPolygon = createSelector(
  getFiltersState,
  (state: FiltersState) => state.shouldOmitSearchPolygon
);

export const getListSearchMode = createSelector(
  getFiltersState,
  (state: FiltersState) => state.listSearchMode
);

export const getProductTypes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.productTypes
);

export const getBeamModes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.beamModes
);

export const getPolarizations = createSelector(
  getFiltersState,
  (state: FiltersState) => state.polarizations
);

export const getFlightDirections = createSelector(
  getFiltersState,
  (state: FiltersState) => Array.from(state.flightDirections)
);

export const getMaxSearchResults = createSelector(
  getFiltersState,
  (state: FiltersState) => state.maxResults
);

export const getIsAnyDateValues = createSelector(
  getFiltersState,
  ({ dateRange, season }) => !!(dateRange.start || dateRange.end || season.start || season.end)
);

export const getIsAnyPathFrameValue = createSelector(
  getFiltersState,
  ({ pathRange, frameRange }) =>
    !!(pathRange.start || pathRange.end || frameRange.start || frameRange.end)
);

export const getIsAnyAdditionalFilters = createSelector(
  getFiltersState,
  ({ productTypes, beamModes, polarizations, flightDirections, datasets }) => {

    const dataset = datasets.selected;

    const isAnyFlightDirection = Array.from(flightDirections).length > 0;

    const isAdditionalListFilters = [productTypes, beamModes, polarizations]
      .map(vals => vals[dataset] || [])
      .map(vals => vals.length > 0)
      .some(c => !!c);

    return isAnyFlightDirection || isAdditionalListFilters ;
  }
);

export const getNumberOfAdditionalFilters = createSelector(
  getFiltersState,
  ({ productTypes, beamModes, polarizations, flightDirections, datasets }) => {
    const dataset = datasets.selected;

    const flightDirAmount = Array.from(flightDirections).length;

    const listFiltersAmts = [productTypes, beamModes, polarizations]
      .map(vals => vals[dataset] || [])
      .map(vals => vals.length)
      .reduce((x, y) => x + y);

    return listFiltersAmts + flightDirAmount;
  }
);

export const getDatePreviewStr = createSelector(
  getFiltersState,
  ({ dateRange, season }) => {
      const format = date => {
        if (!date) {
          return date;
        }

        const [month, day, year] = [
          date.getUTCMonth() + 1,
          date.getUTCDate(),
          date.getUTCFullYear(),
        ];

        return `${month}-${day}-${year}`;
      };

      const [startStr, endStr] = [dateRange.start, dateRange.end]
        .map(format);

      const seasonStr = (season.start || season.end) ? 'seasonal' : '';

      let dateStr = '';
      if (startStr && endStr) {
        dateStr = `${startStr} to ${endStr}`;
      } else if (startStr) {
        dateStr = `after ${startStr}`;
      } else if (endStr) {
        dateStr = `before ${endStr}`;
      }

      if (dateStr && seasonStr) {
        return `${dateStr} · ${seasonStr}`;
      } else if (dateStr) {
        return dateStr;
      } else {
        return seasonStr;
      }
    }
);

