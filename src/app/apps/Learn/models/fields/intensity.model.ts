import {Dict} from '../../../../libs/AppFedShared/utils/dictionary-utils'

export function intensity(x: any): { numeric: number, abbrev: string } & { id: keyof IntensityDescriptors<any> } {
  return x
}

const midIntensityNumeric = 5

/** Name: like  IntensityDescriptorsDICT
 * Note: importance, not priority; priority is calculated based on other factors like estimations, deadlines, free time, FUN, etc. */
export class IntensityDescriptors<TDescriptor> implements Dict<any> {
  /* unset -> null; for querying; should have highest effective importance, to force to decide */
  undefined
    = intensity({numeric: midIntensityNumeric, abbrev: `-`}) // 0    BTN
  off
    = intensity({numeric: 0, abbrev: `✕`}) // 0    BTN
  unknown
    = intensity({
    numeric: 50 /* a bit higher than extremely_high, to force decision later; but lower than effective numerical for unset */,
    abbrev: `?`, /* / `?` */
  })
  /* TODO: unknown / undecided = {} // different than off, medium or unset - meaning I went through it already (so it's not unset); #Workflow
   and I could not decide; e.g. I was lacking information at this point or did not have enough info. Example: watching some video which might, or might not be important. Need to first skim through it (which is a detour from going through a lot of items quickly)
  * one MIGHT go back to it and try to set it to a value later; which would probably be high-priority thing to do (prioritize prioritizing (via importance level))
    kinda similar to `null` in JS (vs `undefined`), but won't store undefined / null in Firestore
   */

  extremely_low
    = intensity({numeric: 0.5, abbrev: `XL`, icons: `😡😡😡😡`}) // this is better than off, coz it might re-occur at some point if I have a lot of time for learning, so I don't forget about it.
  very_low
    = intensity({numeric: 1, abbrev: `VL`, icons: `😡😡😡`}) // 0.5
  low
    = intensity({numeric: 2, abbrev: `Lo`, icons: `😡😡`}) // 1    BTN
  // somewhat / a bit low; SLP
  somewhat_low
    = intensity({numeric: 4, abbrev: `SL`, icons: `😡`})
  /* default between low and medium ? somewhat low? */
  medium
    = intensity({numeric: midIntensityNumeric, abbrev: `Md`, icons: `~`, id: `medium` /* hack */}) // 1.5 // default when unspecified;  { should medium have a BTN? --> yes, coz we wanna be able to say that something was already manually deliberately prioritized; vs not prioritized yet (not prioritized could be also shown by "Process" btn maybe; or at least uncategorised ones)
  // somewhat / a bit high; darkened up-chevron; SHP
  somewhat_high
    = intensity({numeric: 7, abbrev: `SH`, icons: `😊`})
  high
    = intensity({numeric: 10, abbrev: `Hi`, icons: `😊😊`}) // 2   BTN
  very_high
    = intensity({numeric: 20, abbrev: `VH`, icons: `😊😊😊`}) /* just 4 times more than unspecified?? --> 10 times?
   /* just 4 times more than unspecified?? --> 10 times?
      20 times higher than very_low seems ok
   */ // 2.5 / 3
  extremely_high
    = intensity({numeric: 40, abbrev: `XH`, icons: `😊😊😊😊`})
  testing_extremely_high
    = intensity({numeric: 100, abbrev: `T`, icons: `TX😊`})
  // it gives 10 level total now

  // Icons: up arrow (chevron), double up arrow, etc., medium: wavy, or flat line, or {up&down (but smth visually simple might be better)
}
