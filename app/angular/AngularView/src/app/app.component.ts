import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogoutComponent } from './logout/logout.component';
import { ComponentBridgingService } from './model-service/componentbridging.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NUSSU Logistics Management System';
  progressBarVisible = false;
  bookingSubmittedSubscription: Subscription;
  bookingRecordedSubscription: Subscription;

  constructor(
    public lc: LogoutComponent,
    public service: ComponentBridgingService
  ) { }

  ngOnInit(): void {
    this.bookingSubmittedSubscription = this.service.on('bookingSubmitted').subscribe(() => this.showProgressBar());
    this.bookingRecordedSubscription = this.service.on('bookingRecorded').subscribe(() => this.hideProgressBar());
  }

  ngOnDestroy(): void {
    this.bookingSubmittedSubscription.unsubscribe();
    this.bookingRecordedSubscription.unsubscribe();
  }

  showProgressBar() {
    this.progressBarVisible = true;
  }

  hideProgressBar() {
    this.progressBarVisible = false;
  }
}
