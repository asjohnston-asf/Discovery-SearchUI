import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';

@Component({
  selector: 'app-additional-filters',
  templateUrl: './additional-filters.component.html',
  styleUrls: ['./additional-filters.component.scss'],
  animations: [
    trigger('showFilters', [
      state('void', style({
        opacity: 0,
      })),
      transition('void <=> *', animate('100ms'))
    ])
  ],
})
export class AdditionalFiltersComponent implements OnInit {
  public isSidebarOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);

  public searchError$ = this.store$.select(searchStore.getSearchError);

  public filterType = models.FilterType;
  public selectedSearchType: models.SearchType;

  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.selectedSearchType = searchType
    );
  }

  public closePanel(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }
}
