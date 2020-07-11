import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationTemplatesService } from './../model-service/confirmationtemplates/confirmationtemplates.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Items } from '../model-service/items/items';
import { ItemsService } from '../model-service/items/items.service';
import { Booking } from '../model-service/bookings/bookings';
import { Router } from '@angular/router';
import { Email } from '../model-service/emailtemplates/email';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class BookingDetailsComponent implements OnInit {

  detailsForm: FormGroup;
  itemsForm: FormGroup;

  itemArray: Items[];

  inputGroup1: any;
  inputGroup2: any;

  itemColumns = ['item', 'quantity'];

  constructor(
    private formBuilder: FormBuilder,
    private bookingsService: BookingsService,
    private itemsService: ItemsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.emailCheck]],
      organization: ['', Validators.required],
      reason: ['', Validators.required],
      loan_start_time: ['', [Validators.required, this.dateCheck]],
      loan_end_time: ['', [Validators.required, this.dateCheck]],
    });

    this.itemsForm = this.formBuilder.group({ items: this.formBuilder.array([this.newItemInput()]) });

    this.itemsService.getItemsList().subscribe(
      data => {
        this.itemArray = data;
      }
    );

    this.checkout();
  }

  dateCheck(control: AbstractControl): any {
    return moment(control.value).isValid() ? null : { date: true };
  }

  emailCheck(control: AbstractControl): any {
    const regex = new RegExp('e[0-9]{7}@u\.nus\.edu');
    return regex.test(control.value) ? null : { email: true };
  }

  newItemInput(): FormGroup {
    return this.formBuilder.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getItemInputForm(): FormArray {
    return this.itemsForm.get('items') as FormArray;
  }

  addBlankItem() {
    this.getItemInputForm().push(this.newItemInput());
  }

  removeItemInput(i: number) {
    this.getItemInputForm().removeAt(i);
  }

  checkout() {
    this.inputGroup1 = this.detailsForm.value;
    this.inputGroup2 = this.itemsForm.value;
  }

  getTotalDeposit() {
    let totalSum = 0;
    this.inputGroup2.items.forEach(element => {
      totalSum += element.item.deposit * element.quantity;
    });
    return Math.min(200, totalSum);
  }

  /* this function essentially allows user to navigate the stepper back and forth
   while at the same time updating the form contents for use in the checkout page.*/
  selectionChange(event) {
    if (event.selectedIndex === 2) {
      this.checkout();
    }
  }

  onSubmit() {
    const bookingDataCopy = { ...this.inputGroup1 };
    bookingDataCopy.loan_start_time = bookingDataCopy.loan_start_time.format('YYYY-MM-DD');
    bookingDataCopy.loan_end_time = bookingDataCopy.loan_end_time.format('YYYY-MM-DD');
    const finalData: Booking = Object.assign(bookingDataCopy,
      { time_booked: new Date(), status: 'UNC', deposit_left: this.getTotalDeposit() }) as Booking;
    this.bookingsService.createBooking(finalData).subscribe(
      (data: any) => {
        this.inputGroup2.items.forEach(element => {
          const finalItemData = { booking_source: data.id, item: element.item.id, quantity: element.quantity, status: 'PEN' };
          this.bookingsService.createBookedItem(finalItemData).subscribe();
        });
        // comment on the security of this line lol
        this.router.navigate(['/edit/confirmed'], { state: { id: data.id, name: data.name, email: data.email, submitted: true } });
        console.log(typeof data.time_booked);
      });
  }

  returnEmailObject(recipient: string, subject: string, message: string) {
    return { recipient, subject, message } as Email;
  }
}

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
})
export class BookingConfirmComponent implements OnInit {

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private confirmationTemplatesService: ConfirmationTemplatesService
    ) { }

  ngOnInit(): void {
    if (!history.state.submitted) {
      this.router.navigate(['/edit']);
    }
  }

  resend(): void {
    this.confirmationTemplatesService.resendConfirmation({
      id: history.state.id,
      email: history.state.email
    }).subscribe(
      (success: any) => {
        this.snackbar.open('Email resent. Please wait a few minutes...', 'OK', {duration: 5000, })
      }
    );
  }
}
