import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgLinker } from '../../../classes/ng-linker';
import { IOption } from '../../../classes/template.interface';
import { FormInfoService } from '../../../services/form-info.service';
@Component({
  selector: 'lib-checkbox-input-new',
  templateUrl: './checkbox-input-new.component.html',
  styleUrls: ['./checkbox-input-new.component.css', '../form.css']
})
export class CheckboxInputNewComponent extends NgLinker implements OnDestroy, OnInit, OnChanges {
  constructor(public cdRef: ChangeDetectorRef, public formInfoSvc: FormInfoService) {
    super(cdRef, formInfoSvc);
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(simpleChange: SimpleChanges) {
    super.ngOnChanges(simpleChange);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  handleChange(event: MatCheckboxChange, option: IOption) {
    const var0 = (this.base.ctrl.value || []) as string[]
    if (!this.config.label) {
      this.base.ctrl.setValue(event.checked)
    } else {
      if (event.checked) {
        this.base.ctrl.setValue([...var0, option.value])
      } else {
        this.base.ctrl.setValue(var0.filter(e => e !== option.value))
      }
    }
  }
  getCheckedStatus(option: IOption) {
    if (!this.config.label) {
      return (!!this.base.ctrl.value)
    } else {
      return (this.base.ctrl.value || []).includes(option.value)
    }

  }
}