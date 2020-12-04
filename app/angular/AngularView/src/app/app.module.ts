import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

import { TemplateDetailDialog } from './template-list/template-detail.dialog';
import { RefreshInterceptor } from './api-auth/refresh.interceptor';
import { JwtInterceptor } from './api-auth/jwt.interceptor';
import { ComponentBridgingService } from './model-service/componentbridging.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EditorModule } from '@tinymce/tinymce-angular';

import { ItemDetailsComponent } from './item-details/item-details.component';
import { BookingDetailsComponent, BookingConfirmComponent } from './booking-details/booking-details.component';
import { ItemListComponent, ItemListDialog } from './item-list/item-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BookingListComponent, BookingListDialog, BookingSummaryDialog } from './booking-list/booking-list.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LogoutComponent } from './logout/logout.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { MailSenderComponent } from './mail-sender/mail-sender.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationTemplateComponent } from './confirmation-template/confirmation-template.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { HomeComponent } from './home/home.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    ItemDetailsComponent,
    BookingDetailsComponent,
    ItemListComponent,
    ItemListDialog,
    NotFoundComponent,
    BookingListComponent,
    BookingListDialog,
    BookingSummaryDialog,
    LoginFormComponent,
    LogoutComponent,
    TemplateListComponent,
    TemplateDetailDialog,
    MailSenderComponent,
    BookingConfirmComponent,
    ConfirmationDialogComponent,
    ConfirmationTemplateComponent,
    BookingConfirmationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSortModule,
    MatCardModule,
    MatSnackBarModule,
    EditorModule,
    MatSelectModule,
    MatStepperModule,
    MatListModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressBarModule,
    FullCalendarModule,
    EditorModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-SG' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
    ComponentBridgingService,
    LogoutComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
