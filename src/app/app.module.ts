import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MosquePage } from '../pages/mosque/mosque';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServicesProvider } from '../providers/services/services';
import { HttpModule} from '@angular/http';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenWeatherMapModule } from 'ionic-openweathermap';
import { OpenWeatherMapProvider } from '../providers/openweathermap/openweathermap';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { TranslationProvider } from '../providers/translation/translation';
import { Autostart } from '@ionic-native/autostart';
import { Insomnia } from '@ionic-native/insomnia';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MosquePage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    OpenWeatherMapModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SettingsPage,
    MosquePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatePipe,
    ServicesProvider,
    HttpModule,
    Diagnostic,
    Geolocation,
    GoogleMaps,
    LocalNotifications,
    SettingsPage,
    OpenWeatherMapProvider,
    TranslationProvider,
    Autostart,
    Insomnia
  ]
})
export class AppModule {}
