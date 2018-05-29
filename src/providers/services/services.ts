import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesProvider {
  public local:Storage; 
  private data: any;
  private dataHijri: any;
  prayMethod: any;
  prayAsarMethod:any;
  // private apiURl: string = "https://time.siswadi.com/pray/?";
  private apiURl: string    = "http://api.aladhan.com/timings/";
  private apiURls: string   = "http://api.aladhan.com/";
  
  constructor(public http: Http,private storage: Storage) {
    console.log('Hello ServicesProvider Provider');
    this.data = null; 
  }
  prayerTime(lat,long) {

    this.data = null;
    // this.apiURl = this.formAPIUrlPrayerTime(lat,long);
    
    if (this.data) {
      return Promise.resolve(this.data);
    }

    this.storage.set('prayertime','3');
    var paramsCity: string;
    var url       : string;
    var method    : string;
    var school    : string;
    var now       = Math.round((new Date()).getTime() / 1000);
    // this.local    = new Storage(LocalStorage);
    this.prayMethod       = localStorage.getItem("prayMethod");
    this.prayAsarMethod   = localStorage.getItem("prayAsarMethod");

    if(this.prayMethod == null || this.prayMethod == undefined){
      method = "5";
    }
    if(this.prayAsarMethod == null || this.prayAsarMethod == undefined){
      school = "0";
    }
    
    var url       = this.apiURl+now+'?latitude='+lat+'&longitude='+long+'&method='+method+'&school='+school;
    return new Promise(resolve => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  prayerTimeForNotif(lat,long,DateRequest) {
    this.data = null;
    // this.apiURl = this.formAPIUrlPrayerTime(lat,long);
    
    if (this.data) {
      return Promise.resolve(this.data);
    }

    this.storage.set('prayertime','3');
    var paramsCity: string;
    var url       : string;
    var method    : string;
    var school    : string;
    // var now       = Math.round((DateRequest).getTime() / 1000);
    // this.local    = new Storage(LocalStorage);
    this.prayMethod       = localStorage.getItem("prayMethod");
    this.prayAsarMethod   = localStorage.getItem("prayAsarMethod");

    if(this.prayMethod == null || this.prayMethod == undefined){
      method = "5";
    }
    if(this.prayAsarMethod == null || this.prayAsarMethod == undefined){
      school = "0";
    }
    
    var url       = this.apiURl+DateRequest+'?latitude='+lat+'&longitude='+long+'&method='+method+'&school='+school;
    console.log(url);
    return new Promise(resolve => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  hijriCalendar() {
    // this.apiURls = this.formAPIUrlHijriCalendar();
    this.dataHijri = null;
    
    if (this.dataHijri) {
      return Promise.resolve(this.dataHijri);
    }


    var today = new Date();
    var dd    : number = today.getDate();
    var mm    : number = today.getMonth()+1; //January is 0!
    var yyyy  = today.getFullYear();

    if(dd<10){
        dd = 0+dd;
    } 
    if(mm<10){
        mm = 0+mm;
    } 
    var todayss = dd+'-'+mm+'-'+yyyy;
    var url       = "http://api.aladhan.com/gToH?date="+todayss;
    return new Promise(resolve => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.dataHijri = data;
          resolve(this.dataHijri);
        });
    });
  }
  // formAPIUrlHijriCalendar() {

  //   var today = new Date();
  //   var dd    : number = today.getDate();
  //   var mm    : number = today.getMonth()+1; //January is 0!
  //   var yyyy  = today.getFullYear();

  //   if(dd<10){
  //       dd = 0+dd;
  //   } 
  //   if(mm<10){
  //       mm = 0+mm;
  //   } 
  //   var todayss = dd+'-'+mm+'-'+yyyy;
  //   var url       = "http://api.aladhan.com/gToH?date="+todayss;
  //   return url;
  // }
  //localstorage --
  setEmail(email){
    this.storage.set('email',email);
  }

  //get the stored 
  getLocalStorage(param){
    return new Promise((resolve,reject)=>{
      this.storage.set('name', 'Max');
      this.storage.get(param).then((result) => {
        resolve(result);
      }, (error => {
        reject(error);
      }));
    });
  }

  //delete the email address
  removeEmail(){
  this.storage.remove('email').then(()=>{
      console.log('email is removed');
    });
  }

  //clear the whole local storage
  clearStorage(){
    this.storage.clear().then(()=>{
  console.log('all keys are cleared');
    });
  }
  
}
