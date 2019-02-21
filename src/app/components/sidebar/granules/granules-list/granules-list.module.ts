import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';

import { GranulesListComponent } from './granules-list.component';
import { Sentinel1ProductComponent } from './sentinel1-product/sentinel1-product.component';
import { ProductNameComponent } from './sentinel1-product/product-name/product-name.component';


@NgModule({
  declarations: [
    GranulesListComponent,
    Sentinel1ProductComponent,
    ProductNameComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    TruncateModule,
    FontAwesomeModule,
    ClipboardModule,

    MatSharedModule,
    PipesModule,
  ],
  exports: [
    GranulesListComponent
  ]
})
export class GranulesListModule { }