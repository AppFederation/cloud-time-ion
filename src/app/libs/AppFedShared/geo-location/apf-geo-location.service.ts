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

  public readonly geoLocation$ = new CachedSubject<{
    currentPosition: Position,
  }>()

  constructor() {
    this.initGeoLocationCallback();
  }

  private initGeoLocationCallback() {
    /* TODO: privacy settings */
    if (navigator.geolocation) {
      const successCallback = (loc: Position) => {
        // debugLog('ApfGeoLocation: getCurrentPosition', loc)
        this.geoLocation$.next({
          currentPosition: loc,
        })
        // xyzTestGlobal()
      }
      const errorCallback = (error: any) => {
        apfLogger(this).error('ApfGeoLocationService geoLocation error', error)
      }
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, geolocationOptions);
      navigator.geolocation.watchPosition(successCallback, errorCallback, geolocationOptions);
    } else {
      apfErrLog(this, 'navigator.geolocation', navigator.geolocation)
    }
  }
}
