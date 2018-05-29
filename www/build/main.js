webpackJsonp([2],{

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MosquePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_diagnostic__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__custom_constant__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the MosquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MosquePage = (function () {
    function MosquePage(platform, geolocation, navCtrl, loadingCtrl, alert, diagnostic) {
        this.platform = platform;
        this.geolocation = geolocation;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alert = alert;
        this.diagnostic = diagnostic;
    }
    MosquePage.prototype.ngAfterViewInit = function () {
        console.log("afterinit");
        this.distanceVal = "1000";
        this.loadGoogleMap(1000);
        console.log("afterinit");
        // setTimeout(() => {
        //   console.log(this.abc.nativeElement.innerText);
        // }, 1000);
    };
    MosquePage.prototype.loadGoogleMap = function (radius) {
        var _this = this;
        var radiusval = parseInt(radius);
        console.log(radiusval);
        var statusDev = __WEBPACK_IMPORTED_MODULE_4__custom_constant__["a" /* GlobalVariable */].DevStatus;
        console.log(statusDev);
        if (statusDev == "true") {
            this.getLocationDetail(radiusval);
        }
        else {
            this.diagnostic.isLocationEnabled()
                .then(function (state) {
                console.log(state);
                if (state == true) {
                    _this.getLocationDetail(radiusval);
                }
                else {
                    _this.showConfirm();
                }
            }).catch(function (e) { return console.error(e); });
        }
    };
    MosquePage.prototype.getLocationDetail = function (radius) {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            console.log(position);
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var latLng = new google.maps.LatLng(lat, long);
            _this.mylocation = latLng;
            _this.addMarker(latLng, radius);
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
    };
    MosquePage.prototype.addMarker = function (latlng, radius) {
        var _this = this;
        console.log(latlng);
        if (radius <= 1000) {
            var mapOptions = {
                center: latlng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        }
        else if (radius >= 1000 && radius <= 2000) {
            var mapOptions = {
                center: latlng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        }
        else if (radius >= 2000 && radius <= 4000) {
            var mapOptions = {
                center: latlng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        }
        else {
            var mapOptions = {
                center: latlng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        }
        // this.map    = GoogleMaps.create('map_canvas', mapOptions);
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            // icon      :'assets/icon/maps/mymarker.png',
            position: this.map.getCenter()
        });
        // let content = "<p>This is your current position</p>";          
        // let infoWindow = new google.maps.InfoWindow({
        //   content: content
        // });
        // google.maps.event.addListener(marker, 'click', () => {
        //   infoWindow.open(this.map, marker);
        // });
        this.getRestaurants(latlng, radius).then(function (results) {
            _this.places = results;
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                _this.createMarker(results[i], latlng);
            }
        }, function (status) { return console.log(status); });
    };
    MosquePage.prototype.addMarkerMosque = function (latlng) {
        console.log(latlng);
        var typeMarker = {
            url: "http://maps.google.com/mapfiles/kml/paddle/grn-circle.png",
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32) // anchor
        };
        var mapOptions = {
            center: latlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        var marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            icon: typeMarker,
            animation: google.maps.Animation.DROP,
            position: latlng
        });
        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(this.map);
    };
    MosquePage.prototype.getRestaurants = function (latLng, radius) {
        var service = new google.maps.places.PlacesService(this.map);
        var request = {
            location: latLng,
            radius: radius,
            types: ["mosque"]
        };
        return new Promise(function (resolve, reject) {
            service.nearbySearch(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                }
                else {
                    reject(status);
                }
            });
        });
    };
    MosquePage.prototype.createMarker = function (places, latlng) {
        console.log(places);
        // console.log(place.geometry.location);
        var typeMarker;
        var you = 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png';
        // var mosque    = "https://maps.gstatic.com/mapfiles/place_api/icons/worship_islam-71.png";
        var mosque = "http://maps.google.com/mapfiles/kml/paddle/grn-circle.png";
        console.log(places.geometry.location + " = " + latlng);
        console.log(places.types);
        if (places.types[0] != "mosque") {
            typeMarker = {
                url: you,
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32) // anchor
            };
            console.log(typeMarker);
        }
        else {
            typeMarker = {
                url: mosque,
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32) // anchor
            };
            console.log(typeMarker);
        }
        console.log("end icon : " + typeMarker);
        var marker = new google.maps.Marker({
            map: this.map,
            icon: typeMarker,
            animation: google.maps.Animation.DROP,
            position: places.geometry.location
        });
        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(this.map);
        infowindow.close(this.map, this);
        service.getDetails({
            placeId: places.place_id
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        place.formatted_address + '</div><br>');
                    infowindow.open(this.map, this);
                });
            }
        });
    };
    MosquePage.prototype.openMapsInSysApp = function (position) {
        if (this.platform.is('ios')) {
            window.open('maps://?q=' + position, '_system');
        }
        ;
        // android
        if (this.platform.is('android')) {
            // let label = encodeURI('My Label');
            window.open('geo:0,0?q=' + position, '_system');
        }
        ;
    };
    MosquePage.prototype.showConfirm = function () {
        var _this = this;
        var confirm = this.alert.create({
            title: 'Your GPS already disable',
            message: 'Do you want to switch on GPS?',
            buttons: [
                {
                    text: 'No',
                    handler: function () {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        _this.diagnostic.switchToLocationSettings();
                    }
                }
            ]
        });
        confirm.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])('map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], MosquePage.prototype, "mapElement", void 0);
    MosquePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-mosque',template:/*ion-inline-start:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/mosque/mosque.html"*/'<!--\n  Generated template for the MosquePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header style="height:50%">\n  <ion-navbar color="newcolor">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Near Mosque</ion-title>\n  </ion-navbar>\n  <div #map id="map"></div>\n</ion-header>\n\n<!-- <ion-content padding>\n  <div style="width:100%;height: 100%;" id="map_canvas"></div> \n</ion-content> -->\n\n<ion-content no-padding>\n  \n  <!-- <div id="map_canvas"></div>  -->\n  \n  <br>\n  <!-- <div #infoMap id="infoMap"></div>  -->\n  <div style="width : 100% ;height: 60%">\n      <ion-list>\n        <ion-item>\n          <ion-label>Distance</ion-label>\n          <ion-select [(ngModel)]="distanceVal" (ionChange)="loadGoogleMap(distanceVal)">\n            <ion-option value="500">500</ion-option>\n            <ion-option value="1000">1000</ion-option>\n            <ion-option value="2000">2000</ion-option>\n            <ion-option value="3000">3000</ion-option>\n            <ion-option value="5000">5000</ion-option>\n            <ion-option value="10000">10 km</ion-option>\n          </ion-select>\n        </ion-item>\n        <ion-item (click)="addMarker(mylocation)">\n            <ion-icon name="locate" item-start></ion-icon>\n            <p>My Location </p>\n        </ion-item>\n        <ion-item-divider *ngFor="let place of places" (click)="addMarkerMosque(place.geometry.location)">\n            <p>{{place.name}}<br>\n            <small>{{place.vicinity}}</small>\n            </p>\n            <button ion-button item-end (click)="openMapsInSysApp(place.geometry.location)">Open Maps</button>\n        </ion-item-divider>\n      </ion-list>\n  </div>\n  \n  </ion-content>\n'/*ion-inline-end:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/mosque/mosque.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_diagnostic__["a" /* Diagnostic */]])
    ], MosquePage);
    return MosquePage;
}());

//# sourceMappingURL=mosque.js.map

