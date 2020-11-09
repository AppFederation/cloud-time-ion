
// units: minutes, hours, STORY POINTS, weeks, WORKWEEKS, months
// workdays

// unit relations can be dynamic, like currency exchange, e.g. 1 week = 30 h or

// https://stackoverflow.com/questions/33915459/algebraic-data-types-in-typescript -->
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions

// https://github.com/pfgray/ts-adt

/*
Example:

import { ADT } from 'ts-adt'

type Option<A> = ADT<{
  some: {value: A},
  none: {}
}>
This translates to:

type Option<A> = { _type: 'some', value: A} | { _type: 'none' }
*/



export type Weeks = number & {unit: 'weeks'}
export type Hours = number & {unit: 'hours'}

export const testNumberUnit: Weeks = 3 as Weeks

export const testNumberUnit2: Hours = 2 as Hours

export function weeksToHours(weeks: Weeks): Hours {
  return (40 * weeks) as Hours
}

const newVar = testNumberUnit + testNumberUnit2
// export const testNumberUnitS: Hours = newVar

export type Unit = string


export class NumberWithUnit {

  num: number
  unit: Unit

}
