import {FormControl} from '@angular/forms'
import {Observable} from 'rxjs/internal/Observable'

export class ViewSyncer2<TFormVal, TExternal = TFormVal> {

  private isSetting = false


  constructor(
    public observable: Observable<TExternal>,
    public setExternalFunc: (valFromForm: TFormVal) => void,
    public formControl: FormControl = new FormControl/*<TFormVal>*/()
  ) {
    this.observable.subscribe((val) => {
      if ( ! this.isSetting ) {
        try {
          this.isSetting = true
          this.setValToFormControl(val)
        } finally {
          this.isSetting = false
        }
      }
    })
    this.formControl.valueChanges.subscribe((val: any) => {
      if ( ! this.isSetting ) {
        try {
          this.isSetting = true
          this.setExternalFunc(val)
        } finally {
          this.isSetting = false
        }
      }
    })

  }

  private setValToFormControl(val: TExternal) {
    this.formControl.setValue(val)
  }

  forceValueFromExternal(val: TExternal) {
    this.setValToFormControl(val)
  }
}
