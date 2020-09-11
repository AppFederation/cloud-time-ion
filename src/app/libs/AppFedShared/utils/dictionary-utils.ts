/**
 * Created by kd on 2017-08-01.
 */
import {ILateInit} from '../../../apps/Journal/models/JournalNumericDescriptors'
import {FormControl} from '@angular/forms'
import {DictPatch} from './rxUtils'

export interface Dict<TVal, /*TKey = string*/> {
  [key: string /*TKey*/]: TVal
}

/* name for compat with stuff like lodash */
export type Dictionary<T> = Dict<T>

export function getDictionaryValuesAsArray<TItem>(dictionary: Dict<TItem>): TItem[] {
  // console.log('getDictionaryValuesAsArray dictionary', dictionary)
  const values = [];
  if (dictionary) {
    for (const key of Object.getOwnPropertyNames(dictionary)) {
      // if (dictionary.hasOwnProperty(key)) {
      let dictionaryElement = dictionary[key];
      // console.log('getDictionaryValuesAsArray', key, dictionaryElement)
      values.push(dictionaryElement);
      // }
    }
  }
  return values;
}

export function setIdsFromKeys<TItem>(dictionary: Dict<TItem>, idKeyName: string = 'id'): Dict<TItem> {
  // idKeyName = idKeyName || 'id';
  let ownPropertyNames = Object.getOwnPropertyNames(dictionary);
  // console.log('setIdsFromKeys ownPropertyNames', ownPropertyNames);
  for (const id of ownPropertyNames) {
    const curExp = dictionary[id];
    (curExp as any as {[key: string]: string}) [idKeyName] = id;
    // console.log('setIdsFromKeys', id, curExp);
  }
  return dictionary;
}


export function dictToArrayWithIds<TItem>(dictionary: Dict<TItem>, idKeyName: string = 'id'): TItem[] {
  const dictWithIdsFromKeys: Dict<TItem> = setIdsFromKeys(dictionary, idKeyName);
  let arr = getDictionaryValuesAsArray(dictWithIdsFromKeys)
  arr = arr.map(_ => {
    if ( (_ as any as ILateInit).lateInit ) { // TODO ?.
      _ = (_ as any as ILateInit).lateInit() || _ // TODO: lateInitAndMorph
    }
    return _
  })
  return arr
}

export function mapFields(srcObj: any, mapFunc: any) {
  const ret: any = {}
  for ( let key of Object.keys(srcObj) ) {
    ret[key] = mapFunc(key, srcObj[key])
  }
  return ret
}

export function mapFieldsToFormControls(srcObj: any) {
  return mapFields(srcObj, () => {
    return new FormControl()
  })
}

export function patch<T>(objToPatch: T, patch: DictPatch<T>) {
  return Object.assign(objToPatch, patch)
}

// export function ensureFieldsExistBasedOn(templateObject)
