import {Dict, dictToArrayWithIds, mapEntriesToArray, setIdsFromKeys} from '../../../libs/AppFedShared/utils/dictionary-utils'

function status(x ? : any): StatusDef {
  return x ?? {}
}

export type IconDef = string

function subStatuses(subStatuses: Dict<StatusDecl>): Dict<StatusDef> {
  return setIdsFromKeys(subStatuses as any as Dict<StatusDecl>)
}

export class StatusDecl {
  /* later: pinned / hidden by user  */
  shortListed ? = false
  subStatuses ? : Dict<StatusDef> = {}

  isDoableNow ? = true
  isMaybeDoableInFuture ? = true
  isDone ? = false
  /** Try .tsx */
  icon ? : IconDef
}

export class StatusDef extends StatusDecl {

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

  undefined = status()

  not_sure = status()

  unknown = status()

  /** but more on item's side: canBeFinished (no unsatisfied deps);
   * could be virtual effective status
   * (more lucrative than .shallBeDoneInFuture !)
   * - implies not blocked
   * - perhaps not mutually exclusive with suspended
   * */
  can_be_started = status({
    comments: `(Virtual status) No unfinished dependencies-to-start`
  })


  not_started = status({
  })

  started = status({
    searchTerms: `doing`,
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
    comments: [`Meaning sacrificing quality for time, e.g. to meet a deadline or satisfy and urgent need.`]
  })

  in_review = status({
    shortListed: true,
  })

  in_testing = status({
    shortListed: true,
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
    })
  })

  suspended = status({
    /* does NOT imply started */
    searchTerms: `paused`,
    isDoableNow: false,
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
  })

}

export const statuses = setIdsFromKeys(new Statuses() as any as Dict<StatusDecl>)

export const statusesArray = dictToArrayWithIds(statuses)
