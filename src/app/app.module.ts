import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteModule } from './route/route.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentModule } from './component/component.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouteModule,
    ComponentModule,
    MatSnackBarModule

  ],
  exports: [
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
