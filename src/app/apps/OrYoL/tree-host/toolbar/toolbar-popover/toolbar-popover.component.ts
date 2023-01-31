import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TreeHostComponent } from '../../tree-host/tree-host.component'
import { DebugService } from '../../../core/debug.service'
import {
  Config,
  ConfigService,
} from '../../../core/config.service'
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { debugLog } from '../../../utils/log'

@Component({
  selector: 'app-toolbar-popover',
  templateUrl: './toolbar-popover.component.html',
  styleUrls: ['./toolbar-popover.component.sass']
})
export class ToolbarPopoverComponent implements OnInit {

  /* workaround for now */
  @Input() treeHost!: TreeHostComponent

  controls: { [K in keyof Config]: UntypedFormControl } = {
    showMinMaxColumns: new UntypedFormControl(),
    showMissingValuesCount: new UntypedFormControl(),
    showAggregateValues: new UntypedFormControl(),
    showTimeTrackedValue: new UntypedFormControl(),
    planExecutionNotificationsEnabled: new UntypedFormControl(),
    planExecutionNotificationTimePercentages: new UntypedFormControl(),
  }

  formGroup = new UntypedFormGroup(this.controls)

  constructor(
    public debugService: DebugService,
    public configService: ConfigService,
  ) { }

  ngOnInit() {
    console.log('ToolbarPopoverComponent ngOnInit')
    // this.configService.config$.subscribe(val => {
    //   this.formGroup.setValue(val)
    // })
    this.setFormValue()
    this.formGroup.valueChanges.subscribe(val => {
      this.configService.patchConfig(val)
    })
  }

  private setFormValue() {
    const formValue = this.configService.config$.lastVal as any
    this.formGroup.patchValue(formValue)
  }

  onDebugChange($event: any) {
    debugLog('$event', $event)
    this.debugService.isDebug$.next($event.target.checked)
  }

}
