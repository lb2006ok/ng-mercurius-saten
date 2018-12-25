import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbSidebarService, NbUserModule, NbButtonModule } from '@nebular/theme';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
        }),
      ],
      forms: {},
    }),
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule,
    NbButtonModule,
  ],
  providers: [
    NbSidebarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
