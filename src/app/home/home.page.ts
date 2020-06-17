import { Component } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';


import { HTTP } from "@ionic-native/http/ngx";
import { Http, Headers, RequestOptions } from '@angular/http';
import { map, filter, switchMap } from 'rxjs/operators';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  //pre del
  // config: BackgroundGeolocationConfig = {
  //   desiredAccuracy: 10,
  //   stationaryRadius: 20,
  //   distanceFilter: 30,
  //   debug: true, //  enable this hear sounds for background-geolocation life-cycle.
  //   stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  // };

  gps_update_link: string = "http://demopay.oriole.co.in/api/EmployeeTracking/EmployeeTracking";
 
  constructor(
    private backgroundGeolocation: BackgroundGeolocation,
    private http: Http
  ) {
 
    // this.backgroundGeolocation.configure(this.config).then((location: BackgroundGeolocationResponse) => {
 
    //     console.log(location);
    //     this.showNotification(location)
    //     // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    //     // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
    //     // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    //     this.backgroundGeolocation.finish(); // FOR IOS ONLY
 
    //   });

  }

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);

          Observable.interval(1000)
          .subscribe((val) => { 
            console.log("val "+val);
            this.sendGPS(location);
          });

          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        });
    });

    // start recording location
    this.backgroundGeolocation.start();

  }

  stopBackgroundGeolocation(){
    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();
  }

  sendGPS(location) {
    if (location.speed == undefined) {
      location.speed = 0;
    }
    let timestamp = new Date(location.time);

    this.http
      .post(
        this.gps_update_link,
        {
          // lat: location.latitude,
          // lng: location.longitude,
          // speed: location.speed,
          // timestamp: timestamp
          "EmployeeCode": 2004,
          "Latitude": 19.2032,
          "Longitude":73.4743,
          "IsGPSOff": 1,
          "BatteryLowFlag":false
        },
        {}
      )
      .subscribe(data => {
        console.log("status "+data['_body']);  
        alert("Location recorded") 

        // console.log(data.data); // data received by server
        // console.log(data.headers);
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      })
      ,(error => {
        console.log("error "+JSON.stringify(error));

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });
  }


 
  // pre del
  // startBackgroundGeolocation() {
  //   // start recording location
  //   this.backgroundGeolocation.start();
  // }
 
  // stopBackgroundGeolocation() {
  //   // If you wish to turn OFF background-tracking, call the #stop method.
  //   this.backgroundGeolocation.stop();
  // }
 
  // showNotification(data){
  //   // Schedule a single notification
  //   this.localNotifications.schedule({
  //     id: 1,
  //     text: JSON.stringify(data),
  //     sound: 'file://sound.mp3',
  //     data: { secret: "key" }
  //   });
  // }
}







  // sendGPSs() {

  //   let postData = {
  //   "EmployeeCode": 2004,
  //   "Latitude": 19.2032,
  //   "Longitude":73.4743,
  //   "IsGPSOff": 1,
  //   "BatteryLowFlag":false
  //   }
  //   // console.log(postData);
  //   // this.enable = true;
  //   // this.company_url_link ='http://demopay.oriole.co.in';
  //   this.http.post("http://demopay.oriole.co.in/api/EmployeeTracking/EmployeeTracking", postData, {})
  //   .subscribe(data => {
  //   console.log("data  "+data);
  //   alert(data['Message']);

  //   }, error => {
  //     alert("error "+JSON.stringify(error));
  //   // this.presentToast("Incorrect Credentials. Try Again !!!");
  //   });

  // }