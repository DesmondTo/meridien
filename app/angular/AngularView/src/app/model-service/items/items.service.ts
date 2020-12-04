import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private baseUrl = 'http://localhost:8000/api/items';

  constructor(private http: HttpClient) { }

  getItemsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  getItem(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}/`);
  }

  createItem(item: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/`, item);
  }

  updateItem(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}/`, value);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/`);
  }
}
