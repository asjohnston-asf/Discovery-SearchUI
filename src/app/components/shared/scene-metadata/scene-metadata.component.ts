import { Component, OnInit } from '@angular/core';

import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';

import * as models from '@models';
import { DatasetForProductService, PropertyService } from '@services';


@Component({
  selector: 'app-scene-metadata',
  templateUrl: './scene-metadata.component.html',
  styleUrls: ['./scene-metadata.component.scss']
})
export class SceneMetadataComponent implements OnInit {
  public dataset: models.Dataset;

  public p = models.Props;
  public scene: models.CMRProduct;
  public searchType: models.SearchType;

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>,
    private datasetForProduct: DatasetForProductService
  ) { }

  ngOnInit() {
    const scene$ = this.store$.select(scenesStore.getSelectedScene);

    this.store$.select(uiStore.getSearchType).subscribe(
     searchType => this.searchType = searchType
    );

    scene$.subscribe(
      scene => this.scene = scene
    );

    scene$.pipe(
      filter(g => !!g),
      map(scene => this.datasetForProduct.match(scene)),
    ).subscribe(dataset => this.dataset = dataset);
  }

  public isGeoSearch(): boolean {
    return this.searchType === models.SearchType.DATASET;
  }

  public hasValue(v: any): boolean {
    return v !== null && v !== undefined;
  }

  public setBeamMode(): void {
    const action = new filtersStore.AddBeamMode(this.scene.metadata.beamMode);
    this.store$.dispatch(action);
  }

  public setStartDate(): void {
    const action = new filtersStore.SetStartDate(this.scene.metadata.date.toDate());
    this.store$.dispatch(action);
  }

  public setEndDate(): void {
    const action = new filtersStore.SetEndDate(this.scene.metadata.date.toDate());
    this.store$.dispatch(action);
  }

  public setPathStart(): void {
    const action = new filtersStore.SetPathStart(this.scene.metadata.path);
    this.store$.dispatch(action);
  }

  public setPathEnd(): void {
    const action = new filtersStore.SetPathEnd(this.scene.metadata.path);
    this.store$.dispatch(action);
  }

  public setFrameStart(): void {
    const action = new filtersStore.SetFrameStart(this.scene.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFrameEnd(): void {
    const action = new filtersStore.SetFrameEnd(this.scene.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFlightDirection(): void {
    const dir = this.scene.metadata.flightDirection
      .toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    const action = new filtersStore.SetFlightDirections([<models.FlightDirection>capitalized]);
    this.store$.dispatch(action);
  }

  public addPolarization(): void {
    const action = new filtersStore.AddPolarization(this.scene.metadata.polarization);
    this.store$.dispatch(action);
  }

  public addMission(): void {
    const action = new filtersStore.SelectMission(this.scene.metadata.missionName);
    this.store$.dispatch(action);
  }

  private capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
}