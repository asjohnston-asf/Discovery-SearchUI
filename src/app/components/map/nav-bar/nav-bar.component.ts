import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as queueStore from '@store/queue';
import { Sentinel1Product, ViewType } from '@models';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Output() openQueue = new EventEmitter<void>();

  @Input() products: Sentinel1Product[];

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onEarthdataLogin(): void {
    const vertexUrl = window.location.origin;
    const url = 'https://urs.earthdata.nasa.gov/oauth/authorize' +
      '?client_id=BO_n7nTIlMljdvU6kRRB3g&response_type=code' +
      '&redirect_uri=https://vertex.daac.asf.alaska.edu/services/urs4_token_request' +
      `&state=${vertexUrl}?uiView=${ViewType.LOGIN}`;

    const loginWindow = window.open(
      url,
      'Vertex: URS Earth Data Authorization',
      'scrollbars=yes, width=600, height= 600'
    );
  }
}
