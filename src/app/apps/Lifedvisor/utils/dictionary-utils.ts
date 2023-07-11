export interface Dict<TVal, /*TKey = string*/> { [key: string /*TKey*/]: TVal }

export function getDictionaryValuesAsArray<TItem>(dictionary: Dict<TItem>): TItem[] {
  // console.log('getDictionaryValuesAsArray dictionary', dictionary)
  const values: Array<TItem> = [];
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


export function setIdsFromKeys<TItem, TItemWithId extends TItem & {id: string} = TItem & {id: string}>(
  dictionary: Dict<TItem>,
  // idKeyName: string = 'id'
): Dict<TItemWithId> {
  // idKeyName = idKeyName || 'id';
  let ownPropertyNames = Object.getOwnPropertyNames(dictionary);
  // console.log('setIdsFromKeys ownPropertyNames', ownPropertyNames);
  for (const id of ownPropertyNames) {
    const curExp = dictionary[id] as any as TItemWithId
    // curExp[idKeyName] = id;
    curExp.id = id;
    // console.log('setIdsFromKeys', id, curExp);
  }
  return dictionary as Dict<TItemWithId>
}
