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
  lat         : any; 
  long        : any;
  mylocation  : any;
  places      : Array<any> ; 
  infowindow: any;
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

    this.platform.resume.subscribe(() => {
      this.loadGoogleMap(1000);
    });
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
      this.lat           = position.coords.latitude;
      this.long          = position.coords.longitude;
      let latLng        = new google.maps.LatLng(this.lat, this.long );
      this.mylocation   = latLng;
      this.addMarker(latLng,radius,position);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  addMarker(latlng,radius,position){
    // console.log(latlng);

    if(latlng.equals(this.mylocation)){
      console.log("sama");
    }else{
      console.log("beda");
    }
    if(radius <= 1000){
      var mapOptions = {
        center: latlng,
        zoom: 16,
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
    else if(radius > 4000){
      var mapOptions = {
        center: latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }
    else{
      var mapOptions = {
        center: latlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    }

    this.map    = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
    // ============================

    this.infowindow   = new google.maps.InfoWindow();
    var service       = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: latlng,
      radius: 1000,
      types: ["mosque"]
    }, (results,status) => {
      this.places = results;
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarker( results[i] , this.infowindow,latlng );
        }
      }
    });
  }
  createMarker(places , infowindow, latlng){
    // console.log(places.geometry.location);
    if(places.geometry.location.equals(this.mylocation)){
      console.log(places.geometry.location+" === "+this.mylocation);

      var meIcon = {
        url: "https://www.iconsdb.com/icons/download/royal-blue/marker-512.png", // url
        scaledSize: new google.maps.Size(48, 48), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 32) // anchor
      };
      var markerself = new google.maps.Marker({
        map       : this.map,
        icon      : meIcon,
        position  : this.mylocation
      });
      google.maps.event.addListener(markerself, 'click', function() {
        this.infowindow.setContent(places.name);
        this.infowindow.open(this.map, this);
      });

    }else{
      var mosIcon = {
        url: "https://www.iconsdb.com/icons/download/green/marker-512.png", // url
        scaledSize: new google.maps.Size(48, 48), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 32) // anchor
      };
      var marker = new google.maps.Marker({
        map       : this.map,
        icon      : mosIcon,
        position  : places.geometry.location
      });
  
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(places.name);
        infowindow.open(this.map, this);
      });
    }
    // ============================
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(this.map);

    var onChangeHandler = function() {
      this.calculateAndDisplayRoute(directionsService, directionsDisplay, latlng);
    };
      
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay, latlng) {
    directionsService.route({
      origin: this.mylocation ,
      destination: latlng,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        console.log(response);
      } else {
        console.log('Directions request failed due to ' + status);
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