/***/ }),

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_local_notifications__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SettingsPage = (function () {
    function SettingsPage(navCtrl, navParams, LocalNotifications) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.LocalNotifications = LocalNotifications;
        console.log("Toggled: " + this.subhNotif);
    }
    SettingsPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad SettingsPage');
        this.loadSetting();
    };
    SettingsPage.prototype.loadSetting = function () {
        //get prayMethod values --
        var prayMethod = localStorage.getItem('prayMethod');
        if (prayMethod == null || prayMethod == undefined) {
            this.prayerTimeMethod = "2";
        }
        else {
            this.prayerTimeMethod = prayMethod;
        }
        //get prayAsarMethod values --
        var prayAsarMethod = localStorage.getItem('prayAsarMethod');
        if (prayAsarMethod == null || prayAsarMethod == undefined) {
            this.prayerTimeAsarMethod = "0";
        }
        else {
            this.prayerTimeAsarMethod = prayAsarMethod;
        }
        //get notification values =======
        var subhNotifVal = localStorage.getItem('subhNotif');
        if (subhNotifVal == null || subhNotifVal == undefined) {
            this.subhNotif = false;
        }
        else {
            this.subhNotif = subhNotifVal;
        }
        var dzuhrNotifVal = localStorage.getItem('dzuhrNotif');
        if (dzuhrNotifVal == null || dzuhrNotifVal == undefined) {
            this.dzuhrNotif = false;
        }
        else {
            this.dzuhrNotif = dzuhrNotifVal;
        }
        var ashrNotifVal = localStorage.getItem('ashrNotif');
        if (ashrNotifVal == null || ashrNotifVal == undefined) {
            this.ashrNotif = false;
        }
        else {
            this.ashrNotif = ashrNotifVal;
        }
        var maghribNotifVal = localStorage.getItem('maghribNotif');
        if (maghribNotifVal == null || maghribNotifVal == undefined) {
            this.maghribNotif = false;
        }
        else {
            this.maghribNotif = maghribNotifVal;
        }
        var ishaNotifVal = localStorage.getItem('ishaNotif');
        if (ishaNotifVal == null || ishaNotifVal == undefined) {
            this.ishaNotif = false;
        }
        else {
            this.ishaNotif = ishaNotifVal;
        }
    };
    SettingsPage.prototype.notifySubh = function () {
        console.log("Toggled: " + this.subhNotif);
        if (this.subhNotif == true) {
            console.log("subuh true value: " + this.subhNotif);
            localStorage.setItem('subhNotif', this.subhNotif);
        }
        else {
            console.log("subuh false value: " + this.subhNotif);
            localStorage.setItem('subhNotif', this.subhNotif);
        }
    };
    SettingsPage.prototype.notifyDzuhr = function () {
        if (this.dzuhrNotif == true) {
            localStorage.setItem('dzuhrNotif', this.dzuhrNotif);
        }
        else {
            localStorage.setItem('dzuhrNotif', this.dzuhrNotif);
        }
    };
    SettingsPage.prototype.notifyAshr = function () {
        if (this.ashrNotif == true) {
            localStorage.setItem('ashrNotif', this.ashrNotif);
        }
        else {
            localStorage.setItem('ashrNotif', this.ashrNotif);
        }
    };
    SettingsPage.prototype.notifyMaghrib = function () {
        if (this.maghribNotif == true) {
            localStorage.setItem('maghribNotif', this.maghribNotif);
        }
        else {
            localStorage.setItem('maghribNotif', this.maghribNotif);
        }
    };
    SettingsPage.prototype.notifyIsha = function () {
        if (this.ishaNotif == true) {
            localStorage.setItem('ishaNotif', this.ishaNotif);
        }
        else {
            localStorage.setItem('ishaNotif', this.ishaNotif);
        }
    };
    SettingsPage.prototype.updatePrayerTimeMethod = function (item) {
        localStorage.setItem('prayMethod', item);
        var setNow = localStorage.getItem('prayMethod');
        console.log('item is set : ' + setNow);
    };
    SettingsPage.prototype.updatePrayerTimeAsarMethod = function (item) {
        localStorage.setItem('prayAsarMethod', item);
        var setNow = localStorage.getItem('prayAsarMethod');
        console.log('item is set : ' + setNow);
    };
    SettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-settings',template:/*ion-inline-start:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/settings/settings.html"*/'<!--\n  Generated template for the SettingsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n    <ion-navbar color="newcolor">\n      <button ion-button menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>Settings</ion-title>\n    </ion-navbar>\n    \n  </ion-header>\n\n<ion-content>\n  <ion-item-group>\n    <ion-item-divider color="light">Payer Time</ion-item-divider>\n    <ion-item>\n\n      <ion-label>Prayer Time Method</ion-label>\n      <ion-select [(ngModel)]="prayerTimeMethod" (ionChange)="updatePrayerTimeMethod($event)">\n        <ion-option value="1"> University of Islamic Sciences, Karachi</ion-option>\n        <ion-option value="2"> Islamic Society of North America (ISNA)</ion-option>\n        <ion-option value="3"> Muslim World League (MWL)</ion-option>\n        <ion-option value="4"> Umm al-Qura, Makkah</ion-option>\n        <ion-option value="5"> Egyptian General Authority of Survey</ion-option>\n      </ion-select>\n      \n    </ion-item>\n    <ion-item>\n      \n      <ion-label>Asar Method</ion-label>\n      <ion-select [(ngModel)]="prayerTimeAsarMethod" (ionChange)="updatePrayerTimeAsarMethod($event)">\n        <ion-option value="0"> Shafii</ion-option>\n        <ion-option value="1"> Hanafi</ion-option>\n      </ion-select>\n\n    </ion-item>\n  </ion-item-group>\n  <ion-item-group>\n    <ion-item-divider color="light">Notification</ion-item-divider>\n    <ion-item>\n      <ion-label>Subh</ion-label>\n      <ion-toggle [(ngModel)]="subhNotif" (ionChange)="notifySubh()"></ion-toggle>\n    </ion-item>\n    <ion-item>\n      <ion-label>Dzuhr</ion-label>\n      <ion-toggle [(ngModel)]="dzuhrNotif" (ionChange)="notifyDzuhr()"></ion-toggle>\n    </ion-item>\n    <ion-item>\n      <ion-label>Ashr</ion-label>\n      <ion-toggle [(ngModel)]="ashrNotif" (ionChange)="notifyAshr()"></ion-toggle>\n    </ion-item>\n    <ion-item>\n      <ion-label>Maghrib</ion-label>\n      <ion-toggle [(ngModel)]="maghribNotif" (ionChange)="notifyMaghrib()"></ion-toggle>\n    </ion-item>\n    <ion-item>\n      <ion-label>Isha</ion-label>\n      <ion-toggle [(ngModel)]="ishaNotif" (ionChange)="notifyIsha()"></ion-toggle>\n    </ion-item>\n  </ion-item-group>\n\n</ion-content>\n'/*ion-inline-end:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/settings/settings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_local_notifications__["a" /* LocalNotifications */]])
    ], SettingsPage);
    return SettingsPage;
}());

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 121:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 121;

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/mosque/mosque.module": [
		421,
		1
	],
	"../pages/settings/settings.module": [
		422,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 162;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalVariable; });
var GlobalVariable = (function () {
    function GlobalVariable() {
    }
    //    static readonly baseUrl: string = 'http://127.0.0.1/rest/web/app_dev.php/api/';
    GlobalVariable.URL1 = "http://example.com";
    GlobalVariable.URL2 = "http://example2.com";
    // static readonly DevStatus: string   = "false";
    GlobalVariable.DevStatus = "true";
    return GlobalVariable;
}());

;
//# sourceMappingURL=constant.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_diagnostic__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_local_notifications__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_openweathermap_openweathermap__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_services_services__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__custom_constant__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_autostart__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_insomnia__ = __webpack_require__(330);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//ionic native import -------



