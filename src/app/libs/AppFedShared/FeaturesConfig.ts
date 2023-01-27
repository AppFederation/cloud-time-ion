import {showWhatIUse} from './feature.service'
import {FeatureLevelsConfig} from './FeatureLevelsConfig'
import {FeaturesProps} from './FeaturesProps'

export class FeaturesConfig extends FeatureLevelsConfig {


    constructor(
        public props: FeaturesProps,
    ) {
        super(props)
    }


    // IDEA for UI - shift+click or long press would select/unselect range from last clicked

    // this is really 2 dimensions - levels, features/sub-products; maybe also pages; could also have the API like that: `feat.journal.ugly`


    // === mock/prototype-only:


    shopping = this.fc(this.props)

    cloudTime = this.fc(this.props)

    notes = this.fc(this.props)

    /** OrYoL / Coviob style outliner notes with tree nodes */
    outlinerTreeNotes = this.fc(this.props)

    itemsTree = this.fc(this.props)

    // experimental:
    categoriesTree = this.fc(this.props)

    // ==== kinda working:

    tutorial = this.fc(this.props)

    lifedvisor = showWhatIUse

    journal = showWhatIUse

    tasks = showWhatIUse

    roiPoints = this.fc(this.props)

    /** prolly about more long-term planning/estimating than plan-today */
    planning = this.fc(this.props)


    /** estimates / milestones */
    estimating = showWhatIUse

    milestones = this.fc(this.props)

    planToday = this.fc(this.props)

    /** also keywords: plan execution service */
    timeTracking = this.fc(this.props)

    /** logging of time tracked periods */
    timeTrackingPeriods = this.fc(this.props)
    //   {
    //   periods: {
    //     /* this is only a placeholder for good future-proofness top-down usage patterns; total implementation of tree will be quite complicated in logic and UI */
    //     showFixmes: false
    //   }
    // }

    /** most mature prolly */
    learning = true

    quiz = this.fc(this.props)

    private fc(props: FeaturesProps) {
        return new FeatureLevelsConfig(props)
    }
}
