import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OdmItemHistoryService/*<
  TItem
  >*/
{

  constructor() { }

  onPatch(odmItem$2: any, patch: any) {
    // TODO store in db
  }
}
