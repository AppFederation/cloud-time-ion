import {Injectable} from '@angular/core';
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {DisplayList} from '../../../libs/AppFedShared/options/display-list-options/display-list'

@Injectable({
  providedIn: 'root'
})
export class LocalDebugOptionsService {

  private generatedDataDefaultValue = false;
  private localStorageGeneratedDataKey = 'LifeSuite_debugOption_generatedData';
  public generatedData$: CachedSubject<boolean>;

  private displayListDefaultValue = DisplayList.displayLists[0];
  private localStorageDisplayListKey = 'LifeSuite_debugOption_displayList';
  public displayList$: CachedSubject<DisplayList>;

  constructor() {
    this.generatedData$ = new CachedSubject<boolean>(this.getCurrentGeneratedDataValue());
    this.displayList$ = new CachedSubject<DisplayList>(this.getCurrentDisplayListValue());
  }

  getCurrentGeneratedDataValue(): boolean {
    const fromLocalStorage = localStorage.getItem(this.localStorageGeneratedDataKey);
    return fromLocalStorage ? JSON.parse(fromLocalStorage) : this.generatedDataDefaultValue;
  }

  getCurrentDisplayListValue(): DisplayList {
    const fromLocalStorage = localStorage.getItem(this.localStorageDisplayListKey);
    return fromLocalStorage ? DisplayList.findById(JSON.parse(fromLocalStorage)) : this.displayListDefaultValue;
  }

  toggleGeneratedData(isSelected: boolean) {
    if (this.generatedData$.lastVal !== isSelected) {
      this.generatedData$.nextWithCache(isSelected)
      localStorage.setItem(this.localStorageGeneratedDataKey, JSON.stringify(isSelected));
    }
  }

  toggleDisplayList(displayList: DisplayList) {
    this.displayList$.nextWithCache(displayList);
    localStorage.setItem(this.localStorageDisplayListKey, JSON.stringify(displayList.id));
  }
}
