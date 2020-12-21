import {Injectable} from '@angular/core';
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

@Injectable({
  providedIn: 'root'
})
export class LocalDebugOptionsService {

  private defaultValue = false;
  private localStorageKey = 'LifeSuite_debugOptions';
  public generatedData$: CachedSubject<boolean>;

  constructor() {
    this.generatedData$ = new CachedSubject<boolean>(this.getCurrentGeneratedDataValue());
  }

  getCurrentGeneratedDataValue() {
    const fromLocalStorage = localStorage.getItem(this.localStorageKey);
    return fromLocalStorage ? JSON.parse(fromLocalStorage) : this.defaultValue;
  }

  toggleGeneratedData(isSelected: boolean) {
    if (this.generatedData$.lastVal !== isSelected) {
      this.generatedData$.nextWithCache(isSelected)
      localStorage.setItem(this.localStorageKey, JSON.stringify(isSelected));
    }
  }
}
