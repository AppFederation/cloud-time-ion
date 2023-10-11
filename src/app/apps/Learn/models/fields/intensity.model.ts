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
    = intensity({numeric: 7, abbrev: `SH`, icons: `😊`, shortId: `SHi`/*, shortName: 'a bit high'*/})
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
    = intensity({numeric: 200, abbrev: `Mtr`, icons: `Mantra`, shortId: `Mtr`,
        description: `
          MUST be concise and well-written and optimized.\n
          MUST get to a point where I can memorize the whole exact text and recite it smoothly in few seconds.\n
        `
  })
  meta_mantra
    = intensity({numeric: 500, abbrev: `MtMtr`, icons: `MetaMantra`, shortId: `MtMtr`,
        description: `
          Items that directly help to establish MANTRA.\n
        `
  })
  current_focus
    = intensity({numeric: 1000, abbrev: `CF`, icons: `CF!`, shortId: `CF`,
        description: `SHOULD do every day. Can be a bit longer, with some deeper reflections.\nTODO: maybe maybe switch current_focus order with meta/mantra/meta-mantra ?`
  })
  current_focus_meta
    = intensity({numeric: 1500, abbrev: `CFMeta`, icons: `CFMeta!`, shortId: `CFMeta`,
        description: ``,
  })
  current_focus_mantra
    = intensity({numeric: 2000, abbrev: `CFMtr`, icons: `CFMtr!`, shortId: `CFMtr`,
        description: `MUST be short to not block the pipe. MUST do every day, otherwise bad things start to happen.`,
  })
  current_focus_meta_mantra
    = intensity({numeric: 5000, abbrev: `CFMtMtr`, icons: `CFMtMtr!`, shortId: `CFMtMtr`,
        description: `Current Focus items, that directly help to establish MANTRA. MUST be short to not block the pipe. MUST do every day, otherwise bad things start to happen.`,
  })
  basic_functioning
    = intensity({numeric: 10_000, abbrev: `BF`, icons: `BF!`, shortId: `BF`,
        description: `Basic functioning. To even want, and be able to, do *anything*.`,
  })
  basic_functioning_mantra
    = intensity({numeric: 20_000, abbrev: `BFMtr`, icons: `BFMantra`, shortId: `BFMtr`,
    description: `
          MUST be concise and well-written and optimized.\n
          MUST get to a point where I can memorize the whole exact text and recite it smoothly in few seconds.\n
        `
  })
  basic_functioning_meta
    = intensity({numeric: 50_000, abbrev: `BFMeta`, icons: `BFMeta`, shortId: `BFMeta`,
        description: `
              Meta: To establish the System being-in-force (quiz, mindfulness, posters, etc)
              Note, I switched importance numeric to be higher than mantra here in BF, because there can be dozens of mantras which could lcog; but I need meta to even ensure I get to the mantras.
            `
  })
  /** Frequently repeat and contemplate and improve; affirmations */
  basic_functioning_meta_mantra
    = intensity({numeric: 100_000, abbrev: `BFMetaMtr`, icons: `BFMetaMantra`, shortId: `BFMetaMtr`,
    description: `
          Items that directly help to establish MANTRA.\n
        `
  })
  overarching
    = intensity({numeric: 200_000, abbrev: `Ovr`, icons: `Ovr`, shortId: `Ovr`,
    description: `
          Overarching. Transcendental. No Plan B. https://www.youtube.com/watch?v=_NRRRBxcq5Y
        `
  })
  overarching_mantra
    = intensity({numeric: 500_000, abbrev: `OvrMtr`, icons: `OvrMtr`, shortId: `OvrMtr`,
    description: `
          Overarching Mantra.
        `
  })
  overarching_meta_mantra
    = intensity({numeric: 1_000_000, abbrev: `OvrMtMtr`, icons: `OvrMtMtr`, shortId: `OvrMtMtr`,
    description: `
          Overarching Meta Mantra.
        `
  })
  pinned
    = intensity({numeric: 2_000_000, abbrev: `Pinned`, icons: `Pinned` /* will be pin icon */, shortId: `Pinned`,
    description: `
          Overarching Meta Mantra.
        `
  })

  /* TODO: current focus urgent, day / week /
    Could specify DEADLINE for the focus (e.g. next day, next week) -- per item or per category
  *   */
  /* TODO: current_focus - mostly for categories - temporarily *contextually* increase importance,
      e.g. #SocialInteractions before going to a meetup etc., #Interview before interview, before exam, #Codility
       * difference from mantra: mantra is more about general-life-situation, than an even upcoming shortly
      */
  testing_extremely_high
    = intensity({numeric: 100, abbrev: `T`, icons: `TX😊`, isDebug: true})
  // it gives 10 level total now

  // Icons: up arrow (chevron), double up arrow, etc., medium: wavy, or flat line, or {up&down (but smth visually simple might be better)
}
