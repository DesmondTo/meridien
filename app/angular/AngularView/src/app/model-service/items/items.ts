import { Booking } from '../bookings/bookings';

export class Items{
    id: number;
    name: string;
    quantity: number;
    remarks: string;
    category: string;
    deposit: number;
    item_status: string;
}

export class BookedItem {
    id: number;
    booking_source: Booking;
    item: Items;
    quantity: number;
    status: string;
}