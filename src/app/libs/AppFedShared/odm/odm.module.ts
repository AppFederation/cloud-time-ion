import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SyncStatusIconComponent} from './sync-status/sync-status-icon.component'
import {IonicModule} from '@ionic/angular'
import {SyncPopoverComponent} from './sync-status/sync-popover/sync-popover.component'
import {ThemeConfigComponent} from '../theme-config/theme-config.component'
import {FeatureConfigComponent} from '../feature-config/feature-config.component'

@NgModule({
    declarations: [
        SyncStatusIconComponent,
        SyncPopoverComponent,
        ThemeConfigComponent,
        FeatureConfigComponent,
    ],
    exports: [
        SyncStatusIconComponent,
        FeatureConfigComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
    ]
})
export class OdmModule { }
