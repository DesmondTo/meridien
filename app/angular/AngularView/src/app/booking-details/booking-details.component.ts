import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationTemplatesService } from './../model-service/confirmationtemplates/confirmationtemplates.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Items, BookedItem } from '../model-service/items/items';
import { ItemsService } from '../model-service/items/items.service';
import { Booking } from '../model-service/bookings/bookings';
import { Router } from '@angular/router';
import { Dictionary } from '@fullcalendar/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentBridgingService } from '../model-service/componentbridging.service';

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

  editMode: boolean;
  bookingSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private bookingsService: BookingsService,
    private itemsService: ItemsService,
    private service: ComponentBridgingService,
    private router: Router
  ) { this.itemsService.getItemsList().subscribe((data) => this.itemArray = data); }

  ngOnInit() {
    this.editMode = history.state.edit ? true : false;

    this.detailsForm = this.formBuilder.group({
      name: [history.state.source ? history.state.source.name : '', Validators.required],
      email: [history.state.source ? history.state.source.email : '', [Validators.required, this.emailCheck]],
      organization: [history.state.source ? history.state.source.organization : '', Validators.required],
      phone_no: [history.state.source ? history.state.srouce.phone_no : '', [Validators.required, this.phoneCheck]],
      reason: [history.state.source ? history.state.source.reason : '', Validators.required],
      loan_start_time: [history.state.source ? history.state.source.loan_start_time : '', [Validators.required, this.dateCheck]],
      loan_end_time: [history.state.source ? history.state.source.loan_end_time : '', [Validators.required, this.dateCheck]],
    });
    this.itemsForm = this.formBuilder.group({
      items: history.state.booked_items ?
        new FormArray(this.initialItemInput(history.state.booked_items),
          [this.checkForRepeat], ExceedAmountValidator.createExceedAmountValidator(this.itemsService)) :
        new FormArray([this.newItemInput()],
          [this.checkForRepeat], ExceedAmountValidator.createExceedAmountValidator(this.itemsService))
    });

    this.checkout();
  }

  dateCheck(control: AbstractControl): any {
    return moment(control.value).isValid() ? null : { date: true };
  }

  phoneCheck(control: AbstractControl): any {
    return new RegExp('(8[1-8][0-9]{6}|9[0-8][0-9]{6})').test(control.value) ? null : { phone: true };
  }

  emailCheck(control: AbstractControl): any {
    return new RegExp('e[0-9]{7}@u\.nus\.edu').test(control.value) ? null : { email: true };
  }

  newItemInput(): FormGroup {
    return this.formBuilder.group({
      item: [2, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // apparently history.state.booked_items is an object, so have to do this...
  initialItemInput(data: any) {
    const result = [];
    data.forEach((element: BookedItem) => {
      result.push(this.createItemInputWithData(element));
    });
    return result;
  }

  createItemInputWithData(bookedItem: BookedItem): FormGroup {
    return this.formBuilder.group({
      item: [bookedItem.item.id, Validators.required],
      quantity: [bookedItem.quantity, [Validators.required, Validators.min(1)]]
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

  returnItemGivenId(id: number) {
    return this.itemArray.filter(element => element.id === id)[0];
  }

  getTotalDeposit() {
    return this.itemArray ? Math.min(200, this.inputGroup2.items.reduce((acc: number, currentItem: any) =>
      acc + this.returnItemGivenId(currentItem.item).deposit * currentItem.quantity
      , 0)) : 0;
  }

  /* this function essentially allows user to navigate the stepper back and forth
   while at the same time updating the form contents for use in the checkout page.*/
  selectionChange(event) {
    if (event.selectedIndex === 2) {
      this.checkout();
    }
  }

  checkForRepeat(formArray: FormArray) {
    const itemDict: Dictionary = {};
    formArray.value.forEach((ele) => {
      if (itemDict[ele.item]) {
        itemDict[ele.item] += 1;
      } else {
        itemDict[ele.item] = 1;
      }
    });
    for (const key in itemDict) {
      if (itemDict[key] > 1) {
        return { duplicate: true };
      }
    }
  }

  // check if the form returns duplicate error
  checkForErrors() {
    const controlErrors: ValidationErrors = this.itemsForm.get('items').errors;
    return controlErrors ? controlErrors : { duplicate: false, exceed: false };
  }

  print() {
    window.print();
  }

  onSubmit() {
    this.service.publish('bookingSubmitted');
    const bookingDataCopy = { ...this.inputGroup1 };
    const finalData: Booking = Object.assign(bookingDataCopy,
      {
        time_booked: (history.state.source ? history.state.source.time_booked : new Date()),
        status: 'UNC',
        deposit_left: this.getTotalDeposit(),
        amount_paid: 0
      }) as Booking;
    if (!history.state.edit) {
      bookingDataCopy.loan_start_time = bookingDataCopy.loan_start_time.format('YYYY-MM-DD');
      bookingDataCopy.loan_end_time = bookingDataCopy.loan_end_time.format('YYYY-MM-DD');
      this.bookingsService.createBooking(finalData).subscribe(
        (data: any) => {
          this.inputGroup2.items.forEach(element => {
            const finalItemData = { booking_source: data.id, item: element.item, quantity: element.quantity, status: 'UNC' };
            this.bookingsService.createBookedItem(finalItemData).subscribe();
          });
          this.router.navigate(['/edit/confirmed'], { state: { id: data.id, name: data.name, email: data.email, submitted: true } });
          this.service.publish('bookingRecorded');
        });
    } else if (history.state.edit === true) { // touchwood condition lol
      this.bookingsService.updateBooking(history.state.source.id, finalData).subscribe(
        (data: any) => {
          // reason for deletion: I don't bother to check whether the booked item exists or not
          this.bookingsService.deleteBookedItemsByBooker(data.id).subscribe();
          this.inputGroup2.items.forEach(element => {
            const finalItemData = { booking_source: data.id, item: element.item, quantity: element.quantity, status: 'PEN' };
            this.bookingsService.createBookedItem(finalItemData).subscribe();
          });
          this.router.navigate(['/edit/confirmed'], { state: { id: data.id, name: data.name, email: data.email, submitted: true } });
          this.service.publish('bookingRecorded');
        });
    }
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
        this.snackbar.open('Email resent. Please wait...', 'OK', { duration: 5000, });
      }
    );
  }
}

// check for cap on items (it's kinda complicated since it needs the data from the db directly)
export class ExceedAmountValidator {
  static createExceedAmountValidator(itemsService: ItemsService): AsyncValidatorFn {
    return (formArray: FormArray): Observable<ValidationErrors> => {
      return itemsService.getItemsList().pipe(map((items) => {
        for (const element of formArray.value) {
          if (element.quantity > items.filter(ele => ele.id === element.item)[0].quantity) {
            return { exceed: true };
          }
        }
      }));
    };
  }
}
