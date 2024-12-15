import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
     MatIconModule,
    BrowserModule,
    AppRoutingModule,
        GoogleMapsModule,
      BrowserAnimationsModule,
    MatToolbarModule,
   
    MatTableModule,
    MatCardModule,
    MatSidenavModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
     NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
