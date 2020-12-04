import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private baseUrlBookings = 'http://localhost:8000/api/bookings';
  private baseUrlBookedItems = 'http://localhost:8000/api/booked-items';
  private baseUrlBookingToken = 'http://localhost:8000/api/bookings/token';

  constructor(private http: HttpClient) { }

  getBookingList(): Observable<any> {
    return this.http.get(`${this.baseUrlBookings}/`);
  }

  getBookedItemList(): Observable<any> {
    return this.http.get(`${this.baseUrlBookedItems}/`);
  }

  getBookedItemsByBooker(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlBookedItems}/booking_source_id/${id}/`);
  }

  getBookersbyBookedItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlBookedItems}/item_id/${id}/`);
  }

  createBooking(booking: object): Observable<object> {
    return this.http.post(`${this.baseUrlBookings}/`, booking);
  }

  createBookedItem(item: object): Observable<object> {
    return this.http.post(`${this.baseUrlBookedItems}/`, item);
  }

  updateBooking(id: number, value: any): Observable<object> {
    return this.http.put(`${this.baseUrlBookings}/${id}`, value);
  }

  updateBookedItem(id: number, value: any): Observable<object> {
    return this.http.put(`${this.baseUrlBookedItems}/${id}/`, value);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlBookings}/${id}`);
  }

  deleteBookedItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlBookedItems}/${id}/`);
  }

  deleteBookedItemsByBooker(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlBookedItems}/booking_source_id/${id}/`);
  }

  deleteAllBookings(): Observable<any> {
    return this.http.delete(`${this.baseUrlBookings}/`);
  }

  deleteAllBookedItems(): Observable<any> {
    return this.http.delete(`${this.baseUrlBookedItems}/`);
  }

  getBookingByToken(token: string): Observable<any> {
    return this.http.get(`${this.baseUrlBookingToken}/${token}`);
  }

  deleteBookingByToken(token: string): Observable<any> {
    return this.http.delete(`${this.baseUrlBookingToken}/${token}`);
  }

  confirmBookingByToken(token: string): Observable<any> {
    return this.http.patch(`${this.baseUrlBookingToken}/confirm/${token}`, '');
  }
}
