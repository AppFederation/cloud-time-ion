import { Injectable } from '@angular/core';
import {apfErrLog, apfLogger, debugLog} from "../utils/log";
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

@Injectable({
  providedIn: 'root'
})
// @Logger()
export class ApfGeoLocationService {

  public geoLocation$ = new CachedSubject<any>()

  constructor() {
    this.initGeoLocationCallback();
  }

  private initGeoLocationCallback() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loc => {
        debugLog('ApfGeoLocation: getCurrentPosition', loc)
        this.geoLocation$.next({
          currentPosition: loc,
        })
        // xyzTestGlobal()
      }, (error) => {
        apfLogger(this).error('ApfGeoLocationService geoLocation error', error)
      }, geolocationOptions);
    } else {
      apfErrLog(this, 'navigator.geolocation', navigator.geolocation)
    }
  }
}
