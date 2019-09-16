import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { map, withLatestFrom, tap, filter, catchError, switchMap } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as uiActions from './ui.action';
import * as uiReducer from './ui.reducer';
import * as mapStore from '../map';
import * as scenesStore from '../scenes';

import { MapService } from '../../services/map/map.service';
import { BannerApiService } from '../../services/banner-api.service';
import * as models from '@models';

@Injectable()
export class UIEffects {

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private bannerApi: BannerApiService,
    private actions$: Actions) {}

  @Effect()
  setMapInteractionModeBasedOnSearchType: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.SetSearchType>(uiActions.UIActionType.SET_SEARCH_TYPE),
    filter(action => action.payload === models.SearchType.DATASET),
    map(_ => new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW))
  );

  @Effect()
  openFiltersMenuOnSearchTypeChange: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.SetSearchType>(uiActions.UIActionType.SET_SEARCH_TYPE),
    filter(action => action.payload !== models.SearchType.DATASET),
    map(_ => new uiActions.OpenFiltersMenu())
  );

  @Effect()
  clearResultsWhenSearchTypeChanges: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.SetSearchType>(uiActions.UIActionType.SET_SEARCH_TYPE),
    map(_ => new scenesStore.ClearScenes())
  );

  @Effect()
  loadBanners: Observable<Action> = this.actions$.pipe(
    ofType<uiActions.LoadBanners>(uiActions.UIActionType.LOAD_BANNERS),
    switchMap(() => this.bannerApi.load().pipe(
      catchError(() => of({
        banners: [{
          text: 'Error loading notifications' ,
          type: 'error',
          target: [
            'vertex'
          ]
        }],
        systime: ''
      }))
    )),
    map(resp => new uiActions.AddBanners(resp.banners))
  );
}
