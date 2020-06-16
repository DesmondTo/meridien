import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { take } from 'rxjs/operators'

import { BookingsService } from '../model-service/bookings/bookings.service';
import { Booking } from '../model-service/bookings/bookings';
import { BookedItem } from '../model-service/items/items';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import moment from 'moment';

@Component({
  selector: 'booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class BookingListComponent implements OnInit {

  bookings = new MatTableDataSource<Booking>();
  tableColumns: string[] = ['id', 'name', 'email', 'organization', 'time_booked', 'loan_start_time', 'loan_end_time', 'deposit_left', 'status'];

  filterForm: FormGroup;

  bookingDialogOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private bookingsService: BookingsService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.reloadData();
    this.bookings.paginator = this.paginator;
    this.bookings.sort = this.sort;

    this.filterForm = this.formBuilder.group({
      name: ['', ''],
      fromDate: ['', this.dateCheck],
      toDate: ['', this.dateCheck],
      status: ['', '']
    });
  }

  reloadData() {
    this.bookingsService.getBookingList()
      .subscribe(
        (data: Booking[]) => {
          this.bookings.data = data;
        }
      );
  }

  openDialog(row: { [x: string]: number; }) {
    this.bookingsService.getBookedItemsByBooker(row['id'])
      .subscribe(
        (data: BookedItem[]) => {
          if (!this.bookingDialogOpened) {
            this.bookingDialogOpened = true;
            let dialogRef = this.dialog.open(BookingListDialog, { width: '600px', data: { source: row, booked_items: data } });
            dialogRef.afterClosed().subscribe(() => {
              this.reloadData();
              this.bookingDialogOpened = false;
            });
          }
        }
      );
  }

  dateCheck(control: AbstractControl): any {
    var d = control.value;
    return (d === null || (typeof d === 'string') && d.length === 0 || moment(d).isValid()) ? null : { date: true };
  }

  onSubmit() {
    this.bookings.filterPredicate = this.bookingFilterPredicate;
    this.bookings.filter = this.filterForm.value;
  }

  bookingFilterPredicate(data: Booking, filter: any): boolean {
    for (let value in filter) {
      if (filter[value] !== '' && filter[value] !== 0) {
        if (value === 'fromDate') {
          if (Date.parse(data.time_booked.toString()) < Date.parse(filter[value])) {
            return false;
          }
        } else if (value === 'toDate') {
          //86399999 milliseconds is added to include the end point date
          if (Date.parse(data.time_booked.toString()) > Date.parse(filter[value]) + 86399999) {
            return false;
          }
        } else {
          if (!data[value].includes(filter[value])) {
            return false;
          }
        }
      }
    }
    return true;
  }
}

@Component({
  selector: 'booking-list-dialog',
  templateUrl: './booking-list-dialog.html',
})
export class BookingListDialog {
  tableColumnsBookedItems: string[] = ['name', 'quantity', 'status'];
  constructor(private bookingsService: BookingsService, public dialogRef: MatDialogRef<BookingListDialog>, @Inject(MAT_DIALOG_DATA) public booking_data: any, private _snackbar: MatSnackBar) { }

  updateStatus(status: string) {
    var booking_data_copy = { ...this.booking_data.source };
    delete booking_data_copy['id'];
    booking_data_copy['status'] = status;
    this.bookingsService.updateBooking(this.booking_data.source.id, booking_data_copy).subscribe();
    this.dialogRef.close();

    var snackbarString = '';
    if (status === 'PEN') {
      snackbarString = 'Pending';
    } else if (status === 'PRO') {
      snackbarString = 'Processed';
    }

    this._snackbar.open('Status of Booking #' + this.booking_data.source.id + ' changed to: ' + snackbarString, 'OK', { duration: 5000, });
  }
}
