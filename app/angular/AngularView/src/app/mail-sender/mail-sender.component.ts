import { Email } from './../model-service/emailtemplates/email';
import { MailerService } from './../model-service/emailtemplates/mailer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { apiKey } from '../settings';

@Component({
  selector: 'app-mail-sender',
  templateUrl: './mail-sender.component.html',
  styleUrls: ['./mail-sender.component.scss']
})
export class MailSenderComponent {
  mailForm: FormGroup;

  apiKey = apiKey;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private mailerService: MailerService
  ) {
    this.mailForm = this.formBuilder.group({
      recipient: '',
      subject: '',
      message: ''
    });
  }

  send_email(data: Email){
    const snackbarString = 'Sent email';
    this.mailerService.send_email(data).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
        console.log(data);
      }
    );

    this.snackbar.open(snackbarString, 'OK', {duration: 5000, });
  }
}