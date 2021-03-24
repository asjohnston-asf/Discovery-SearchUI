import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { ProcessingQueueComponent } from './processing-queue.component';
import { ProcessingQueueJobsModule } from './processing-queue-jobs';
import { ProcessingOptionsModule } from './processing-options';
import { MatDialogModule } from '@angular/material/dialog';
import { QueueSubmitComponent } from './queue-submit/queue-submit.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { ConfirmationComponent } from './confirmation/confirmation.component';


@NgModule({
  declarations: [ProcessingQueueComponent, QueueSubmitComponent, ConfirmationComponent],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        MatSharedModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        PipesModule,
        ProjectNameSelectorModule,
        ProcessingQueueJobsModule,
        ProcessingOptionsModule,
        MatDialogModule,
        ResizableModule,
        DragDropModule,
        MatTabsModule,
        MatMenuModule
    ]
})
export class ProcessingQueueModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faSpinner);
  }
}