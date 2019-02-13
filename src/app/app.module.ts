import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {HttpModule} from '@angular/http'
import {FirestoreTreeService} from './shared/firestore-tree.service';
import { TestFirestoreComponent } from './experiments/test-firestore/test-firestore.component';
import { NodeContentComponent } from './tree/node-content/node-content.component'
import {RouterModule, Routes} from '@angular/router';
import { TreeHostComponent } from './tree/tree-host/tree-host.component'
import {TreeService} from './shared/tree.service'
import {MatIconModule} from '@angular/material';
import { TestPermissionsAndFiltersComponent } from './experiments/test-permissions-and-filters/test-permissions-and-filters.component'
import {DbTreeService} from './shared/db-tree-service'
import {FormsModule} from '@angular/forms';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component'
import { DialogService } from './core/dialog.service';
import { NestedTreeComponent } from './nested-tree/nested-tree.component';
import { NestedTreeNodeComponent } from './nested-tree-node/nested-tree-node.component'
import { CoreModule } from './core/core.module';
import { CommandsOverlayComponent } from './tree/commands-overlay/commands-overlay.component';
import { TestComponentInstanceChangingOnInputValueChangeComponent } from './experiments/test-component-instance-changing-on-input-value-change/test-component-instance-changing-on-input-value-change.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeNodeMenuComponent } from './tree/tree-node-menu/tree-node-menu.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ItemClassIconComponent } from './tree/item-class-icon/item-class-icon.component';
import { ConfirmDeleteTreeNodeComponent } from './tree/confirm-delete-tree-node/confirm-delete-tree-node.component';
import { TreePageComponent } from './tree/tree-page/tree-page.component';
import { MyHammerConfig } from './my-hammer-config';
import { NodeCellComponent } from './tree/node-cell/node-cell.component'
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
  {
    path: 'test-perm-fil',
    component: TestPermissionsAndFiltersComponent,
  },
  {
    path: '**',
    redirectTo: 'tree',
  },
];


@NgModule({
  declarations: [
    AppComponent,
    TestFirestoreComponent,
    NodeContentComponent,
    TreeHostComponent,
    TestPermissionsAndFiltersComponent,
    ConfirmModalComponent,
    NestedTreeComponent,
    NestedTreeNodeComponent,
    CommandsOverlayComponent,
    TestComponentInstanceChangingOnInputValueChangeComponent,
    TreeNodeMenuComponent,
    ItemClassIconComponent,
    ConfirmDeleteTreeNodeComponent,
    TreePageComponent,
    NodeCellComponent,
  ],
  imports: [
    BrowserModule,
    TreeModule,
    HttpModule,
    FormsModule,
    // MatIconModule,
    RouterModule.forRoot(appRoutes),
    CoreModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [
    TreeDragDropService,
    {provide: DbTreeService, useClass: FirestoreTreeService},
    TreeService,
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
