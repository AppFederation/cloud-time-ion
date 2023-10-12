import {funLevels, FunLevelVal} from '../../models/fields/fun-level.model'

/** FIXME: keep in mind that if options existed, they will not be overridden, and will be missing fields; so should {...defaultOptions, ...options}*/
export class QuizOptions {
  constructor(
    public dePrioritizeNewMaterial: boolean,
    public onlyWithQA: boolean,
    public minFunLevel: FunLevelVal = funLevels.undefined,
    public powBaseX100: number = 300,
    public skipTasks: boolean = true,
    public scaleIntervalsByImportance = 1, // 0 .. 1 (0 no scale, 1: current default: scale per importance multiplier. >1 scale even more)
    public focusLevelProbabilities = 1, // 0 .. 1 (0 no scale, 1: current default: scale per importance multiplier. >1 scale even more)
    public categories = '',
    public textFilter = '',
    // TODO: priorityByImportances: 0 .. 1 -- 0 - ignore importances, 1 - items of highest importance go first
    // in-between - probabilities
  ) {
  }
}
