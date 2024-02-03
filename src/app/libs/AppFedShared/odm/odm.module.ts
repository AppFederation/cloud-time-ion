import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SyncStatusIconComponent} from './sync-status/sync-status-icon.component'
import {IonicModule} from '@ionic/angular'
import {SyncPopoverComponent} from './sync-status/sync-popover/sync-popover.component'
import {ThemeConfigComponent} from '../theme-config/theme-config.component'
import {FeatureConfigComponent} from '../feature-config/feature-config.component'
import {AboutAppComponent} from './sync-status/sync-popover/about-app/about-app.component'

@NgModule({
    declarations: [
        SyncStatusIconComponent,
        SyncPopoverComponent,
        ThemeConfigComponent,
        FeatureConfigComponent,
        AboutAppComponent,
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
