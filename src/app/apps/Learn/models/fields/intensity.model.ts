import {Dict} from '../../../../libs/AppFedShared/utils/dictionary-utils'
import {debugLog} from '../../../../libs/AppFedShared/utils/log'


const midIntensityNum = 5

export type IntensityDescriptor = {
  numeric: number,
  abbrev: string,
  shortId: string,
  icons?: string,
  isDebug?: boolean,
} & {
  id: keyof IntensityDescriptors<any>
}

export function intensity(x: any): IntensityDescriptor {
  const ret = {
    ...x,
    /** WIP; only for importance for quiz; does not yet work for <= Low (>100%)
     * will be useful when I gather quiz answers data (probabilities of forgetting, given time interval from last repetition.
     * And then I can define the forgetting curve better (could be specific to given person and even to given question)
     * Mid 50 %; SH 35 %; Hi 25 %; VH 12.5 %; XH 5 %
     * */
    desiredPercentProbabilityOfForgetting: 50 / ( x.numeric / midIntensityNum )
  }
  // debugLog(`intensity`, ret)
  return ret
}


/** Name: like  IntensityDescriptorsDICT
 * Note: importance, not priority; priority is calculated based on other factors like estimations, deadlines, free time, FUN, etc. */
export class IntensityDescriptors<TDescriptor> implements Dict<any> {
  /* unset -> null; for querying; should have highest effective importance, to force to decide */
  undefined
    = intensity({numeric: midIntensityNum, abbrev: `-`, shortId: `_`}) // 0    BTN
  off
    = intensity({numeric: 0, abbrev: `✕`, shortId: `Off`}) // 0    BTN
  unknown
    = intensity({
    numeric: 50 /* a bit higher than extremely_high, to force decision later; but lower than effective numerical for unset */,
    abbrev: `?`, /* / `?` */
    shortId: `Unk`
  })
  /* TODO: unknown / undecided = {} // different than off, medium or unset - meaning I went through it already (so it's not unset); #Workflow
   and I could not decide; e.g. I was lacking information at this point or did not have enough info. Example: watching some video which might, or might not be important. Need to first skim through it (which is a detour from going through a lot of items quickly)
  * one MIGHT go back to it and try to set it to a value later; which would probably be high-priority thing to do (prioritize prioritizing (via importance level))
    kinda similar to `null` in JS (vs `undefined`), but won't store undefined / null in Firestore
   */

  extremely_low
    = intensity({numeric: 0.5, abbrev: `XL`, icons: `😡😡😡😡`, shortId: `XLo`}) // this is better than off, coz it might re-occur at some point if I have a lot of time for learning, so I don't forget about it.
  very_low
    = intensity({numeric: 1, abbrev: `VL`, icons: `😡😡😡`, shortId: `VLo`}) // 0.5
  low
    = intensity({numeric: 2, abbrev: `Lo`, icons: `😡😡`, shortId: `Lo`}) // 1    BTN
  // somewhat / a bit low; SLP
  somewhat_low
    = intensity({numeric: 4, abbrev: `SL`, icons: `😡`, shortId: `SLo`})
  /* default between low and medium ? somewhat low? */
  medium
    = intensity({numeric: midIntensityNum, abbrev: `Md`, icons: `~`, id: `medium` /* hack */, shortId: `Med`}) // 1.5 // default when unspecified;  { should medium have a BTN? --> yes, coz we wanna be able to say that something was already manually deliberately prioritized; vs not prioritized yet (not prioritized could be also shown by "Process" btn maybe; or at least uncategorised ones)
  // somewhat / a bit high; darkened up-chevron; SHP
  somewhat_high
    = intensity({numeric: 7, abbrev: `SH`, icons: `😊`, shortId: `SHi`})
  high
    = intensity({numeric: 10, abbrev: `Hi`, icons: `😊😊`, shortId: `Hi`}) // 2   BTN
  very_high
    = intensity({numeric: 20, abbrev: `VH`, icons: `😊😊😊`, shortId: `VHi`}) /* just 4 times more than unspecified?? --> 10 times?
   /* just 4 times more than unspecified?? --> 10 times?
      20 times higher than very_low seems ok
   */ // 2.5 / 3
  extremely_high
    = intensity({numeric: 50, abbrev: `XH`, icons: `😊😊😊😊`, shortId: `XHi`})
  /** To make the SYSTEM of learning & self-improvement & execution (tasks) work;
   * infrastructure...
   * */
  meta
    = intensity({numeric: 100, abbrev: `Mt`, icons: `Meta`, shortId: `Mt`})
  /** Frequently repeat and contemplate and improve; affirmations */
  mantra
    = intensity({numeric: 200, abbrev: `Mtr`, icons: `Mantra`, shortId: `Mtr`})
  meta_mantra
    = intensity({numeric: 500, abbrev: `MtMtr`, icons: `MetaMantra`, shortId: `MtMtr`})
  current_focus
    = intensity({numeric: 1000, abbrev: `CF`, icons: `CF!`, shortId: `CF`})
  /* TODO: current_focus - mostly for categories - temporarily *contextually* increase importance,
      e.g. #SocialInteractions before going to a meetup etc., #Interview before interview, before exam, #Codility
       * difference from mantra: mantra is more about general-life-situation, than an even upcoming shortly
      */
  testing_extremely_high
    = intensity({numeric: 100, abbrev: `T`, icons: `TX😊`, isDebug: true})
  // it gives 10 level total now

  // Icons: up arrow (chevron), double up arrow, etc., medium: wavy, or flat line, or {up&down (but smth visually simple might be better)
}
