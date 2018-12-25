import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbRegisterComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'index', pathMatch: 'full'},
  {
    path: 'auth',
    loadChildren: './auth/auth.module#NgxAuthModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
