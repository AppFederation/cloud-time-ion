import { Injectable } from '@angular/core';
import {CachedSubject} from '../../utils/cachedSubject2/CachedSubject2'

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  status$ = new CachedSubject<{
    textEditorFocused?: boolean
  }>()

  constructor() { }
}
