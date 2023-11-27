import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, FilterExposeService, ResultService } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EdcaUrlSerializer, EndecapodService } from '@ibfd/endecapod';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [
    EdcaUrlSerializer,
    FilterExposeService,
    ResultService,
    EndecapodService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
