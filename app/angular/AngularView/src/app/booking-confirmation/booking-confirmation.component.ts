import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Booking } from './../model-service/bookings/bookings';
import { BookingsService } from '../model-service/bookings/bookings.service';
import { BookedItem } from '../model-service/items/items';
import { getStatus } from '../model-service/statustranslator';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking;
  token: string;
  tableColumnsBookedItems: string[] = ['name', 'quantity', 'status'];
  bookedItems: BookedItem[];
  responded: boolean;

  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
    console.log(this.token);
    this.bookingsService.getBookingByToken(this.token).subscribe(
      (booking: Booking) => {
        this.booking = booking;
        this.bookingsService.getBookedItemsByBooker(booking.id).subscribe(
          (data: BookedItem[]) => {
            this.bookedItems = data;
          });
      }
    );
  }

  returnStatusString(code: string){
    return getStatus(code);
  }

  print(){
    window.print();
  }

  confirm_booking() {
    this.bookingsService.confirmBookingByToken(this.token).subscribe(
      (success: any) => {
        this.responded = true; // order matters here, otherwise user can't do any actions then gg
        location.reload(); // force reload
        this.snackbar.open('Booking confirmed', 'OK', { duration: 5000, });
      }
    );
  }

  delete_booking() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: 'this booking' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'yes') {
        this.bookingsService.deleteBookingByToken(this.token).subscribe(
          (success: any) => {
            this.responded = true;
            location.reload(); // force reload
            this.snackbar.open('Booking deleted', 'OK', { duration: 5000, });
          }
        );
      }
    });
  }
}
