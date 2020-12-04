import { Observable } from 'rxjs';
import { Email } from './email';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailerService {
  private mailerUrl = 'http://localhost:8000/api/send_html_email';

  constructor(private http: HttpClient) { }

  send_email(email: Email): Observable<Object> {
    return this.http.post(`${this.mailerUrl}`, email);
  }
}