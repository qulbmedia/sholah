import { Pipe,Directive,Component,Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController,AlertController,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//ionic native import -------
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
//provider import -----------
import { OpenWeatherMapProvider } from '../../providers/openweathermap/openweathermap';
import { ServicesProvider } from '../../providers/services/services';
import { GlobalVariable } from '../../custom/constant';
import * as moment from 'moment';
import { Timer } from '../../providers/services/timer';
import { Autostart } from '@ionic-native/autostart';
import { Insomnia } from '@ionic-native/insomnia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
  @Input() timeInSeconds: number;
  statusDev             = GlobalVariable.DevStatus;
  options               : any  = {};
  public weatherIcons   : string = './assets/json/weaterIcons.json';
  longLatExist          : string;
  today                 : Date;
  hoursRemaining        : any;
  public timer          : Timer;
  interval              : any;
  daySeasonNow          : any;

  latExist      = localStorage.getItem('latExist');
  longExist     = localStorage.getItem('longExist');

  subuhNotif    = localStorage.getItem('subuhNotif');
  dzuhurNotif   = localStorage.getItem('dzuhurNotif');
  asharNotif    = localStorage.getItem('asharNotif');
  maghribNotif  = localStorage.getItem('maghribNotif');
  isyaNotif     = localStorage.getItem('isyaNotif');

  public timeNow;
  public prayTimeNow;
  public nextSHolahName;

  public hijriToday;
  public gregorianToday;

  public selectSubhNow      = false;
  public selectDuhrNow      = false;
  public selectAshrNow      = false;
  public selectMagrNow      = false;
  public selectIsyaNow      = false;
  public showPrayNowStatus  = true;
  //weather ----
  public weatherDesc;
  public weatherIcon;
  public weatherTitle;
  public weatherCity;
  public weatherTempNow;
  public weatherTempHigh;
  public weatherTempLow;
  public weatherHumidity;
  public weatherPressure;
  // prayer ----
  public prayerSubuh;
  public prayerSyuruq;
  public prayerDzhuhur;
  public prayerAshar;
  public prayerMaghrib;
  public prayerIsya;

  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;

  public loader = this.loadingCtrl.create({
    content: 'loading...'
  });

  constructor(private insomnia: Insomnia,private autostart: Autostart,private http: Http,public navCtrl: NavController , private loadingCtrl: LoadingController , public LocalNotifications: LocalNotifications, public alert: AlertController , private datePipe: DatePipe , public services: ServicesProvider , private diagnostic: Diagnostic, private geolocation: Geolocation , public openWeatherProvider: OpenWeatherMapProvider ) {
    // this.options = {
    //   apikey      : "c41672d1fb5c256039a28c7debd84bcd",
    //   city        : { "name": ["Phnom Penh"] },
    //   unitFormat  : "metric",
    //   lang        : "en"
    // }
  }
  ionViewDidLoad(){
    this.weatherIcon  = "assets/icon/weather/no-weather.png";
    this.autostart.enable();
    this.insomnia.keepAwake()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );

    this.insomnia.allowSleepAgain()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );
    this.loader.present().then(() => {
      // loader.dismiss().catch((ERROR) => console.log('ERROR CATCH: LoadingController dismiss'+ERROR));
      // setTimeout(() => {
      //     loader.dismiss();
      // }, 5000);
      this.getLocation();
    });
  }
  getDateTimeNow(){
    this.today        = new Date();                 // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
    var datetext      = this.today.toTimeString();  // datestring is "20:32:01 GMT+0530 (India Standard Time)" ,  Split with ' ' and we get: ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"] , Take the first value from array :)
    datetext          = datetext.split(' ')[0];
    var already       = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    var dateNow       = new Date(already+" " + datetext);
    return dateNow;
  }
  getDateTimePray(timeValue){
    // console.log("timeValue");
    // console.log(timeValue);
    this.today        = new Date();                 // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
    var datetext      = timeValue+":00";
    var already       = this.datePipe.transform(this.today, 'yyyy-MM-dd'); //whatever format you need. 
    var dateNow       = new Date(already+" "+datetext);
    // console.log(dateNow);
    return dateNow;
  }
  getLocation(){

    if(this.statusDev ==  "true"){
      this.getLocationDetail(0,0);
    }else{

      this.diagnostic.isLocationEnabled().then((state) => {
        // console.log(state);
        if(state == true){
          console.log("location enable");
          this.getLocationDetail(0,0);
        }else{
          if(this.latExist == null || this.latExist == undefined && this.longExist == null || this.longExist == undefined ){
            console.log("location disable with NULL localstorage");
            var title   = "Notice";
            var message = "Your GPS is Disable , Do you want to switch on GPS?";
            this.showConfirm(title,message);
            this.loader.dismiss();
          }else{
            console.log("location disable with localstorage");
            this.getLocationDetail(this.latExist,this.longExist);
          }
        }
      }).catch(e => {
        console.error(e);
        this.loader.dismiss();
      });
      
    }
    
  }
  getLocationDetail(latitide,longitude){
    console.log("latitide : "+latitide+" AND longitude  : "+longitude);
    if(latitide != 0 && longitude != 0){
      var options = {
        apikey      : "c41672d1fb5c256039a28c7debd84bcd",
        city        : {"geo":[{"lat":latitide,"lon":longitude}]},
        unitFormat  : "metric",
        lang        : "en"
      }
      this.getWeather(options);
      this.getPrayerTime(latitide,longitude,0);
      this.getHijriCalendar();
      
      // if(this.statusDev !=  "true"){
        this.doSetNotification(latitide,longitude,0);
      // }
    }else{
      this.geolocation.getCurrentPosition().then((position) => {
        console.log(position);
        var lat   = position.coords.latitude;
        var long  = position.coords.longitude;
        var longLatSet = {
          latitude : lat.toString(),
          longitude: long.toString()
        }
        localStorage.setItem('latExist',lat.toString());
        localStorage.setItem('longExist',long.toString());
        var options = {
          apikey      : "c41672d1fb5c256039a28c7debd84bcd",
          city        : {"geo":[{"lat":lat,"lon":long}]},
          unitFormat  : "metric",
          lang        : "en"
        }
        this.getWeather(options);
        this.getPrayerTime(lat,long,0);
        this.getHijriCalendar();
        // if(this.statusDev !=  "true"){
          this.doSetNotification(lat,long,0);
        // }
      }).catch((error) => {
        console.log('Error getting location', error);
        this.loader.dismiss();
      });
    }
    
  }
  getGreetingTime (sunrise,sunset,statday) {
    var now           = this.getDateTimeNow();
      console.log("=======================================");
    console.log(now +">"+ sunrise);
    console.log(now +"<"+ sunset);
    if(statday == 0){
      if(now > sunrise && now < sunset) {
        this.daySeasonNow = "light";
      } else{
        var sunriseTomorrow   = new Date(sunrise.setDate(sunrise.getDate() + 1));
        if(now > sunset && now < sunriseTomorrow){
          this.daySeasonNow = "night";
        }else{
          this.daySeasonNow = "light";
        }
      }
    }else{
      this.daySeasonNow = "night";
    }
    
  }
  getGPSStatus(){
    
  }
  getWeather(options){
    this.openWeatherProvider.load(options).then((weather) => {
      console.log(weather);
      if(weather.coords == ""){

      }else{

      }
      var weatherNow      = weather.weather[0].main;
      var weatherNow      = weather.weather[0].main;
      var weatherNow      = weather.weather[0].main;

      this.weatherTitle     = weatherNow;
      this.weatherDesc      = weather.weather[0].description;
      this.weatherCity      = weather.name;
      console.log(weather.name);
      this.weatherTempNow   = Math.round(weather.main.temp);
      this.weatherTempHigh  = weather.main.temp_max;
      this.weatherTempLow   = weather.main.temp_min;
      this.weatherHumidity  = weather.main.humidity;
      this.weatherPressure  = weather.main.pressure;

      // this.getIconsWeather(weather);
      if(weatherNow == "Haze" || weatherNow == "Mist" || weatherNow == "Fog"){
        this.weatherIcon  = "assets/icon/weather/Haze.png";
      }else if(weatherNow == "Snow"){
        this.weatherIcon  = "assets/icon/weather/Snow.png";
      }else if(weatherNow == "Thunderstorm"){
        this.weatherIcon  = "assets/icon/weather/Thunderstorms.png";
      }else if(weatherNow == "Clear"){
        this.weatherIcon  = "assets/icon/weather/Sunny.png";
      }else if(weatherNow == "Rain"){
        this.weatherIcon  = "assets/icon/weather/Drizzle.png";
      }else if(weatherNow == "Clouds"){
        this.weatherIcon  = "assets/icon/weather/Cloudy.png";
      }
      else{
        this.weatherIcon  = "assets/icon/weather/Mostly Cloudy.png";
      }
      console.log(weatherNow); 
    }).catch((error) => {
      console.log('error get weather : ', error);
    });
  }
  getIconsWeather(weather){
    console.log("GET ICONS");
    this.http.get(this.weatherIcons).toPromise().then((response) => {
      var iconsWeather = response.json();
      console.log("iconsWeather");
      console.log(iconsWeather);
      var prefix = 'wi wi-';
      var code = weather.weather[0].id;
      var weatherIcons = "";
      var icon = iconsWeather[code].icon;

    
      // If we are not in the ranges mentioned above, add a day/night prefix.
      // if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
        // Finally tack on the prefix.
        this.weatherIcon = prefix + icon;

        console.log("GET ICONS ::: "+this.weatherIcon);
      // }
  
    }).catch((err) => {
      console.log(err);
    });
  }
  getPrayerTime(lat,long,stat){
    
    this.notifyTime = moment(new Date()).format();
    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();

    this.services.prayerTime(lat,long).then((prayerTimes) => {
      if(prayerTimes == null || prayerTimes == undefined){
        
        this.loader.dismiss();
        var title   = "Notice";
        var message = "Failed Get Data";
        this.showAlert(title,message);

      }else{

        // console.log(prayerTimes);
        var prayerData      = prayerTimes.data.timings;
        this.prayerSubuh    = prayerData.Fajr;
        this.prayerSyuruq   = prayerData.Sunrise;
        this.prayerDzhuhur  = prayerData.Dhuhr;
        this.prayerAshar    = prayerData.Asr;
        this.prayerMaghrib  = prayerData.Maghrib;
        this.prayerIsya     = prayerData.Isha;
        
        var now           = this.getDateTimeNow();
        var subuhTime     = this.getDateTimePray(this.prayerSubuh);
        var syuruqTime    = this.getDateTimePray(this.prayerSyuruq);
        var dzuhurTime    = this.getDateTimePray(this.prayerDzhuhur);
        var asharTime     = this.getDateTimePray(this.prayerAshar);
        var maghribTime   = this.getDateTimePray(this.prayerMaghrib);
        var isyaTime      = this.getDateTimePray(this.prayerIsya);

        this.getGreetingTime(syuruqTime,maghribTime,0);
        // var subuhTimeTomorrow   = subuhTime.setDate(subuhTime.getDate() + 1);
  
        console.log(now.toISOString().slice(0,10).replace(/-/g,' ')+" > "+subuhTime.toISOString().slice(0,10).replace(/-/g,' '));
        console.log(" AND "+now.toISOString().slice(0,10).replace(/-/g,' ')+" < "+dzuhurTime.toISOString().slice(0,10).replace(/-/g,' '));
        if(now > subuhTime && now < dzuhurTime){
          console.log("in subuh to dzuhur");
          if(now > subuhTime && now < syuruqTime){
            this.prayTimeNow    = "SUBUH";
            this.selectIsyaNow  = false;
            this.selectSubhNow  = true;
            this.nextSHolahName   = "SUBUH";
            this.hoursRemaining   = "NOW";
            setTimeout(() => {
              this.startTimer(dzuhurTime,"DZUHUR");
            },10000);
          }else{
            this.startTimer(dzuhurTime,"DZUHUR");
          }
        }
        else if(now > dzuhurTime && now < asharTime){
          console.log("in dzuhur time");
          this.prayTimeNow    = "DZUHUR";
          this.selectSubhNow  = false;
          this.selectDuhrNow  = true;
          this.nextSHolahName   = "DZUHUR";
          this.hoursRemaining   = "NOW";
          setTimeout(() => {
            this.startTimer(asharTime,"ASHAR");
          },10000);
        }
        else if(now > asharTime && now < maghribTime){
          console.log("in ashar time");
          this.prayTimeNow    = "ASHAR";
          this.selectDuhrNow  = false;
          this.selectAshrNow  = true;
          this.nextSHolahName   = "ASHAR";
          this.hoursRemaining   = "NOW";
          setTimeout(() => {
            this.startTimer(maghribTime,"MAGHRIB");
          },10000);
        }
        else if(now > maghribTime && now < isyaTime){
          console.log("in maghrib time");
          this.prayTimeNow    = "MAGHRIB";
          this.selectAshrNow  = false;
          this.selectMagrNow  = true;
          this.nextSHolahName   = "MAGHRIB";
          this.hoursRemaining   = "NOW";
          setTimeout(() => {
            this.startTimer(isyaTime,"ISYA");
          },10000);
        }
        else{
          console.log("in isya time");
          console.log("=======================================");
          console.log("=======================================");
          console.log(now +"<"+ subuhTime);
          if(now < subuhTime){
              console.log(3);
              var subuhTimeTomorrow   = new Date(subuhTime.setDate(subuhTime.getDate() + 1));
              this.prayTimeNow        = "ISYA";
              this.selectIsyaNow      = true;
              this.nextSHolahName   = "ISYA";
              this.hoursRemaining   = "NOW";
              this.getGreetingTime(syuruqTime,maghribTime,1);
              setTimeout(() => {
                this.startTimer(subuhTimeTomorrow,"SUBUH");
              },10000);
          }else{
            if(stat == 1){
              console.log("in else with stat 1");
              var isyaTimeLate   = new Date(isyaTime.setDate(isyaTime.getDate() - 1));
              console.log("isyaTimeLate : "+isyaTimeLate+"AND SUBUH TIME : "+subuhTime);
              if(now > isyaTimeLate && now < subuhTime){
                console.log(2)
                console.log(now+" > "+isyaTime+" AND "+now+" < "+subuhTime);
                this.prayTimeNow    = "ISYA";
                this.selectMagrNow  = false;
                this.selectIsyaNow  = true;
                this.startTimer(subuhTime,"SUBUH");
              }else{
                this.showPrayNowStatus = false;
              }
            }else{
              console.log("in else with stat 0");
              var subuhTimeTomorrow   = new Date(subuhTime.setDate(subuhTime.getDate() + 1));
              console.log(subuhTimeTomorrow);
              if(now > isyaTime && now < subuhTimeTomorrow){
                console.log(3)
                this.prayTimeNow        = "ISYA";
                this.selectIsyaNow      = true;
                this.nextSHolahName   = "ISYA";
                this.hoursRemaining   = "NOW";
                setTimeout(() => {
                  this.startTimer(subuhTimeTomorrow,"SUBUH");
                },10000);
              }else{
                this.showPrayNowStatus  = false;
              }
            }
          }
        }
        // this.loadingCtrl;
        this.loader.dismiss();
      }
    }).catch((error) => {
      console.log('error get weather : ', error);
      this.loader.dismiss();
      var title   = "Notice";
      var message = "Your GPS is Disable , Do you want to switch on GPS?";
      this.showAlert(title,message);
    });
  }
  getHijriCalendar(){
    this.services.hijriCalendar().then((dateValue) => {
      // console.log(dateValue);
      var hijriDay          = dateValue.data.hijri;
      var gregoDay          = dateValue.data.gregorian;
      this.hijriToday       = hijriDay.day+" "+hijriDay.month.en+" "+hijriDay.year;
      this.gregorianToday   = gregoDay.day+" "+gregoDay.month.en+" "+gregoDay.year;

    }).catch((error) => {
      console.log(error);
    });
  }

  // COUNTDOWN TIMER -----
  startTimer(timeNextPray,nextSholah){
    this.nextSHolahName = "to "+nextSholah;
    this.interval = setInterval(() => { 
      var now       = new Date().getTime();
      var distance  = timeNextPray - now;   // Find the distance between now an the count down date
      // Time calculations for days, hours, minutes and seconds -----
      // var days      = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours     = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes   = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds   = Math.floor((distance % (1000 * 60)) / 1000);
      // console.log(hours + "h " + minutes + "m " + seconds + "s ");
      
      if(new Date().getHours() == 23 && new Date().getMinutes() == 59 && new Date().getSeconds() == 59){
        setTimeout(() => { 
          this.getPrayerTime(this.latExist,this.longExist,1);
        },1000);
      }
      // If the count down is finished
      if (distance < 0) {
        console.log("EXPIRED");
        setTimeout(() => {
          this.doChangePrayerTime();
        },1000);
        clearInterval(this.interval);
      }else{
        this.hoursRemaining = hours + "h " + minutes + "m " + seconds + "s ";
      }
    }, 1000);

  }
  doChangePrayerTime(){
    console.log("change prayer time");
    this.getLocation();
  }
  // NOTIF AND ALERT -----
  doReadNotif(){
    // var prayMethod  = localStorage.getItem('prayMethod');
    // if(prayMethod == null || prayMethod == undefined){
    //   this.prayerTimeMethod = "2";
    // }else{
    //   this.prayerTimeMethod = prayMethod;
    // }
    // //get prayAsarMethod values --
    // var prayAsarMethod  = localStorage.getItem('prayAsarMethod');
    // if(prayAsarMethod == null || prayAsarMethod == undefined){
    //   this.prayerTimeAsarMethod = "0";
    // }else{
    //   this.prayerTimeAsarMethod = prayAsarMethod;
    // }

    // //get notification values =======
    // var subhNotifVal  = localStorage.getItem('subhNotif');
    // if(subhNotifVal == null || subhNotifVal == undefined){
    //   this.subhNotif = false;
    // }else{
    //   this.subhNotif = subhNotifVal;
    // }

    // var dzuhrNotifVal  = localStorage.getItem('dzuhrNotif');
    // if(dzuhrNotifVal == null || dzuhrNotifVal == undefined){
    //   this.dzuhrNotif = false;
    // }else{
    //   this.dzuhrNotif = dzuhrNotifVal;
    // }

    // var ashrNotifVal  = localStorage.getItem('ashrNotif');
    // if(ashrNotifVal == null || ashrNotifVal == undefined){
    //   this.ashrNotif = false;
    // }else{
    //   this.ashrNotif = ashrNotifVal;
    // }

    // var maghribNotifVal  = localStorage.getItem('maghribNotif');
    // if(maghribNotifVal == null || maghribNotifVal == undefined){
    //   this.maghribNotif = false;
    // }else{
    //   this.maghribNotif = maghribNotifVal;
    // }

    // var ishaNotifVal  = localStorage.getItem('ishaNotif');
    // if(ishaNotifVal == null || ishaNotifVal == undefined){
    //   this.ishaNotif = false;
    // }else{
    //   this.ishaNotif = ishaNotifVal;
    // }
  }
  doSetNotif(timeSet,prayerName){
  
  }
  doSetNotification(lat,lng,prayerName){
    for(var i=0; i<7; i++){
      var dayWeek       = new Date(new Date().setDate(new Date().getDate() + i));
      var dayWeekConv   = Math.round((dayWeek).getTime() / 1000);;
      console.log("cobaTime :: "+dayWeekConv);
      //aaa
      this.services.prayerTimeForNotif(lat,lng,dayWeekConv).then((prayerTimes) => {
        if(prayerTimes != null || prayerTimes != undefined){
          // console.log(prayerTimes);
          var dayDate           = prayerTimes.data.date.timestamp
          var prayerData        = prayerTimes.data.timings;

          var subhNotifVal  = localStorage.getItem('subhNotif');
          if(subhNotifVal == true.toString()){
            // var idSubh          = "subuh"+i;
            var idSubh          = "subuh";
            var subh            = prayerData.Fajr;
            this.setNotificationTime(dayDate , subh , 1+i , "SUBH");
          }
          var dzuhrNotifVal     = localStorage.getItem('dzuhrNotif');
          if(dzuhrNotifVal == true.toString()){
            // var idDzhur         = "dzuhur"+i;
            var idDzhur         = "dzuhur";
            var dzhur           = prayerData.Dhuhr;;
            this.setNotificationTime(dayDate , dzhur , 2+i , "DZUHR");
          }
          var ashrNotifVal      = localStorage.getItem('ashrNotif');
          if(ashrNotifVal == true.toString()){
            // var idAshr          = "ashar"+i;
            var idAshr          = "ashar";
            var ashr            = prayerData.Asr;
            this.setNotificationTime(dayDate , ashr , 3+i , "ASR");
          }
          var maghribNotifVal   = localStorage.getItem('maghribNotif');
          if(maghribNotifVal == true.toString()){
            // var idMaghr         = "maghrib"+i;
            var idMaghr         = "maghrib";
            var maghr           = prayerData.Maghrib;
            this.setNotificationTime(dayDate , maghr , 4+i, "MAGHRIB");
          }
          var ishaNotifVal      = localStorage.getItem('ishaNotif');
          if(ishaNotifVal == true.toString()){
            // var idIsha          = "isya"+i;
            var idIsha          = "isya";
            var isha            = prayerData.Isha;
            this.setNotificationTime(dayDate , isha , 5+i , "ISHA");
          }
        }else{
          console.log("prayerTimes null");
          // console.log(prayerTimes);
        }
      });
    }
    // var title   = "Success";
    // var message = "Notification of Sholah "+prayerName+" in "+timeSet+" is set now";
    // this.showAlert(title,message);
  }
  setNotificationTime(dayDate,sholahTime,id,sholahName){
    console.log("subhNotifVal.toString()");
    var NotificationTime  = new Date(parseInt(dayDate)*1000);
    let strs              : any[];

    var timess    = sholahTime+":00";
    strs          = timess.split(":");

    NotificationTime.setHours(strs[0]);
    NotificationTime.setMinutes(strs[1]);
    NotificationTime.setSeconds(strs[2]);
    console.log(NotificationTime);
    // console.log(id);

    if(this.statusDev ==  "true"){
      console.log("this development ,  cannot create notifications");
    }else{
      if(new Date() > NotificationTime){
        // action this
      }else{
        console.log(NotificationTime);
        this.LocalNotifications.schedule({
            id: id,
            title: 'Assalamu Alaikum',
            text: 'Now time is '+sholahName+' , lets Sholah !' ,
            at: NotificationTime
          }  
        );    
        // console.log(new Date(new Date().getTime() + 3600));
        this.LocalNotifications.getAllTriggered().then(result =>{
          console.log(result);
        })
        console.log("notification "+id+" created in "+NotificationTime);
      }
    }
  }

  showConfirm(title,message) {
    let confirm = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.diagnostic.switchToLocationSettings();
          }
        }
      ]
    });
    confirm.present();
  }
  showAlert(title,message) {
    let confirm = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Oke',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    // this.ionViewDidLoad();
    clearInterval(this.interval);
    this.getLocation();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
