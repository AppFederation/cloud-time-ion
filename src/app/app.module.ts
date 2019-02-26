import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http'
import { TestFirestoreComponent } from './experiments/test-firestore/test-firestore.component';
import {RouterModule, Routes} from '@angular/router';
import { TreeHostComponent } from './tree-page/tree-host/tree-host.component'
// import { TestPermissionsAndFiltersComponent } from './experiments/test-permissions-and-filters/test-permissions-and-filters.component'
import {FormsModule} from '@angular/forms';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component'
import { DialogService } from './core/dialog.service';
import { CoreModule } from './core/core.module';
import { CommandsOverlayComponent } from './tree/commands-overlay/commands-overlay.component';
import { TestComponentInstanceChangingOnInputValueChangeComponent } from './experiments/test-component-instance-changing-on-input-value-change/test-component-instance-changing-on-input-value-change.component'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDeleteTreeNodeComponent } from './tree/confirm-delete-tree-node/confirm-delete-tree-node.component';
import { TreePageComponent } from './tree/tree-page/tree-page.component';
import { MyHammerConfig } from './my-hammer-config';
import { NodeCellComponent } from './tree/node-cell/node-cell.component'
import {TreeModelModule} from './tree-model/tree-model.module'
import {DbFirestoreModule} from './db-firestore/db-firestore.module'
import {TreeSharedModule} from './tree/tree-shared.module'
import {SharedModule} from './shared/shared.module'
import {TreePageModule} from './tree-page/tree-page.module'
library.add(fas);

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tree',
  },
  {
    path: 'tree/:rootNodeId',
    component: TreeHostComponent,
  },
  {
    path: 'tree',
    component: TreeHostComponent,
  },
  {
    path: 'test-firestore',
    component: TestFirestoreComponent,
  },
  // {
  //   path: 'test-perm-fil',
    // component: TestPermissionsAndFiltersComponent,
  // },
  {
    path: '**',
    redirectTo: 'tree',
  },
];


@NgModule({
  declarations: [
    AppComponent,
    TestFirestoreComponent,
    // TestPermissionsAndFiltersComponent,
    ConfirmModalComponent,
    CommandsOverlayComponent,
    TestComponentInstanceChangingOnInputValueChangeComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    // MatIconModule,
    RouterModule.forRoot(appRoutes),
    CoreModule,
    SharedModule,
    TreePageModule /* TODO: lazy-loading */,
  ],
  providers: [
    // TreeDragDropService,
    DialogService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  entryComponents: [
    ConfirmDeleteTreeNodeComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
