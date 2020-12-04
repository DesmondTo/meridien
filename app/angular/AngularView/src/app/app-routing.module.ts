import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { ConfirmationTemplateComponent } from './confirmation-template/confirmation-template.component';
import { MailSenderComponent } from './mail-sender/mail-sender.component';
import { AuthGuard } from './model-service/users/auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { BookingDetailsComponent, BookingConfirmComponent } from './booking-details/booking-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'items', component: ItemListComponent },
    { path: 'bookings', component: BookingListComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'bookings', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'login', component: LoginFormComponent },
    { path: 'confirmation_template', component: ConfirmationTemplateComponent, canActivate: [AuthGuard] },
    { path: 'confirm_booking', component: BookingConfirmationComponent },
    { path: 'templates', component: TemplateListComponent, canActivate: [AuthGuard] },
    { path: 'mailer', component: MailSenderComponent, canActivate: [AuthGuard] },
    { path: 'edit', component: BookingDetailsComponent},
    { path: 'edit/confirmed', component: BookingConfirmComponent},
    { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
