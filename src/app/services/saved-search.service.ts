import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as uuid from 'uuid/v1';

import { MapService } from './map/map.service';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';
import { getSearchType } from '@store/search/search.reducer';
import { UpdateSearchWithFilters, UpdateSearchName, DeleteSavedSearch,
  SaveSearches, LoadSavedSearches
} from '@store/user/user.action';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {

  private currentGeographicSearch$ = combineLatest(
    this.store$.select(filtersStore.getGeographicSearch).pipe(
      map(filters =>  ({ ...filters, flightDirections: Array.from(filters.flightDirections) })),
    ),
    this.mapService.searchPolygon$
  ).pipe(
    map(([filters, polygon]): models.GeographicFiltersType => ({
      ...filters,
      polygon
    }))
  );

  private currentListSearch$ = this.store$.select(filtersStore.getListSearch);
  private currentBaselineSearch$ = combineLatest(
    this.store$.select(scenesStore.getFilterMaster),
    this.store$.select(scenesStore.getMasterName),
    this.store$.select(filtersStore.getBaselineSearch),
  ).pipe(
    map(([filterMaster, master, baselineFilters]) => ({
      filterMaster,
      master,
      ...baselineFilters
    }))
  );

  private searchType$ = this.store$.select(getSearchType);

  public currentSearch$ = this.searchType$.pipe(
    switchMap(searchType => ({
      [models.SearchType.DATASET]: this.currentGeographicSearch$,
      [models.SearchType.LIST]: this.currentListSearch$,
      [models.SearchType.BASELINE]: this.currentBaselineSearch$,
      [models.SearchType.SBAS]: this.currentBaselineSearch$, // TODO: SBAS Search Here
    })[searchType]
    )
  );
  private currentSearch: models.FilterType;
  private searchType: models.SearchType;

  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private mapService: MapService,
  ) {
    this.currentSearch$.subscribe(
      current => this.currentSearch = current
    );

    this.searchType$.subscribe(
      searchType => this.searchType = searchType
    );
  }

  public makeCurrentSearch(searchName: string): models.Search | null {
    return {
      name: searchName,
      id: uuid(),
      filters: this.currentSearch,
      searchType: this.searchType,
    };
  }

  public updateSearchWithCurrentFilters(id: string): void {
    const action = new UpdateSearchWithFilters({
      id, filters: <models.GeographicFiltersType>this.currentSearch
    });

    this.store$.dispatch(action);
    this.saveSearches();
  }

  public updateSearchName(id: string, name: string): void {
    const action = new UpdateSearchName({ id, name });

    this.store$.dispatch(action);
    this.saveSearches();
  }

  public deleteSearch(id: string): void {
    const action = new DeleteSavedSearch(id);

    this.store$.dispatch(action);
    this.saveSearches();
  }

  public saveSearches(): void {
    const action = new SaveSearches();
    this.store$.dispatch(action);
  }

  public loadSearches(): void {
    const action = new LoadSavedSearches();
    this.store$.dispatch(action);
  }

  public filterTokensFrom(searches: models.Search[]): any[] {
    return searches.map(
      search => ({
        id: search.id,
        tokens: {
          name: search.name,
          searchType: search.searchType,
          ...Object.entries(search.filters).reduce(
            (acc, [key, val]) => this.addIfHasValue(acc, key, val), {}
          )
        }
      })
    ).map(search => {
      return {
        id: search.id,
        token: Object.entries(search.tokens).map(
          ([name, val]) => `${name} ${val}`
        )
          .join(' ')
          .toLowerCase()
      };
    });
  }

  private addIfHasValue(acc, key: string, val): Object {
    if (!val) {
      return acc;
    }

    if (val.length === 0) {
      return acc;
    }

    if (Object.keys(val).length === 0) {
      return acc;
    }

    if (key === 'productTypes') {
      return {
        ...acc,
        'file types': val.map(t => t.displayName),
        'filetypes': val.map(t => t.apiValue)
      };
    }

    if (this.isRange(val)) {
      const range = <models.Range<any>>val;
      let nonNullVals = ``;

      if (val.start !== null) {
        nonNullVals += `start ${val.start} `;
      }

      if (val.end !== null) {
        nonNullVals += `end ${val.end}`;
      }

      if (nonNullVals.length === 0) {
        return acc;
      }

      return {...acc, [key]: nonNullVals};
    }

    return {...acc, [key]: val};
  }

  private isRange(val): val is models.Range<any> {
    return (
      typeof val === 'object' &&
      'start' in val &&
      'end' in val
    );
  }

}
