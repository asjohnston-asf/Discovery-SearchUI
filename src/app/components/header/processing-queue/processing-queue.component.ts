import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as moment from 'moment';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';
import * as models from '@models';
import * as services from '@services';

enum ProcessingQueueTab {
  SCENES = 'Scenes',
  OPTIONS = 'Options'
}

@Component({
  selector: 'app-processing-queue',
  templateUrl: './processing-queue.component.html',
  styleUrls: ['./processing-queue.component.scss']
})
export class ProcessingQueueComponent implements OnInit {
  public jobs: models.QueuedHyp3Job[] = [];
  public user = '';
  public remaining = 0;
  public areJobsLoading = false;
  public isQueueSubmitProcessing = false;
  public previousQueue: any[] | null = null;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public selectedTab = ProcessingQueueTab.SCENES;
  public Tabs = ProcessingQueueTab;

  public projectName = '';
  public processingOptions: models.Hyp3ProcessingOptions;

  constructor(
    private dialogRef: MatDialogRef<ProcessingQueueComponent>,
    private snackBar: MatSnackBar,
    private store$: Store<AppState>,
    private hyp3: services.Hyp3Service,
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(new hyp3Store.LoadUser());

    this.store$.select(queueStore.getQueuedJobs).subscribe(jobs => {
      this.jobs = jobs;
    });

    this.store$.select(hyp3Store.getHyp3User).subscribe(
      user => {
        if (user === null) {
          return;
        }

        this.user = user.user_id;
        this.remaining = user.quota.remaining;
      }
    );

    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );

    this.store$.select(hyp3Store.getProcessingOptions).subscribe(
      options => this.processingOptions = options
    );

    this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
      projectName => this.projectName = projectName
    );
  }

  public onCloseDialog() {
    this.dialogRef.close();
  }

  public daysUntilExpiration(expiration_time: moment.Moment): string {
    const current = moment();

    return `${current.diff(expiration_time, 'days')} days`;
  }

  public onSubmitQueue(): void {
    const options = {
      dem_matching: this.processingOptions.demMatching,
      include_dem: this.processingOptions.includeDem,
      include_inc_map: this.processingOptions.includeIncMap,
      radiometry: this.processingOptions.radiometry,
      scale: this.processingOptions.scale,
      speckle_filter: this.processingOptions.speckleFilter,
    };

    const hyp3JobsBatch = this.jobs.map(job => {
      const jobOptions: any = {
        job_type: job.job_type,
        job_parameters: {
          ...options,
          granules: job.granules.map(granule => granule.name),
        }
      };

      if (this.projectName !== '') {
        jobOptions.name = this.projectName;
      }

      return jobOptions;
    });


    this.isQueueSubmitProcessing = true;

    this.hyp3.submiteJobBatch$({ jobs: hyp3JobsBatch }).pipe(
      catchError(resp => {
        if (resp.error) {
          this.snackBar.open(`${resp.error.detail}`, 'Error', {
            duration: 5000,
          });
        }

        return of({jobs: null});
      }),
      tap(_ => this.isQueueSubmitProcessing = false),
    ).subscribe(
      (resp: any) => {
        if (resp.jobs === null) {
          return;
        }

        this.snackBar.open(`${resp.jobs.length} jobs successfully submitted`, 'Submit', {
          duration: 5000,
        });

        this.store$.dispatch(new queueStore.ClearProcessingQueue());
        this.store$.dispatch(new hyp3Store.LoadUser());
        this.dialogRef.close();
      }
    );
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.store$.dispatch(new queueStore.RemoveJob(job));
  }

  public onClearJobQueue(jobs): void {
    this.previousQueue = jobs;
    this.store$.dispatch(new queueStore.ClearProcessingQueue());
  }

  public onRestoreJobQueue(previousJobs): void {
    this.store$.dispatch(new queueStore.AddJobs(previousJobs));
    this.previousQueue = null;
  }

  public onSelectScenesTab(): void {
    this.selectedTab = ProcessingQueueTab.SCENES;
  }

  public onSelectOptionsTab(): void {
    this.selectedTab = ProcessingQueueTab.OPTIONS;
  }
}
