import {FeaturesProps} from './FeaturesProps'

export class FeatureLevelsConfig {
    // ORDER: from least mature to most

    constructor(
        public props: FeaturesProps,
    ) {
    }

    showDeprecated = this.props.enableAll

    potentiallyDangerous = this.props.enableAll

    pointless = this.props.enableAll

    showIdeas = this.props.enableAll
    showNotes = this.props.enableAll

    /** mockups (/notes?) of stuff that I will prolly not be able/willing to do, unless i become like Musk ;). Still kinda motivating to push harder upon seeing this. */
    megalomania = this.props.enableAll


    showTodos = this.props.enableAll

    /** @deprecated */
    showTodosNotes = this.props.enableAll


    /** stuff that is not implemented, just visual for imagination / motivation / visualization */
    mockups = this.props.enableAll

    /** stuff that works or gives some everyday value but looks ugly/unprofessional/unfinished */
    showUgly = this.props.enableAll

    /** an entire feature/page/sub-product could be unfinished; or just its feature/sub-feature */
    unfinished = this.props.enableAll

    /** might be unstable for me or end user */
    showUnstable = this.props.enableAll

    /** Prolly stable for me but might be hard to understand for end user */
    showExperimental = this.props.enableAll

    /** works decently for me, e.g. text filter on categories in quiz */
    quickNDirty = this.props.enableAll


    /** worse than unpolished */
    buggy = this.props.enableAll

    /** better than `ugly`; works and fulfills some function, e.g. energy graph; actually worse than ugly; coz deficiencies not only in looks, but also in functionality
     * TODO split: into visual / func
     * */
    unpolished = this.props.enableAll // buggy?

    unpolishedFunctionality = this.props.enableAll

    unpolishedVisually = this.props.enableAll

    // confusing

    // TODO/idea: alpha, beta, release-candidate


    showDebugPerformanceTracking = this.props.enableAll

    /** This is becoming similar to logger levels and logger tree */
    showDebug = this.props.enableAll

    showAdvanced = this.props.enableAll

    distracting = this.props.enableAll

    stressful = this.props.enableAll // also: depressing overwhelming, over-the-top (e.g. having 3000 quiz items pending) :)

    annoying = this.props.enableAll


    /** e.g. task statuses; prolly also published/draft for content biz */
    workflowStatuses = this.props.enableAll

    /** CROSS_CUTTING feature;
     * kinda stressful distracting annoying; timer time tracking current user activity */
    userActivityTiming = this.props.enableAll

    /** CROSS_CUTTING feature;
     e.g. on quiz / mindfulness */
    userActivityCountDownTimer = this.props.enableAll

    /** CROSS-CUTTING feature; statistics */
    stats = this.props.enableAll

    /** CROSS-CUTTING feature; stuff like official and published; important for my future content business */
    admin = this.props.enableAll

    /** just an idea; more high priority than todos/notes/ideas texts display; should fix before release to end-users;
     * Can disable for demos. Should prolly be last in order of maturity, to force fixing fixmes before release. */
    showFixmes = this.props.enableAll

}
