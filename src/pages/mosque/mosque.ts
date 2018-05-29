import { Component, ViewChild ,ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController , Platform} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, LatLng, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Http } from '@angular/http';
import { GlobalVariable } from '../../custom/constant';
import 'rxjs/add/operator/map';

declare var google;
/**
 * Generated class for the MosquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mosque',
  templateUrl: 'mosque.html',
})
export class MosquePage {
  @ViewChild('map') mapElement: ElementRef;
  // map:GoogleMap;
  distanceVal : string;
  map         : any;
  lat         : any; lang:any;
  mylocation  : any;
  places      : Array<any> ; 
  constructor(public platform: Platform , private geolocation: Geolocation, public navCtrl: NavController , private loadingCtrl: LoadingController , public alert: AlertController, private diagnostic: Diagnostic) {
    
  }
  ngAfterViewInit() {
    console.log("afterinit");
    this.distanceVal = "1000";
    this.loadGoogleMap(1000);
    console.log("afterinit");
    // setTimeout(() => {
    //   console.log(this.abc.nativeElement.innerText);
    // }, 1000);
  }
  loadGoogleMap(radius){
    var radiusval = parseInt(radius);
    console.log(radiusval);
    var statusDev = GlobalVariable.DevStatus;
    console.log(statusDev);

    if(statusDev ==  "true"){
      this.getLocationDetail(radiusval);
    }else{
      this.diagnostic.isLocationEnabled()
      .then((state) => {
        console.log(state);
        if(state == true){
          this.getLocationDetail(radiusval);
        }else{
          this.showConfirm()
        }
      }).catch(e => console.error(e));
    }
    
  }
  getLocationDetail(radius){
    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position);
      var lat           = position.coords.latitude;
      var long          = position.coords.longitude;
      let latLng        = new google.maps.LatLng(lat, long);
      this.mylocation   = latLng;
      this.addMarker(latLng,radius);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  addMarker(latlng,radius){
    console.log(latlng);
    if(radius <= 1000){
      var mapOptions = {
        center: latlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }
    else if(radius >= 1000 && radius <= 2000){
      var mapOptions = {
        center: latlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }
    else if(radius >= 2000 && radius <= 4000){
      var mapOptions = {
        center: latlng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }
    else{
      var mapOptions = {
        center: latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }
    // this.map    = GoogleMaps.create('map_canvas', mapOptions);
    this.map    = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let marker  = new google.maps.Marker({
      map       : this.map,
      animation : google.maps.Animation.DROP,
      // icon      :'assets/icon/maps/mymarker.png',
      position  : this.map.getCenter()
    });
    // let content = "<p>This is your current position</p>";          
    // let infoWindow = new google.maps.InfoWindow({
    //   content: content
    // });
    // google.maps.event.addListener(marker, 'click', () => {
    //   infoWindow.open(this.map, marker);
    // });
    this.getRestaurants(latlng,radius).then((results : Array<any>)=>{
        this.places = results;
        console.log(results);
        for(let i = 0 ;i < results.length ; i++) {
            this.createMarker(results[i],latlng);
        }
    },(status)=>console.log(status));
  }
  addMarkerMosque(latlng){
    console.log(latlng);
    var typeMarker = {
      url: "http://maps.google.com/mapfiles/kml/paddle/grn-circle.png", // url
      scaledSize: new google.maps.Size(32, 32), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 32) // anchor
    };
    let mapOptions = {
      center: latlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map    = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let marker = new google.maps.Marker({
        map       : this.map,
        draggable : true,
        icon      : typeMarker,
        animation : google.maps.Animation.DROP,
        position  : latlng
    }); 
    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(this.map);

  }
  getRestaurants(latLng, radius){
      var service   = new google.maps.places.PlacesService(this.map);
      let request   = {
          location : latLng,
          radius : radius ,
          types: ["mosque"]
      };
      return new Promise((resolve,reject)=>{
          service.nearbySearch(request,function(results,status){
              if(status === google.maps.places.PlacesServiceStatus.OK){
                  resolve(results);    
              }else{
                  reject(status);
              }
          }); 
      });
  
  }
  createMarker(places,latlng){

    console.log(places);
    // console.log(place.geometry.location);
    var typeMarker;
    var you       = 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png';
    // var mosque    = "https://maps.gstatic.com/mapfiles/place_api/icons/worship_islam-71.png";
    var mosque    = "http://maps.google.com/mapfiles/kml/paddle/grn-circle.png";

    console.log(places.geometry.location+" = "+latlng);

    console.log(places.types);
    if(places.types[0] != "mosque"){      
      typeMarker = {
        url: you, // url
        scaledSize: new google.maps.Size(32, 32), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 32) // anchor
      };
      console.log(typeMarker);
    }else{
      typeMarker = {
        url: mosque, // url
        scaledSize: new google.maps.Size(32, 32), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 32) // anchor
      };
      console.log(typeMarker);
    }
    console.log("end icon : "+typeMarker);
    let marker = new google.maps.Marker({
        map       : this.map,
        icon      : typeMarker,
        animation : google.maps.Animation.DROP,
        position  : places.geometry.location
    }); 
    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(this.map);
    infowindow.close(this.map, this);
    
    service.getDetails({
      placeId: places.place_id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(
            '<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '</div><br>'
          );
          infowindow.open(this.map, this);
        });
      }
    });
      
  }
  openMapsInSysApp(position){
    if (this.platform.is('ios')) {
      window.open('maps://?q=' + position, '_system');
    };
    // android
    if (this.platform.is('android')) {
      // let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + position , '_system');
    };
  }
  showConfirm() {
    let confirm = this.alert.create({
      title: 'Your GPS already disable',
      message: 'Do you want to switch on GPS?',
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
  // addMap(lat,long){
    
  //     let latLng = new google.maps.LatLng(lat, long);
  
  //     let mapOptions = {
  //       center    : latLng,
  //       zoom      : 17,
  //       mapTypeId : google.maps.MapTypeId.ROADMAP
  //     }
  
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
  //     this.getRestaurants(latLng).then((results : Array<any>)=>{
  //         this.places = results;
  //         for(let i = 0 ;i < results.length ; i++) {
  //             this.createMarker(results[i],0);
  //         }
  //     },(status)=>console.log(status));
  //     // this.addMarker();
  // }
  // // @ViewChild('map') element;
  // map: GoogleMap;
  // constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, public plt: Platform) {
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MosquePage');
  // }
  // ngAfterViewInit() {
  //   this.plt.ready().then(() => {
  //     this.initMap();
  //   });
  // }
  // initMap() {
    
  //   // let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);
  //   let mapOptions: GoogleMapOptions = {
  //     camera: {
  //       target: {
  //         lat: 43.0741904,
  //         lng: -89.3809802
  //       },
  //       zoom: 18,
  //       tilt: 30
  //     }
  //   };

  //   this.map = this.googleMaps.create('map_canvas', mapOptions);

  //   // Wait the MAP_READY before using any methods.
  //   this.map.one(GoogleMapsEvent.MAP_READY)
  //     .then(() => {
  //       console.log('Map is ready!');

  //       // Now you can use all methods safely.
  //       this.map.addMarker({
  //           title: 'Ionic',
  //           icon: 'blue',
  //           animation: 'DROP',
  //           position: {
  //             lat: 43.0741904,
  //             lng: -89.3809802
  //           }
  //         })
  //         .then(marker => {
  //           marker.on(GoogleMapsEvent.MARKER_CLICK)
  //             .subscribe(() => {
  //               alert('clicked');
  //             });
  //         });

  //     });
  //   }

}
