import {Dict, dictToArrayWithIds, mapEntriesToArray, mapFields, setIdsFromKeys} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

function status(x ? : StatusDecl): StatusDef {
  return Object.assign(new StatusDef(), x ?? {}).init()
}

export type IconDef = string

function subStatuses(subStatuses: Dict<StatusDecl>): Dict<StatusDef> {
  return mapFields(
      setIdsFromKeys(subStatuses as any as Dict<StatusDecl>),
      (key: string, decl) => status(decl)
  )
}

export class StatusDecl {
  /* later: pinned / hidden by user  */
  shortListed ? = false
  subStatuses ? : Dict<StatusDef> = {}

  isDoableNow ? : boolean | nullish = true
  /** e.g. for kanban, finishing tasks */
  isStarted ? : boolean | nullish = true
  isMaybeDoableInFuture ? = true
  isDone ? = false
  /** Try .tsx */
  icon ? : IconDef
  searchTerms ? : string | string[]
  comments ? : string
}

export class StatusDef extends StatusDecl {
  initialized = false

  init() {
    this.initialized = true
    return this as StatusDef & {initialized: true}
  }
}

/**
 * http://localhost:4207/learn/item/PfB4hcqoYPAVjuZ4yike
 *
 * Capture real life situations like :
 * - rushing
 * - procrastinating
 * - not sure
 * - "maybe" (e.g. maybe doable -- no-one knows the future)
 *
 * Add a bit more statuses, even if not sure or overlapping. I can tidy them up and optimize later, with unifications in code.
 *
 * This will later be stored in Firestore, for full editability
 *
 * Let's assume leaving more freedom to User's individual style (especially when custom statuses are implemented)
 *
 * TODO: connect with ASPECTS (auto-subtasks, e.g. designing, testing)
 *
 * */
export class Statuses {

  undefined = status({
    isDoableNow: undefined,
    isStarted: undefined,
  })

  not_sure = status({
    isStarted: null,
  })

  unknown = status({
    isDoableNow: null,
    isStarted: null,
  })

  /** but more on item's side: canBeFinished (no unsatisfied deps);
   * could be virtual effective status
   * (more lucrative than .shallBeDoneInFuture !)
   * - implies not blocked
   * - perhaps not mutually exclusive with suspended
   * */
  can_be_started = status({
    isDoableNow: true,
    comments: `(Virtual status) No unfinished dependencies-to-start`,
    isStarted: false,
  })


  not_started = status({
    isDoableNow: true,
    isStarted: false,
  })

  started = status({
    searchTerms: [`doing`, `in progress`, `executing`],
    shortListed: true,

    subStatuses: subStatuses({
      fantasizing: status(),
      recon: status(),
      researching: status(),
      thinking: status(),
      brainstorming: status(),
      contacting: status({
        searchTerms: `talking, calling people`
      }),
      doing: status(),
      designing: status(),
      prototyping: status(),
      mocking_up: status(),
      planning: status(),
      prioritizing: status(),
    })
  })

  gathering_requirements = status()
  designed = status()
  defined = status()


  rushing = status({
    comments: `Meaning sacrificing quality for time, e.g. to meet a deadline or satisfy and urgent need.`,
  })

  refining = status({})

  in_review = status({
    shortListed: true,
  })

  in_testing = status({
    shortListed: true,
  })

  awaiting_delivery = status({
    searchTerms: [`package`, `postal`],
    isDoableNow: false,
  })

  draft = status({
    shortListed: true,
  })

  prototype = status({
    shortListed: true,
  })

  waiting = status({
    comments: `Is same as blocked?`,
    shortListed: true,
    subStatuses: subStatuses({
      for_external_info: status(),
      procrastinating: status({
        searchTerms: [`not fee like it`]
      }),
    })
  })

  blocked = status({
    /* does NOT imply started */
    isDoableNow: false,
    // isMaybeDoableInFuture: true,
    subStatuses: subStatuses({
      internally: status(),
      externally: status(),
    }),
    /** later need to `??` properties like isStarted when multiple statuses */
    isStarted: undefined,
  })

  suspended = status({
    /* does NOT imply started */
    searchTerms: `paused`,
    isDoableNow: false,
    isStarted: undefined,
    // isMaybeDoableInFuture: true,
  })

  done = status({
    searchTerms: [`finished`],
    /* implies started? */
    shortListed: true,
    isDoableNow: false,
    isMaybeDoableInFuture: false,
    isDone: true,
  })

  cancelled = status({
    comments: `If a project/task/feature is cancelled, then effectively all sub-items are cancelled too (without need to set in DB)`,
    searchTerms: [`aborted`],
    shortListed: true,
    isDoableNow: false,
    isMaybeDoableInFuture: false,
    isStarted: undefined,
  })

  /* ==== Other:
    - duplicates
    - follow-ups (Asana)
  * */

}

export const statuses = setIdsFromKeys(new Statuses() as any as Dict<StatusDecl>) as any as Statuses

export const statusesArray = dictToArrayWithIds(statuses as any as Dict<StatusDecl>)
