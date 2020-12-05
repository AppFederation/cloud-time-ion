import {Dict, dictToArrayWithIds, mapEntriesToArray, mapFields, setIdsFromKeys} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {IconDef} from './icon'

function itemClass(x ? : ClassDecl): ClassDef {
  return Object.assign(new ClassDef(), x ?? {}).init()
}

function subClasses(subStatuses: Dict<ClassDecl>): Dict<ClassDef> {
  return mapFields(
      setIdsFromKeys(subStatuses as any as Dict<ClassDecl>),
      (key: string, decl) => itemClass(decl)
  )
}

export class ClassDecl {
  /* later: pinned / hidden by user  */
  shortListed ? = false
  subClasses ? : Dict<ClassDef> = {}

  isAbstract ? : boolean
  isInterface ? : boolean

  /** Try .tsx */
  icon ? : IconDef
  searchTerms ? : string | string[]
  comments ? : string
}

export class ClassDef extends ClassDecl {
  initialized = false

  init() {
    this.initialized = true
    return this as ClassDef & {initialized: true}
  }
}

/* Start with polymorphic classes; ignore separate-collection classes for now */
export class ItemClasses {

  itemClass = itemClass({
    searchTerms: `meta-class`,
  })

  task = itemClass({
    searchTerms: `to do`,
  })

  toLearn = itemClass({
    searchTerms: `memorize`,
    subClasses: subClasses({
      toChangeBehavior: itemClass()
    }),
  })

  journalEntry = itemClass({
    searchTerms: `diary`,
  })

  feature = itemClass()

  project  = itemClass()

  category  = itemClass()

  milestone = itemClass()

  organization = itemClass()

  person = itemClass({
    subClasses: subClasses({
      friend: itemClass()
    }),
  })

  status = itemClass()

}

export const itemClasses = setIdsFromKeys(new ItemClasses() as any as Dict<ClassDecl>) as any as ItemClasses

export const itemClassesArray = dictToArrayWithIds(itemClasses as any as Dict<ClassDecl>)