//provider import -----------






var HomePage = (function () {
    function HomePage(insomnia, autostart, http, navCtrl, loadingCtrl, LocalNotifications, alert, datePipe, services, diagnostic, geolocation, openWeatherProvider) {
        this.insomnia = insomnia;
        this.autostart = autostart;
        this.http = http;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.LocalNotifications = LocalNotifications;
        this.alert = alert;
        this.datePipe = datePipe;
        this.services = services;
        this.diagnostic = diagnostic;
        this.geolocation = geolocation;
        this.openWeatherProvider = openWeatherProvider;
        this.statusDev = __WEBPACK_IMPORTED_MODULE_10__custom_constant__["a" /* GlobalVariable */].DevStatus;
        this.options = {};
        this.weatherIcons = './assets/json/weaterIcons.json';
        this.latExist = localStorage.getItem('latExist');
        this.longExist = localStorage.getItem('longExist');
        this.subuhNotif = localStorage.getItem('subuhNotif');
        this.dzuhurNotif = localStorage.getItem('dzuhurNotif');
        this.asharNotif = localStorage.getItem('asharNotif');
        this.maghribNotif = localStorage.getItem('maghribNotif');
        this.isyaNotif = localStorage.getItem('isyaNotif');
        this.selectSubhNow = false;
        this.selectDuhrNow = false;
        this.selectAshrNow = false;
        this.selectMagrNow = false;
        this.selectIsyaNow = false;
        this.showPrayNowStatus = true;
        this.notifications = [];
        this.loader = this.loadingCtrl.create({
            content: 'loading...'
        });
        // this.options = {
        //   apikey      : "c41672d1fb5c256039a28c7debd84bcd",
        //   city        : { "name": ["Phnom Penh"] },
        //   unitFormat  : "metric",
        //   lang        : "en"
        // }
    }
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.weatherIcon = "assets/icon/weather/no-weather.png";
        this.autostart.enable();
        this.insomnia.keepAwake()
            .then(function () { return console.log('success'); }, function () { return console.log('error'); });
        this.insomnia.allowSleepAgain()
            .then(function () { return console.log('success'); }, function () { return console.log('error'); });
        this.loader.present().then(function () {
            // loader.dismiss().catch((ERROR) => console.log('ERROR CATCH: LoadingController dismiss'+ERROR));
            // setTimeout(() => {
            //     loader.dismiss();
            // }, 5000);
            _this.getLocation();
        });
    };
    HomePage.prototype.getDateTimeNow = function () {
        this.today = new Date(); // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
        var datetext = this.today.toTimeString(); // datestring is "20:32:01 GMT+0530 (India Standard Time)" ,  Split with ' ' and we get: ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"] , Take the first value from array :)
        datetext = datetext.split(' ')[0];
        var already = this.datePipe.transform(this.today, 'yyyy-MM-dd');
        var dateNow = new Date(already + " " + datetext);
        return dateNow;
    };
    HomePage.prototype.getDateTimePray = function (timeValue) {
        // console.log("timeValue");
        // console.log(timeValue);
        this.today = new Date(); // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
        var datetext = timeValue + ":00";
        var already = this.datePipe.transform(this.today, 'yyyy-MM-dd'); //whatever format you need. 
        var dateNow = new Date(already + " " + datetext);
        // console.log(dateNow);
        return dateNow;
    };
    HomePage.prototype.getLocation = function () {
        var _this = this;
        if (this.statusDev == "true") {
            this.getLocationDetail(0, 0);
        }
        else {
            this.diagnostic.isLocationEnabled().then(function (state) {
                // console.log(state);
                if (state == true) {
                    console.log("location enable");
                    _this.getLocationDetail(0, 0);
                }
                else {
                    if (_this.latExist == null || _this.latExist == undefined && _this.longExist == null || _this.longExist == undefined) {
                        console.log("location disable with NULL localstorage");
                        var title = "Notice";
                        var message = "Your GPS is Disable , Do you want to switch on GPS?";
                        _this.showConfirm(title, message);
                        _this.loader.dismiss();
                    }
                    else {
                        console.log("location disable with localstorage");
                        _this.getLocationDetail(_this.latExist, _this.longExist);
                    }
                }
            }).catch(function (e) {
                console.error(e);
                _this.loader.dismiss();
            });
        }
    };
    HomePage.prototype.getLocationDetail = function (latitide, longitude) {
        var _this = this;
        console.log("latitide : " + latitide + " AND longitude  : " + longitude);
        if (latitide != 0 && longitude != 0) {
            var options = {
                apikey: "c41672d1fb5c256039a28c7debd84bcd",
                city: { "geo": [{ "lat": latitide, "lon": longitude }] },
                unitFormat: "metric",
                lang: "en"
            };
            this.getWeather(options);
            this.getPrayerTime(latitide, longitude, 0);
            this.getHijriCalendar();
            // if(this.statusDev !=  "true"){
            this.doSetNotification(latitide, longitude, 0);
            // }
        }
        else {
            this.geolocation.getCurrentPosition().then(function (position) {
                console.log(position);
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                var longLatSet = {
                    latitude: lat.toString(),
                    longitude: long.toString()
                };
                localStorage.setItem('latExist', lat.toString());
                localStorage.setItem('longExist', long.toString());
                var options = {
                    apikey: "c41672d1fb5c256039a28c7debd84bcd",
                    city: { "geo": [{ "lat": lat, "lon": long }] },
                    unitFormat: "metric",
                    lang: "en"
                };
                _this.getWeather(options);
                _this.getPrayerTime(lat, long, 0);
                _this.getHijriCalendar();
                // if(this.statusDev !=  "true"){
                _this.doSetNotification(lat, long, 0);
                // }
            }).catch(function (error) {
                console.log('Error getting location', error);
                _this.loader.dismiss();
            });
        }
    };
    HomePage.prototype.getGreetingTime = function (sunrise, sunset, statday) {
        var now = this.getDateTimeNow();
        console.log("=======================================");
        console.log(now + ">" + sunrise);
        console.log(now + "<" + sunset);
        if (statday == 0) {
            if (now > sunrise && now < sunset) {
                this.daySeasonNow = "light";
            }
            else {
                var sunriseTomorrow = new Date(sunrise.setDate(sunrise.getDate() + 1));
                if (now > sunset && now < sunriseTomorrow) {
                    this.daySeasonNow = "night";
                }
                else {
                    this.daySeasonNow = "light";
                }
            }
        }
        else {
            this.daySeasonNow = "night";
        }
    };
    HomePage.prototype.getGPSStatus = function () {
    };
    HomePage.prototype.getWeather = function (options) {
        var _this = this;
        this.openWeatherProvider.load(options).then(function (weather) {
            console.log(weather);
            if (weather.coords == "") {
            }
            else {
            }
            var weatherNow = weather.weather[0].main;
            var weatherNow = weather.weather[0].main;
            var weatherNow = weather.weather[0].main;
            _this.weatherTitle = weatherNow;
            _this.weatherDesc = weather.weather[0].description;
            _this.weatherCity = weather.name;
            console.log(weather.name);
            _this.weatherTempNow = Math.round(weather.main.temp);
            _this.weatherTempHigh = weather.main.temp_max;
            _this.weatherTempLow = weather.main.temp_min;
            _this.weatherHumidity = weather.main.humidity;
            _this.weatherPressure = weather.main.pressure;
            // this.getIconsWeather(weather);
            if (weatherNow == "Haze" || weatherNow == "Mist" || weatherNow == "Fog") {
                _this.weatherIcon = "assets/icon/weather/Haze.png";
            }
            else if (weatherNow == "Snow") {
                _this.weatherIcon = "assets/icon/weather/Snow.png";
            }
            else if (weatherNow == "Thunderstorm") {
                _this.weatherIcon = "assets/icon/weather/Thunderstorms.png";
            }
            else if (weatherNow == "Clear") {
                _this.weatherIcon = "assets/icon/weather/Sunny.png";
            }
            else if (weatherNow == "Rain") {
                _this.weatherIcon = "assets/icon/weather/Drizzle.png";
            }
            else if (weatherNow == "Clouds") {
                _this.weatherIcon = "assets/icon/weather/Cloudy.png";
            }
            else {
                _this.weatherIcon = "assets/icon/weather/Mostly Cloudy.png";
            }
            console.log(weatherNow);
        }).catch(function (error) {
            console.log('error get weather : ', error);
        });
    };
    HomePage.prototype.getIconsWeather = function (weather) {
        var _this = this;
        console.log("GET ICONS");
        this.http.get(this.weatherIcons).toPromise().then(function (response) {
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
            _this.weatherIcon = prefix + icon;
            console.log("GET ICONS ::: " + _this.weatherIcon);
            // }
        }).catch(function (err) {
            console.log(err);
        });
    };
    HomePage.prototype.getPrayerTime = function (lat, long, stat) {
        var _this = this;
        this.notifyTime = __WEBPACK_IMPORTED_MODULE_11_moment__(new Date()).format();
        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();
        this.services.prayerTime(lat, long).then(function (prayerTimes) {
            if (prayerTimes == null || prayerTimes == undefined) {
                _this.loader.dismiss();
                var title = "Notice";
                var message = "Failed Get Data";
                _this.showAlert(title, message);
            }
            else {
                // console.log(prayerTimes);
                var prayerData = prayerTimes.data.timings;
                _this.prayerSubuh = prayerData.Fajr;
                _this.prayerSyuruq = prayerData.Sunrise;
                _this.prayerDzhuhur = prayerData.Dhuhr;
                _this.prayerAshar = prayerData.Asr;
                _this.prayerMaghrib = prayerData.Maghrib;
                _this.prayerIsya = prayerData.Isha;
                var now = _this.getDateTimeNow();
                var subuhTime = _this.getDateTimePray(_this.prayerSubuh);
                var syuruqTime = _this.getDateTimePray(_this.prayerSyuruq);
                var dzuhurTime = _this.getDateTimePray(_this.prayerDzhuhur);
                var asharTime = _this.getDateTimePray(_this.prayerAshar);
                var maghribTime = _this.getDateTimePray(_this.prayerMaghrib);
                var isyaTime = _this.getDateTimePray(_this.prayerIsya);
                _this.getGreetingTime(syuruqTime, maghribTime, 0);
                // var subuhTimeTomorrow   = subuhTime.setDate(subuhTime.getDate() + 1);
                console.log(now.toISOString().slice(0, 10).replace(/-/g, ' ') + " > " + subuhTime.toISOString().slice(0, 10).replace(/-/g, ' '));
                console.log(" AND " + now.toISOString().slice(0, 10).replace(/-/g, ' ') + " < " + dzuhurTime.toISOString().slice(0, 10).replace(/-/g, ' '));
                if (now > subuhTime && now < dzuhurTime) {
                    console.log("in subuh to dzuhur");
                    if (now > subuhTime && now < syuruqTime) {
                        _this.prayTimeNow = "SUBUH";
                        _this.selectIsyaNow = false;
                        _this.selectSubhNow = true;
                        _this.nextSHolahName = "SUBUH";
                        _this.hoursRemaining = "NOW";
                        setTimeout(function () {
                            _this.startTimer(dzuhurTime, "DZUHUR");
                        }, 10000);
                    }
                    else {
                        _this.startTimer(dzuhurTime, "DZUHUR");
                    }
                }
                else if (now > dzuhurTime && now < asharTime) {
                    console.log("in dzuhur time");
                    _this.prayTimeNow = "DZUHUR";
                    _this.selectSubhNow = false;
                    _this.selectDuhrNow = true;
                    _this.nextSHolahName = "DZUHUR";
                    _this.hoursRemaining = "NOW";
                    setTimeout(function () {
                        _this.startTimer(asharTime, "ASHAR");
                    }, 10000);
                }
                else if (now > asharTime && now < maghribTime) {
                    console.log("in ashar time");
                    _this.prayTimeNow = "ASHAR";
                    _this.selectDuhrNow = false;
                    _this.selectAshrNow = true;
                    _this.nextSHolahName = "ASHAR";
                    _this.hoursRemaining = "NOW";
                    setTimeout(function () {
                        _this.startTimer(maghribTime, "MAGHRIB");
                    }, 10000);
                }
                else if (now > maghribTime && now < isyaTime) {
                    console.log("in maghrib time");
                    _this.prayTimeNow = "MAGHRIB";
                    _this.selectAshrNow = false;
                    _this.selectMagrNow = true;
                    _this.nextSHolahName = "MAGHRIB";
                    _this.hoursRemaining = "NOW";
                    setTimeout(function () {
                        _this.startTimer(isyaTime, "ISYA");
                    }, 10000);
                }
                else {
                    console.log("in isya time");
                    console.log("=======================================");
                    console.log("=======================================");
                    console.log(now + "<" + subuhTime);
                    if (now < subuhTime) {
                        console.log(3);
                        var subuhTimeTomorrow = new Date(subuhTime.setDate(subuhTime.getDate() + 1));
                        _this.prayTimeNow = "ISYA";
                        _this.selectIsyaNow = true;
                        _this.nextSHolahName = "ISYA";
                        _this.hoursRemaining = "NOW";
                        _this.getGreetingTime(syuruqTime, maghribTime, 1);
                        setTimeout(function () {
                            _this.startTimer(subuhTimeTomorrow, "SUBUH");
                        }, 10000);
                    }
                    else {
                        if (stat == 1) {
                            console.log("in else with stat 1");
                            var isyaTimeLate = new Date(isyaTime.setDate(isyaTime.getDate() - 1));
                            console.log("isyaTimeLate : " + isyaTimeLate + "AND SUBUH TIME : " + subuhTime);
                            if (now > isyaTimeLate && now < subuhTime) {
                                console.log(2);
                                console.log(now + " > " + isyaTime + " AND " + now + " < " + subuhTime);
                                _this.prayTimeNow = "ISYA";
                                _this.selectMagrNow = false;
                                _this.selectIsyaNow = true;
                                _this.startTimer(subuhTime, "SUBUH");
                            }
                            else {
                                _this.showPrayNowStatus = false;
                            }
                        }
                        else {
                            console.log("in else with stat 0");
                            var subuhTimeTomorrow = new Date(subuhTime.setDate(subuhTime.getDate() + 1));
                            console.log(subuhTimeTomorrow);
                            if (now > isyaTime && now < subuhTimeTomorrow) {
                                console.log(3);
                                _this.prayTimeNow = "ISYA";
                                _this.selectIsyaNow = true;
                                _this.nextSHolahName = "ISYA";
                                _this.hoursRemaining = "NOW";
                                setTimeout(function () {
                                    _this.startTimer(subuhTimeTomorrow, "SUBUH");
                                }, 10000);
                            }
                            else {
                                _this.showPrayNowStatus = false;
                            }
                        }
                    }
                }
                // this.loadingCtrl;
                _this.loader.dismiss();
            }
        }).catch(function (error) {
            console.log('error get weather : ', error);
            _this.loader.dismiss();
            var title = "Notice";
            var message = "Your GPS is Disable , Do you want to switch on GPS?";
            _this.showAlert(title, message);
        });
    };
    HomePage.prototype.getHijriCalendar = function () {
        var _this = this;
        this.services.hijriCalendar().then(function (dateValue) {
            // console.log(dateValue);
            var hijriDay = dateValue.data.hijri;
            var gregoDay = dateValue.data.gregorian;
            _this.hijriToday = hijriDay.day + " " + hijriDay.month.en + " " + hijriDay.year;
            _this.gregorianToday = gregoDay.day + " " + gregoDay.month.en + " " + gregoDay.year;
        }).catch(function (error) {
            console.log(error);
        });
    };
    // COUNTDOWN TIMER -----
    HomePage.prototype.startTimer = function (timeNextPray, nextSholah) {
        var _this = this;
        this.nextSHolahName = "to " + nextSholah;
        this.interval = setInterval(function () {
            var now = new Date().getTime();
            var distance = timeNextPray - now; // Find the distance between now an the count down date
            // Time calculations for days, hours, minutes and seconds -----
            // var days      = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // console.log(hours + "h " + minutes + "m " + seconds + "s ");
            if (new Date().getHours() == 23 && new Date().getMinutes() == 59 && new Date().getSeconds() == 59) {
                setTimeout(function () {
                    _this.getPrayerTime(_this.latExist, _this.longExist, 1);
                }, 1000);
            }
            // If the count down is finished
            if (distance < 0) {
                console.log("EXPIRED");
                setTimeout(function () {
                    _this.doChangePrayerTime();
                }, 1000);
                clearInterval(_this.interval);
            }
            else {
                _this.hoursRemaining = hours + "h " + minutes + "m " + seconds + "s ";
            }
        }, 1000);
    };
    HomePage.prototype.doChangePrayerTime = function () {
        console.log("change prayer time");
        this.getLocation();
    };
    // NOTIF AND ALERT -----
    HomePage.prototype.doReadNotif = function () {
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
    };
    HomePage.prototype.doSetNotif = function (timeSet, prayerName) {
    };
    HomePage.prototype.doSetNotification = function (lat, lng, prayerName) {
        var _this = this;
        for (var i = 0; i < 7; i++) {
            var dayWeek = new Date(new Date().setDate(new Date().getDate() + i));
            var dayWeekConv = Math.round((dayWeek).getTime() / 1000);
            ;
            console.log("cobaTime :: " + dayWeekConv);
            //aaa
            this.services.prayerTimeForNotif(lat, lng, dayWeekConv).then(function (prayerTimes) {
                if (prayerTimes != null || prayerTimes != undefined) {
                    // console.log(prayerTimes);
                    var dayDate = prayerTimes.data.date.timestamp;
                    var prayerData = prayerTimes.data.timings;
                    var subhNotifVal = localStorage.getItem('subhNotif');
                    if (subhNotifVal == true.toString()) {
                        // var idSubh          = "subuh"+i;
                        var idSubh = "subuh";
                        var subh = prayerData.Fajr;
                        _this.setNotificationTime(dayDate, subh, 1 + i, "SUBH");
                    }
                    var dzuhrNotifVal = localStorage.getItem('dzuhrNotif');
                    if (dzuhrNotifVal == true.toString()) {
                        // var idDzhur         = "dzuhur"+i;
                        var idDzhur = "dzuhur";
                        var dzhur = prayerData.Dhuhr;
                        ;
                        _this.setNotificationTime(dayDate, dzhur, 2 + i, "DZUHR");
                    }
                    var ashrNotifVal = localStorage.getItem('ashrNotif');
                    if (ashrNotifVal == true.toString()) {
                        // var idAshr          = "ashar"+i;
                        var idAshr = "ashar";
                        var ashr = prayerData.Asr;
                        _this.setNotificationTime(dayDate, ashr, 3 + i, "ASR");
                    }
                    var maghribNotifVal = localStorage.getItem('maghribNotif');
                    if (maghribNotifVal == true.toString()) {
                        // var idMaghr         = "maghrib"+i;
                        var idMaghr = "maghrib";
                        var maghr = prayerData.Maghrib;
                        _this.setNotificationTime(dayDate, maghr, 4 + i, "MAGHRIB");
                    }
                    var ishaNotifVal = localStorage.getItem('ishaNotif');
                    if (ishaNotifVal == true.toString()) {
                        // var idIsha          = "isya"+i;
                        var idIsha = "isya";
                        var isha = prayerData.Isha;
                        _this.setNotificationTime(dayDate, isha, 5 + i, "ISHA");
                    }
                }
                else {
                    console.log("prayerTimes null");
                    // console.log(prayerTimes);
                }
            });
        }
        // var title   = "Success";
        // var message = "Notification of Sholah "+prayerName+" in "+timeSet+" is set now";
        // this.showAlert(title,message);
    };
    HomePage.prototype.setNotificationTime = function (dayDate, sholahTime, id, sholahName) {
        console.log("subhNotifVal.toString()");
        var NotificationTime = new Date(parseInt(dayDate) * 1000);
        var strs;
        var timess = sholahTime + ":00";
        strs = timess.split(":");
        NotificationTime.setHours(strs[0]);
        NotificationTime.setMinutes(strs[1]);
        NotificationTime.setSeconds(strs[2]);
        console.log(NotificationTime);
        // console.log(id);
        if (this.statusDev == "true") {
            console.log("this development ,  cannot create notifications");
        }
        else {
            if (new Date() > NotificationTime) {
                // action this
            }
            else {
                console.log(NotificationTime);
                this.LocalNotifications.schedule({
                    id: id,
                    title: 'Assalamu Alaikum',
                    text: 'Now time is ' + sholahName + ' , lets Sholah !',
                    at: NotificationTime
                });
                // console.log(new Date(new Date().getTime() + 3600));
                this.LocalNotifications.getAllTriggered().then(function (result) {
                    console.log(result);
                });
                console.log("notification " + id + " created in " + NotificationTime);
            }
        }
    };
    HomePage.prototype.showConfirm = function (title, message) {
        var _this = this;
        var confirm = this.alert.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'No',
                    handler: function () {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        _this.diagnostic.switchToLocationSettings();
                    }
                }
            ]
        });
        confirm.present();
    };
    HomePage.prototype.showAlert = function (title, message) {
        var confirm = this.alert.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Oke',
                    handler: function () {
                        console.log('Disagree clicked');
                    }
                }
            ]
        });
        confirm.present();
    };
    HomePage.prototype.doRefresh = function (refresher) {
        console.log('Begin async operation', refresher);
        // this.ionViewDidLoad();
        clearInterval(this.interval);
        this.getLocation();
        setTimeout(function () {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Number)
    ], HomePage.prototype, "timeInSeconds", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar color="newcolor">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Prayers Time</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content no-padding [ngClass]="{\'light\': daySeasonNow == \'light\', \'night\': daySeasonNow == \'night\'}">\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n\n    <div id="current-weather">\n        <h3 text-center><b style="font-size:20px;">{{weatherCity}}</b></h3>\n        <ion-grid>\n                <ion-row>\n                    <ion-col text-center>\n                        <div class="icon"><img src="{{weatherIcon}}" style="width:70%;height:70%;" alt=""></div>\n                    </ion-col>\n                    <ion-col text-left>\n                        \n                        <ion-col col-6 style="font-size:24px;">\n                            {{weatherTempNow}}&deg; \n                        </ion-col>\n                        <br>\n                        <span style="font-size:12px;">{{weatherDesc}}</span>\n                    </ion-col>\n                    <ion-col text-left>\n                        \n                    </ion-col>\n                </ion-row>\n            </ion-grid>\n        <ion-col>\n                <!-- {{weatherTempNow}}&deg;  -->\n        </ion-col>\n    </div>\n    <div padding class=\'content-prayer\'>\n        <br>\n        <ion-list no-lines>\n            <ion-item [class.bold]="selectSubhNow" (click)="doSetNotif(prayerSubuh,\'Subuh\')">\n                <div item-left>Subuh</div>\n                <div item-right>{{ prayerSubuh }}</div>\n            </ion-item>\n            <ion-item [class.bold]="selectDuhrNow" (click)="doSetNotif(prayerDzhuhur,\'Dzuhur\')">\n                <div item-left>Dzuhr</div>\n                <div item-right>{{ prayerDzhuhur }}</div>\n            </ion-item>\n            <ion-item [class.bold]="selectAshrNow" (click)="doSetNotif(prayerAshar,\'Ashar\')">\n                <div item-left>Ashr</div>\n                <div item-right>{{ prayerAshar }}</div>\n            </ion-item>\n            <ion-item [class.bold]="selectMagrNow" (click)="doSetNotif(prayerMaghrib,\'Maghrib\')">\n                <div item-left>Maghrib</div>\n                <div item-right>{{ prayerMaghrib }}</div>\n            </ion-item>\n            <ion-item [class.bold]="selectIsyaNow" (click)="doSetNotif(prayerIsya,\'Isya\')">\n                <div item-left>Isya</div>\n                <div item-right>{{ prayerIsya }}</div>\n            </ion-item>\n        </ion-list>\n    </div>\n\n</ion-content>\n<ion-footer>\n    <ion-item no-lines>\n        {{gregorianToday}}<br>\n		<small>{{hijriToday}}</small>\n        <div item-right style="padding-right:10px;" [class.hide]="!showPrayNowStatus">\n            <small>{{ hoursRemaining }}</small>\n            <h1>\n                {{ nextSHolahName }}\n            </h1>\n        </div>\n    </ion-item>\n</ion-footer>'/*ion-inline-end:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/home/home.html"*/
        }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_13__ionic_native_insomnia__["a" /* Insomnia */], __WEBPACK_IMPORTED_MODULE_12__ionic_native_autostart__["a" /* Autostart */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_local_notifications__["a" /* LocalNotifications */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1__angular_common__["d" /* DatePipe */], __WEBPACK_IMPORTED_MODULE_9__providers_services_services__["a" /* ServicesProvider */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_8__providers_openweathermap_openweathermap__["a" /* OpenWeatherMapProvider */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenWeatherMapProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OpenWeatherMapProvider = (function () {
    function OpenWeatherMapProvider(http) {
        this.http = http;
        this.apiURl = "http://api.openweathermap.org/data/2.5/weather?";
        this.city = "";
        this.unitFormat = "metric";
        this.lang = "en";
        this.data = null;
    }
    OpenWeatherMapProvider.prototype.load = function (options) {
        var _this = this;
        this.data = null;
        // this.apiURl = this.formAPIUrl(options);
        if (this.data) {
            console.log("masuk this data");
            console.log(this.data);
            return Promise.resolve(this.data);
        }
        var paramsCity;
        var url;
        if (options.unitFormat) {
            this.unitFormat = options.unitFormat;
        }
        if (options.lang) {
            this.lang = options.lang;
        }
        if (options.city) {
            paramsCity = this.formCityQuery(options.city);
        }
        url = this.apiURl + paramsCity + '&units=' + options.unitFormat + '&lang=' + this.lang + '&appid=' + options.apikey;
        return new Promise(function (resolve) {
            _this.http.get(url)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.data = data;
                resolve(_this.data);
            });
        });
    };
    OpenWeatherMapProvider.prototype.formCityQuery = function (cityParams) {
        var query;
        if (cityParams.hasOwnProperty('name')) {
            query = "q=" + cityParams['name'][0];
        }
        if (cityParams.hasOwnProperty('geo')) {
            var coordinates = cityParams['geo'];
            if (coordinates[0]) {
                query = "lat=" + coordinates[0]['lat'] + '&lon=' + coordinates[0]['lon'];
            }
        }
        if (cityParams.hasOwnProperty('zip')) {
            var zip = cityParams['zip'];
            if (zip[0]) {
                query = "zip=" + zip[0]['code'] + ',' + zip[0]['country'];
            }
        }
        return query;
    };
    // formAPIUrl(options) {
    //   var paramsCity: string;
    //   var url: string; 
    //   if(options.unitFormat) {
    //     this.unitFormat = options.unitFormat;
    //   }
    //   if(options.lang) {
    //     this.lang = options.lang;
    //   }
    //   if(options.city) {
    //     paramsCity = this.formCityQuery(options.city);
    //   }
    //   url = this.apiURl+paramsCity+'&units='+options.unitFormat+'&lang='+this.lang+'&appid='+options.apikey;
    //   return url;
    // }
    OpenWeatherMapProvider.prototype.setWindSpeed = function (windSpeed) {
        this.windSpeed = windSpeed;
    };
    OpenWeatherMapProvider.prototype.setTemperature = function (temperature) {
        this.temperature = temperature;
    };
    OpenWeatherMapProvider.prototype.setHumidity = function (humidity) {
        this.humidity = humidity;
    };
    OpenWeatherMapProvider.prototype.setMinTemp = function (minTemp) {
        this.minTemp = minTemp;
    };
    OpenWeatherMapProvider.prototype.setMaxTemp = function (maxTemp) {
        this.maxTemp = maxTemp;
    };
    OpenWeatherMapProvider.prototype.setAthmosphericPressure = function (athmosphericPressure) {
        this.athmosphericPressure = athmosphericPressure;
    };
    OpenWeatherMapProvider.prototype.setWeatherGroup = function (weatherGroup) {
        this.weatherGroup = weatherGroup;
    };
    OpenWeatherMapProvider.prototype.setWeatherDescription = function (weatherDescription) {
        this.weatherDescription = weatherDescription;
    };
    OpenWeatherMapProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], OpenWeatherMapProvider);
    return OpenWeatherMapProvider;
}());

