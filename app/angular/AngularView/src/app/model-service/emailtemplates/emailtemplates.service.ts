import { EmailTemplate } from './emailtemplates';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplatesService {

  private baseUrlTemplates = 'http://localhost:8000/api/email_templates';
  private baseUrlTemplate = 'http://localhost:8000/api/email_template';


  constructor(private http: HttpClient) { }

  getTemplateList(): Observable<any> {
    return this.http.get(`${this.baseUrlTemplates}`);
  }

  getTemplateById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlTemplate}/${id}`);
  }

  createTemplate(template: EmailTemplate): Observable<Object> {
    return this.http.post(`${this.baseUrlTemplates}`, template);
  }

  updateTemplate(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrlTemplate}/${id}`, value);
  }

  deleteTemplate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlTemplate}/${id}`);
  }

  deleteAllTemplates(): Observable<any> {
    return this.http.delete(`${this.baseUrlTemplates}`);
  }
}
