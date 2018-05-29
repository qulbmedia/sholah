import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';

import { OpenWeatherMap } from '../components/openweathermap/openweathermap';

@NgModule({
  declarations: [
    OpenWeatherMap
  ],
  exports: [
    OpenWeatherMap
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OpenWeatherMapModule {}