//# sourceMappingURL=openweathermap.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServicesProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(205);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ServicesProvider = (function () {
    function ServicesProvider(http, storage) {
        this.http = http;
        this.storage = storage;
        // private apiURl: string = "https://time.siswadi.com/pray/?";
        this.apiURl = "http://api.aladhan.com/timings/";
        this.apiURls = "http://api.aladhan.com/";
        console.log('Hello ServicesProvider Provider');
        this.data = null;
    }
    ServicesProvider.prototype.prayerTime = function (lat, long) {
        var _this = this;
        this.data = null;
        // this.apiURl = this.formAPIUrlPrayerTime(lat,long);
        if (this.data) {
            return Promise.resolve(this.data);
        }
        this.storage.set('prayertime', '3');
        var paramsCity;
        var url;
        var method;
        var school;
        var now = Math.round((new Date()).getTime() / 1000);
        // this.local    = new Storage(LocalStorage);
        this.prayMethod = localStorage.getItem("prayMethod");
        this.prayAsarMethod = localStorage.getItem("prayAsarMethod");
        if (this.prayMethod == null || this.prayMethod == undefined) {
            method = "5";
        }
        if (this.prayAsarMethod == null || this.prayAsarMethod == undefined) {
            school = "0";
        }
        var url = this.apiURl + now + '?latitude=' + lat + '&longitude=' + long + '&method=' + method + '&school=' + school;
        return new Promise(function (resolve) {
            _this.http.get(url)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.data = data;
                resolve(_this.data);
            });
        });
    };
    ServicesProvider.prototype.prayerTimeForNotif = function (lat, long, DateRequest) {
        var _this = this;
        this.data = null;
        // this.apiURl = this.formAPIUrlPrayerTime(lat,long);
        if (this.data) {
            return Promise.resolve(this.data);
        }
        this.storage.set('prayertime', '3');
        var paramsCity;
        var url;
        var method;
        var school;
        // var now       = Math.round((DateRequest).getTime() / 1000);
        // this.local    = new Storage(LocalStorage);
        this.prayMethod = localStorage.getItem("prayMethod");
        this.prayAsarMethod = localStorage.getItem("prayAsarMethod");
        if (this.prayMethod == null || this.prayMethod == undefined) {
            method = "5";
        }
        if (this.prayAsarMethod == null || this.prayAsarMethod == undefined) {
            school = "0";
        }
        var url = this.apiURl + DateRequest + '?latitude=' + lat + '&longitude=' + long + '&method=' + method + '&school=' + school;
        console.log(url);
        return new Promise(function (resolve) {
            _this.http.get(url)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.data = data;
                resolve(_this.data);
            });
        });
    };
    ServicesProvider.prototype.hijriCalendar = function () {
        var _this = this;
        // this.apiURls = this.formAPIUrlHijriCalendar();
        this.dataHijri = null;
        if (this.dataHijri) {
            return Promise.resolve(this.dataHijri);
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = 0 + dd;
        }
        if (mm < 10) {
            mm = 0 + mm;
        }
        var todayss = dd + '-' + mm + '-' + yyyy;
        var url = "http://api.aladhan.com/gToH?date=" + todayss;
        return new Promise(function (resolve) {
            _this.http.get(url)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                console.log(data);
                _this.dataHijri = data;
                resolve(_this.dataHijri);
            });
        });
    };
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
    ServicesProvider.prototype.setEmail = function (email) {
        this.storage.set('email', email);
    };
    //get the stored 
    ServicesProvider.prototype.getLocalStorage = function (param) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.set('name', 'Max');
            _this.storage.get(param).then(function (result) {
                resolve(result);
            }, (function (error) {
                reject(error);
            }));
        });
    };
    //delete the email address
    ServicesProvider.prototype.removeEmail = function () {
        this.storage.remove('email').then(function () {
            console.log('email is removed');
        });
    };
    //clear the whole local storage
    ServicesProvider.prototype.clearStorage = function () {
        this.storage.clear().then(function () {
            console.log('all keys are cleared');
        });
    };
    ServicesProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], ServicesProvider);
    return ServicesProvider;
}());

