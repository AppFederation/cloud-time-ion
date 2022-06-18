export class DbItemField {

}

export class DbItemClass {
  fields!: DbItemField[]

  hasField?(field: DbItemField) {
    return this.fields.some(curField => curField === field)
  }

  // get iconName?() {
  //   return 'note'; // FIXME
  // }
}

export function itemClass(initialiser: DbItemClass) {
  const obj = Object.create(DbItemClass)
  Object.assign(obj, initialiser)
  return obj
}

export function itemClasses(classes: {[s: string]: DbItemClass}) {
  return classes
}
