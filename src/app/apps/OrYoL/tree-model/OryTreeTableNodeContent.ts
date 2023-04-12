import {TreeTableNodeContent} from './TreeTableNodeContent'
import {OryColumn} from '../tree-shared/OryColumn'
import {minutesToString, parseTimeToMinutes} from '../utils/time-utils'
import {isEmpty} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {sumBy} from 'lodash-es'
import {RootTreeNode} from './TreeModel'

/** Has domain-specific stuff like estimations */
export class OryTreeTableNodeContent extends TreeTableNodeContent<any>{

  startTime = new Date()

  /** TODO: move to NumericCell */
  effectiveTimeLeft(column: OryColumn) {
    return this.effectiveDurationText(column)
  }

  /** TODO: move to NumericCell */
  effectiveDurationText(column: OryColumn) {
    return this.timeLeftSumText(column)
  }

  endTime(column: OryColumn) {
    return new Date(this.startTime.getTime() + this.valueLeftSum(column) * 60 * 1000)
  }

  get isDayPlan() {
    return this.treeNode.parent2 ?. itemId === 'item_35023937-195c-4b9c-b265-5e8a01cf397e'
  }

  /** conceptual differences between note and journal entry: note is more pertaining to the topic,
   * whereas journal entry is more about the User's state in a given moment, useful for retrospective, tracking mood, etc. */
  get isJournalEntry() {
    return this.treeNode.parent2 ?. itemId === 'item_50872811-928d-4878-94c0-0df36667be0e'
  }

  get isMilestone() {
    const milestonesNodeId = 'item_28cca5d5-6935-4fb1-907a-44f1f1898851'
    // return //this.parent2 && this.parent2.itemId === milestonesNodeId ||
    return this.treeNode.parent2 ?. parent2 ?. itemId === milestonesNodeId
  }

  get isTask() {
    return this.treeNode.parent2 ?. isMilestone || this.treeNode.parent2 ?. isDayPlan
  }

  /** 2020-02-02 Decided that done/cancelled should be a core concept to tree node,
   * as it will simplify a lot of methods, at minimal cost in this file. Also, where else to put it... */
  public get isDoneOrCancelled() { return this.itemData?.isDone /* TODO: cancelled */ }

  // /** FIXME unify impl with NodeContentComponent
  //  *
  //  * FIXME
  //  * */
  // toggleDone() {
  //   let ret = this.patchItemData({
  //     isDone: this.itemData?.isDone ? null : new Date() /* TODO: `this.setDoneNow(! this.isDone)` */ ,
  //   })
  //   // FIXME: fireOnChangeItemDataOfChildOnParents and on this
  //
  //   // TODO: focus node below, but too tied to UI; has to know about column too
  // }

  /** TODO: move to NumericCell */
  effectiveValueLeft(column: OryColumn): number {
    if ( ! this.isDoneOrCancelled ) {
      if ( this.showEffectiveValue(column) ) {
        return this.valueLeftSum(column)
      }
      const estimatedTime = this.getMinutes(column)
      // console.log('estimatedTime for sum', estimatedTime)
      return estimatedTime
    } else {
      return 0
    }
  }

  getChildrenTimeLeftSum(column: OryColumn): number {
    return sumBy(this.treeNode.children, childNode => {
      return childNode.content.effectiveValueLeft(column)
    })
  }

  public getMinutes(column: OryColumn) {
    const columnValue = this.getValueForColumn(column)
    return parseTimeToMinutes(columnValue) || 0
  }

  getChildrenMissingValsCount(column: OryColumn) {
    const hasMissingValFunc = (node: RootTreeNode) => {
      const content = node.content as OryTreeTableNodeContent
      return ! content.isDoneOrCancelled && content.hasMissingVal(column) // TODO: ignore done ones
    }

    const missingValsCountFunc = (node: RootTreeNode) => {
      if ( node.hasChildren ) {
        return 0 // will be taken care in children
      }
      return hasMissingValFunc(node) ? 1 : 0
    }
    return this.treeNode.getSumRecursivelyJustChildren(missingValsCountFunc)
  }

  /** TODO: move to NumericCell */
  missingValsCount(column: OryColumn) {
    return this.getChildrenMissingValsCount(column) + (this.hasMissingVal(column) ? 1 : 0)
    // const missingValsCount = count(this.children, )
    // return missingValsCount
  }

  /** TODO: move to NumericCell (model class, not component */
  showEffectiveValue(column: OryColumn) {
    const colVal = column.getValueFromItemData(this.itemData)
    // if ( colVal ) console.log('showEffectiveValue colVal', colVal, typeof colVal)
    return ! this.treeNode.isChildOfRoot &&
      ( /*this.itemData.estimatedTime == null || this.itemData.estimatedTime == undefined || */
        this.getChildrenTimeLeftSum(column) !== 0 /*||
        parseTimeToMinutes(colVal) >= 60*/ // TODO: move to domain-specific code since this deals with time (help reducing this file)
      )
  }

  /** TODO: move to NumericCell */
  isChildrenEstimationExceedingOwn(column: OryColumn) {
    const colVal = column.getValueFromItemData(this.itemData)
    return ! isEmpty(colVal) &&
      this.valueLeftSum(column) >
      (( colVal && parseTimeToMinutes(colVal)) || 0) /* FIXME: there was "object is potentially null" so I added parenthesis 2022-06-18 */
  }

  /** TODO: move to NumericCell */
  timeLeftSumText(column: OryColumn) {
    const minutesTotalLeft = this.valueLeftSum(column)
    return minutesToString(minutesTotalLeft)
  }

  /** TODO: move to NumericCell */
  valueLeftSum(column: OryColumn): number {
    const columnVal = column.getValueFromItemData(this.itemData)
    const selfTimeLeft = ( columnVal && parseTimeToMinutes(columnVal)) || 0
    // TODO: use AggregateValue class
    const childrenTimeLeftSum = this.getChildrenTimeLeftSum(column)
    return Math.max(selfTimeLeft, childrenTimeLeftSum)
  }


}
