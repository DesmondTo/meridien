import { Booking } from './../model-service/bookings/bookings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EmailTemplatesService } from './../model-service/emailtemplates/emailtemplates.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailTemplate } from './../model-service/emailtemplates/emailtemplates';
import { Component, Inject, ViewChildren, QueryList } from '@angular/core';
import { apiKey } from '../settings';
import { Router } from '@angular/router';
import { BookedItem } from '../model-service/items/items';
import { BookingsService } from '../model-service/bookings/bookings.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-template-detail-dialog',
  templateUrl: './template-detail.dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class TemplateDetailDialog {
  updateForm: FormGroup;

  isNew: boolean;
  isEdit: boolean;
  isSendingEmail: boolean;
  booking: Booking = null;
  template: EmailTemplate;
  templateParams: any;

  @ViewChildren('checkBox') checkBox: QueryList<any>;
  checkedItems = [];
  bookedItems: BookedItem[] = [];

  apiKey = apiKey;

  constructor(
    public dialog: MatDialog,
    private emailTemplatesService: EmailTemplatesService,
    private bookingService: BookingsService,
    public dialogRef: MatDialogRef<TemplateDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public params: any,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.isNew = params.isNew;
    this.isEdit = params.isEdit;
    this.isSendingEmail = params.isSendingEmail;
    this.updateForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      template: ['', [Validators.required]]
    });
    if (this.isEdit) {
      this.template = params.template;
      this.templateParams = { ...this.template };
      delete this.templateParams.id;
      this.updateForm.setValue(this.templateParams);
    } else if (this.isSendingEmail) {
      this.template = params.template;
      this.templateParams = { ...this.template };
      this.booking = params.booking.source;

      delete this.templateParams.id;
      this.updateForm.setValue(this.templateParams);

      this.updateForm.get('name').disable();
      this.updateForm.get('subject').disable();

      params.booking.booked_items.forEach((ele: BookedItem) => { this.bookedItems.push(ele); });
    } else {
      this.template = null;
    }
  }

  send_data(data: any) {
    if (this.isEdit) {
      this.emailTemplatesService.updateTemplate(this.template.id, data).subscribe();
    } else if (this.isSendingEmail) {
      this.checkBox.forEach((ele) => {
        const stat = ele.checked ? 'ACC' : 'REJ';
        this.bookingService.updateBookedItem(ele.value.id,
          { booking_source: ele.value.booking_source.id, item: ele.value.item.id, quantity: ele.value.quantity, status: stat }).subscribe();
      });
      const bookingDataCopy = { ...this.booking };
      delete bookingDataCopy.id;
      bookingDataCopy.deposit_left = this.getFinalDeposit();
      this.bookingService.updateBooking(this.booking.id, bookingDataCopy).subscribe();
      this.router.navigate(['/mailer'], { state: { booking: this.booking, template: data } });
    } else {
      this.emailTemplatesService.createTemplate(data).subscribe();
    }

    this.closeDialog();

    let snackbarString = '';
    if (this.isEdit) {
      snackbarString = 'Edited template';
    } else {
      snackbarString = 'Added template';
    }

    this.snackbar.open(snackbarString, 'OK', { duration: 5000, });
  }

  getFinalDeposit() {
    return this.checkBox ? this.checkBox.reduce((acc, ele) => ele.checked ? acc + ele.value.item.deposit * ele.value.quantity : acc, 0) : 0;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteTemplate() {
    this.closeDialog();
    this.emailTemplatesService.deleteTemplate(this.template.id).subscribe(() => {
      this.snackbar.open(`Template #${this.template.id} deleted`, 'OK', { duration: 5000 });
    });
  }

  confirmDelete() {
    const dialogR = this.dialog.open(ConfirmationDialogComponent, { data: `template # ${this.template.id}` });
    dialogR.afterClosed().subscribe(
      (result) => {
        if (result.event === 'yes') {
          this.deleteTemplate();
        }
      }
    );
  }
}
