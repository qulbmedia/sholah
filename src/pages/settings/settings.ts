import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  prayerTimeMethod: string;
  prayerTimeAsarMethod:string;

  subhNotif:any;
  dzuhrNotif:any;
  ashrNotif:any;
  maghribNotif:any;
  ishaNotif:any;
  unitsLoad:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public LocalNotifications: LocalNotifications) {
    console.log("Toggled: "+ this.subhNotif); 
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SettingsPage');
    this.loadSetting();
  }

  loadSetting(){

    //get prayMethod values --
    var prayMethod  = localStorage.getItem('prayMethod');
    if(prayMethod == null || prayMethod == undefined){
      this.prayerTimeMethod = "2";
    }else{
      this.prayerTimeMethod = prayMethod;
    }
    //get prayAsarMethod values --
    var prayAsarMethod  = localStorage.getItem('prayAsarMethod');
    if(prayAsarMethod == null || prayAsarMethod == undefined){
      this.prayerTimeAsarMethod = "0";
    }else{
      this.prayerTimeAsarMethod = prayAsarMethod;
    }

    //get notification values =======
    var subhNotifVal  = localStorage.getItem('subhNotif');
    if(subhNotifVal == null || subhNotifVal == undefined){
      this.subhNotif = false;
    }else{
      this.subhNotif = subhNotifVal;
    }

    var dzuhrNotifVal  = localStorage.getItem('dzuhrNotif');
    if(dzuhrNotifVal == null || dzuhrNotifVal == undefined){
      this.dzuhrNotif = false;
    }else{
      this.dzuhrNotif = dzuhrNotifVal;
    }

    var ashrNotifVal  = localStorage.getItem('ashrNotif');
    if(ashrNotifVal == null || ashrNotifVal == undefined){
      this.ashrNotif = false;
    }else{
      this.ashrNotif = ashrNotifVal;
    }

    var maghribNotifVal  = localStorage.getItem('maghribNotif');
    if(maghribNotifVal == null || maghribNotifVal == undefined){
      this.maghribNotif = false;
    }else{
      this.maghribNotif = maghribNotifVal;
    }

    var ishaNotifVal  = localStorage.getItem('ishaNotif');
    if(ishaNotifVal == null || ishaNotifVal == undefined){
      this.ishaNotif = false;
    }else{
      this.ishaNotif = ishaNotifVal;
    }


    var unitsLoad = localStorage.getItem('unitDegree');
    if(unitsLoad == null || unitsLoad == undefined){
      this.unitsLoad = "C";
    }else{
      this.unitsLoad = unitsLoad;
    }

  }
  public notifySubh() {
    console.log("Toggled: "+ this.subhNotif);
    if(this.subhNotif == true){
      console.log("subuh true value: "+ this.subhNotif);
      localStorage.setItem('subhNotif',this.subhNotif);
    }else{
      console.log("subuh false value: "+ this.subhNotif);
      localStorage.setItem('subhNotif', this.subhNotif);
    }
  }

  public notifyDzuhr() {
    if(this.dzuhrNotif == true){
      localStorage.setItem('dzuhrNotif',this.dzuhrNotif);
    }else{
      localStorage.setItem('dzuhrNotif', this.dzuhrNotif);
    }
  }

  public notifyAshr() {
    if(this.ashrNotif == true){
      localStorage.setItem('ashrNotif',this.ashrNotif);
    }else{
      localStorage.setItem('ashrNotif', this.ashrNotif);
    }
  }

  public notifyMaghrib() {
    if(this.maghribNotif == true){
      localStorage.setItem('maghribNotif',this.maghribNotif);
    }else{
      localStorage.setItem('maghribNotif', this.maghribNotif);
    }
  }

  public notifyIsha() {
    if(this.ishaNotif == true){
      localStorage.setItem('ishaNotif',this.ishaNotif);
    }else{
      localStorage.setItem('ishaNotif', this.ishaNotif);
    }

  }

  updatePrayerTimeMethod(item){
    localStorage.setItem('prayMethod',item);
    var setNow = localStorage.getItem('prayMethod');
    console.log('item is set : '+setNow);
  }

  updatePrayerTimeAsarMethod(item){
    localStorage.setItem('prayAsarMethod',item);
    var setNow = localStorage.getItem('prayAsarMethod');
    console.log('item is set : '+setNow);
  }

  updateUnits(item){
    localStorage.setItem('unitDegree',item);
    var unitDegree = localStorage.getItem('unitDegree');
    console.log('item is set : '+unitDegree);
  }

  
  
}
