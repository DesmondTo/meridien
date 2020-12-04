import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationTemplate } from './../model-service/confirmationtemplates/confirmationtemplates';
import { ConfirmationTemplatesService } from './../model-service/confirmationtemplates/confirmationtemplates.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apiKey } from '../settings';

@Component({
  selector: 'app-confirmation-template',
  templateUrl: './confirmation-template.component.html',
  styleUrls: ['./confirmation-template.component.scss']
})
export class ConfirmationTemplateComponent implements OnInit {
  confirmationMailForm: FormGroup;
  apiKey = apiKey;

  constructor(
    private formBuilder: FormBuilder,
    private confirmationTemplateService: ConfirmationTemplatesService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.confirmationMailForm = this.formBuilder.group({
      link_string: '',
      subject: '',
      template: ''
    });
    this.confirmationTemplateService.getConfirmationTemplate()
      .subscribe(
        (template: ConfirmationTemplate) => {
          delete template.id;
          this.confirmationMailForm.setValue(template);
        },
        (err) => {
        }
      );
  }

  ngOnInit(): void {
  }

  create_or_update(data: any) {
    this.confirmationTemplateService.updateTemplate(data).subscribe();
    this.router.navigate(['/'])
    this.snackbar.open('Updated confirmation template', 'OK', {duration: 5000, });
  }
}
