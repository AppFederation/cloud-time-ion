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

/* TO Keep inn mind: extensional and intensional
* https://en.wikipedia.org/wiki/Sense_and_reference
*  */
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

  aspect = itemClass({
    searchTerms: `cross-cutting concern`,
  })

  field = itemClass({
    searchTerms: [`property`, `attribute`],
  })

  funLevel = itemClass({
  })

  mentalLevel = itemClass({
  })

  importanceLevel = itemClass({
  })

  // TODO: audio

  actionable_item = itemClass({
    /* TODO: subclassess here;
    *   distinguish start-finish type and continuously-workable-on;
    * But in some sense all things can be worked on continuously, e.g. by refining, editing.
    * --> hence everything is time-trackable */
  })

  checklist = itemClass({})

  task = itemClass({
    searchTerms: `to do`,
  })

  bug = itemClass({
    searchTerms: `error`,
  })

  bug_report = itemClass({
    searchTerms: `error report`,
  })

  toLearn = itemClass({
    searchTerms: `memorize`,
    subClasses: subClasses({
      toChangeBehavior: itemClass({
        searchTerms: `to reform`,
      })
    }),
  })

  journalEntry = itemClass({
    searchTerms: `diary`,
  })

  feature = itemClass()

  project  = itemClass()
  product  = itemClass()
  module  = itemClass()
  component  = itemClass()

  category  = itemClass()

  milestone = itemClass()
  epic = itemClass()
  theme = itemClass()

  organization = itemClass()
  department = itemClass()
  role = itemClass()

  shopping_list = itemClass()
  recipe = itemClass()

  person = itemClass({
    subClasses: subClasses({
      friend: itemClass()
    }),
  })

  status = itemClass()

}

export const itemClasses = setIdsFromKeys(new ItemClasses() as any as Dict<ClassDecl>) as any as ItemClasses

export const itemClassesArray = dictToArrayWithIds(itemClasses as any as Dict<ClassDecl>)