//# sourceMappingURL=services.js.map

/***/ }),

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(354);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(406);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_list_list__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_mosque_mosque__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_services_services__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_http__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_diagnostic__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_ionic_openweathermap__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_openweathermap_openweathermap__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_geolocation__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_google_maps__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_local_notifications__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__providers_translation_translation__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_autostart__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_insomnia__ = __webpack_require__(330);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};























var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_mosque_mosque__["a" /* MosquePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__["a" /* SettingsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/mosque/mosque.module#MosquePageModule', name: 'MosquePage', segment: 'mosque', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/settings/settings.module#SettingsPageModule', name: 'SettingsPage', segment: 'settings', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_15_ionic_openweathermap__["a" /* OpenWeatherMapModule */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["a" /* IonicStorageModule */].forRoot({
                    name: '__mydb',
                    driverOrder: ['indexeddb', 'sqlite', 'websql']
                }),
                __WEBPACK_IMPORTED_MODULE_13__angular_http__["b" /* HttpModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__["a" /* SettingsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_mosque_mosque__["a" /* MosquePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_3__angular_common__["d" /* DatePipe */],
                __WEBPACK_IMPORTED_MODULE_12__providers_services_services__["a" /* ServicesProvider */],
                __WEBPACK_IMPORTED_MODULE_13__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_17__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_google_maps__["a" /* GoogleMaps */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_local_notifications__["a" /* LocalNotifications */],
                __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__["a" /* SettingsPage */],
                __WEBPACK_IMPORTED_MODULE_16__providers_openweathermap_openweathermap__["a" /* OpenWeatherMapProvider */],
                __WEBPACK_IMPORTED_MODULE_20__providers_translation_translation__["a" /* TranslationProvider */],
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_autostart__["a" /* Autostart */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_insomnia__["a" /* Insomnia */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_mosque_mosque__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_settings_settings__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Prayer Time', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */] },
            // { title: 'List', component: ListPage },
            { title: 'Near Mosque', component: __WEBPACK_IMPORTED_MODULE_5__pages_mosque_mosque__["a" /* MosquePage */] },
            { title: 'Setting', component: __WEBPACK_IMPORTED_MODULE_6__pages_settings_settings__["a" /* SettingsPage */] }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/app/app.html"*/'<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar color="newcolor">\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list color="newcolor">\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 408:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 211,
	"./af.js": 211,
	"./ar": 212,
	"./ar-dz": 213,
	"./ar-dz.js": 213,
	"./ar-kw": 214,
	"./ar-kw.js": 214,
	"./ar-ly": 215,
	"./ar-ly.js": 215,
	"./ar-ma": 216,
	"./ar-ma.js": 216,
	"./ar-sa": 217,
	"./ar-sa.js": 217,
	"./ar-tn": 218,
	"./ar-tn.js": 218,
	"./ar.js": 212,
	"./az": 219,
	"./az.js": 219,
	"./be": 220,
	"./be.js": 220,
	"./bg": 221,
	"./bg.js": 221,
	"./bm": 222,
	"./bm.js": 222,
	"./bn": 223,
	"./bn.js": 223,
	"./bo": 224,
	"./bo.js": 224,
	"./br": 225,
	"./br.js": 225,
	"./bs": 226,
	"./bs.js": 226,
	"./ca": 227,
	"./ca.js": 227,
	"./cs": 228,
	"./cs.js": 228,
	"./cv": 229,
	"./cv.js": 229,
	"./cy": 230,
	"./cy.js": 230,
	"./da": 231,
	"./da.js": 231,
	"./de": 232,
	"./de-at": 233,
	"./de-at.js": 233,
	"./de-ch": 234,
	"./de-ch.js": 234,
	"./de.js": 232,
	"./dv": 235,
	"./dv.js": 235,
	"./el": 236,
	"./el.js": 236,
	"./en-au": 237,
	"./en-au.js": 237,
	"./en-ca": 238,
	"./en-ca.js": 238,
	"./en-gb": 239,
	"./en-gb.js": 239,
	"./en-ie": 240,
	"./en-ie.js": 240,
	"./en-nz": 241,
	"./en-nz.js": 241,
	"./eo": 242,
	"./eo.js": 242,
	"./es": 243,
	"./es-do": 244,
	"./es-do.js": 244,
	"./es-us": 245,
	"./es-us.js": 245,
	"./es.js": 243,
	"./et": 246,
	"./et.js": 246,
	"./eu": 247,
	"./eu.js": 247,
	"./fa": 248,
	"./fa.js": 248,
	"./fi": 249,
	"./fi.js": 249,
	"./fo": 250,
	"./fo.js": 250,
	"./fr": 251,
	"./fr-ca": 252,
	"./fr-ca.js": 252,
	"./fr-ch": 253,
	"./fr-ch.js": 253,
	"./fr.js": 251,
	"./fy": 254,
	"./fy.js": 254,
	"./gd": 255,
	"./gd.js": 255,
	"./gl": 256,
	"./gl.js": 256,
	"./gom-latn": 257,
	"./gom-latn.js": 257,
	"./gu": 258,
	"./gu.js": 258,
	"./he": 259,
	"./he.js": 259,
	"./hi": 260,
	"./hi.js": 260,
	"./hr": 261,
	"./hr.js": 261,
	"./hu": 262,
	"./hu.js": 262,
	"./hy-am": 263,
	"./hy-am.js": 263,
	"./id": 264,
	"./id.js": 264,
	"./is": 265,
	"./is.js": 265,
	"./it": 266,
	"./it.js": 266,
	"./ja": 267,
	"./ja.js": 267,
	"./jv": 268,
	"./jv.js": 268,
	"./ka": 269,
	"./ka.js": 269,
	"./kk": 270,
	"./kk.js": 270,
	"./km": 271,
	"./km.js": 271,
	"./kn": 272,
	"./kn.js": 272,
	"./ko": 273,
	"./ko.js": 273,
	"./ky": 274,
	"./ky.js": 274,
	"./lb": 275,
	"./lb.js": 275,
	"./lo": 276,
	"./lo.js": 276,
	"./lt": 277,
	"./lt.js": 277,
	"./lv": 278,
	"./lv.js": 278,
	"./me": 279,
	"./me.js": 279,
	"./mi": 280,
	"./mi.js": 280,
	"./mk": 281,
	"./mk.js": 281,
	"./ml": 282,
	"./ml.js": 282,
	"./mr": 283,
	"./mr.js": 283,
	"./ms": 284,
	"./ms-my": 285,
	"./ms-my.js": 285,
	"./ms.js": 284,
	"./my": 286,
	"./my.js": 286,
	"./nb": 287,
	"./nb.js": 287,
	"./ne": 288,
	"./ne.js": 288,
	"./nl": 289,
	"./nl-be": 290,
	"./nl-be.js": 290,
	"./nl.js": 289,
	"./nn": 291,
	"./nn.js": 291,
	"./pa-in": 292,
	"./pa-in.js": 292,
	"./pl": 293,
	"./pl.js": 293,
	"./pt": 294,
	"./pt-br": 295,
	"./pt-br.js": 295,
	"./pt.js": 294,
	"./ro": 296,
	"./ro.js": 296,
	"./ru": 297,
	"./ru.js": 297,
	"./sd": 298,
	"./sd.js": 298,
	"./se": 299,
	"./se.js": 299,
	"./si": 300,
	"./si.js": 300,
	"./sk": 301,
	"./sk.js": 301,
	"./sl": 302,
	"./sl.js": 302,
	"./sq": 303,
	"./sq.js": 303,
	"./sr": 304,
	"./sr-cyrl": 305,
	"./sr-cyrl.js": 305,
	"./sr.js": 304,
	"./ss": 306,
	"./ss.js": 306,
	"./sv": 307,
	"./sv.js": 307,
	"./sw": 308,
	"./sw.js": 308,
	"./ta": 309,
	"./ta.js": 309,
	"./te": 310,
	"./te.js": 310,
	"./tet": 311,
	"./tet.js": 311,
	"./th": 312,
	"./th.js": 312,
	"./tl-ph": 313,
	"./tl-ph.js": 313,
	"./tlh": 314,
	"./tlh.js": 314,
	"./tr": 315,
	"./tr.js": 315,
	"./tzl": 316,
	"./tzl.js": 316,
	"./tzm": 317,
	"./tzm-latn": 318,
	"./tzm-latn.js": 318,
	"./tzm.js": 317,
	"./uk": 319,
	"./uk.js": 319,
	"./ur": 320,
	"./ur.js": 320,
	"./uz": 321,
	"./uz-latn": 322,
	"./uz-latn.js": 322,
	"./uz.js": 321,
	"./vi": 323,
	"./vi.js": 323,
	"./x-pseudo": 324,
	"./x-pseudo.js": 324,
	"./yo": 325,
	"./yo.js": 325,
	"./zh-cn": 326,
	"./zh-cn.js": 326,
	"./zh-hk": 327,
	"./zh-hk.js": 327,
	"./zh-tw": 328,
	"./zh-tw.js": 328
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 408;

/***/ }),

/***/ 409:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ListPage = (function () {
    function ListPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.items = [];
        for (var i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    }
    ListPage_1 = ListPage;
    ListPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(ListPage_1, {
            item: item
        });
    };
    ListPage = ListPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-list',template:/*ion-inline-start:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/list/list.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>List</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n      {{item.title}}\n      <div class="item-note" item-end>\n        {{item.note}}\n      </div>\n    </button>\n  </ion-list>\n  <div *ngIf="selectedItem" padding>\n    You navigated here from <b>{{selectedItem.title}}</b>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Volumes/DATA/PROJECT/Ionic/abc_project/src/pages/list/list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TranslationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the TranslationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var TranslationProvider = (function () {
    function TranslationProvider(http) {
        this.http = http;
        this.apiKey = "AIzaSyBPlEoTRA4huLmAf_Zoo9v7xTCFFwZOyZ0";
        this.endpoints = {
            translate: "",
            detect: "detect",
            languages: "languages"
        };
        console.log('Hello TranslationProvider Provider');
    }
    // Abstract API request function
    TranslationProvider.prototype.makeApiRequest = function (endpoint, data, type, authNeeded) {
        var _this = this;
        var url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
        url += "?key=" + this.apiKey;
        // If not listing languages, send text to translate
        if (endpoint !== this.endpoints.languages) {
            url += "&q=" + encodeURI(data.textToTranslate);
        }
        // If translating, send target and source languages
        if (endpoint === this.endpoints.translate) {
            url += "&target=" + data.targetLang;
            url += "&source=" + data.sourceLang;
        }
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(function (resolve) {
            _this.http.get(url).map(function (res) {
                console.log(res);
            }).subscribe(function (data) {
                console.log(data);
                _this.data = data;
                resolve(_this.data);
            });
        });
    };
    // Translate
    TranslationProvider.prototype.translate = function (data) {
        this.makeApiRequest(this.endpoints.translate, data, "GET", false).then(function (resp) {
            console.log(resp.data.translations[0].translatedText);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Detect language
    // detect(data) {
    //   this.makeApiRequest(this.endpoints.detect, data, "GET", false).then((resp) => {
    //     let source = resp.data.detections[0][0].language;
    //     let conf = resp.data.detections[0][0].confidence.toFixed(2) * 100;
    //     $(".source-lang option")
    //       .filter(function() {
    //         return $(this).val() === source; //To select Blue
    //       })
    //       .prop("selected", true);
    //     $.when(getLanguageNames()).then(function(data) {
    //       $("p.target").text(data[source] + " with " + conf + "% confidence");
    //     });
    //     $("h2.translation-heading").hide();
    //     $("h2.detection-heading, p").show();
    //   });
    // }
    // Get languages
    TranslationProvider.prototype.getLanguages = function () {
        this.makeApiRequest(this.endpoints.languages, null, "GET", false).then(function (resp) {
            // this.getLanguageNames().then(function(data) {
            //   $.each(resp.data.languages, function(i, obj) {
            //     $(".source-lang, .target-lang").append(
            //       '<option value="' +
            //         obj.language +
            //         '">' +
            //         data[obj.language] +
            //         "</option>"
            //     );
            //   });
            // });
            var someArray = [1, "string", false];
            for (var _i = 0, someArray_1 = someArray; _i < someArray_1.length; _i++) {
                var entry = someArray_1[_i];
                console.log(entry); // 1, "string", false
            }
        });
    };
    // Convert country code to country name
    TranslationProvider.prototype.getLanguageNames = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get("https://api.myjson.com/bins/155kj1").map(function (res) {
                console.log(res);
            }).subscribe(function (data) {
                console.log(data);
                _this.data = data;
                resolve(_this.data);
            });
        });
    };
    TranslationProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], TranslationProvider);
    return TranslationProvider;
}());

//# sourceMappingURL=translation.js.map

/***/ })

},[332]);
//# sourceMappingURL=main.js.map