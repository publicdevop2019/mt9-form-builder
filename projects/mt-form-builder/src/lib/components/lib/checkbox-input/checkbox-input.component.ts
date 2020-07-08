import { ChangeDetectorRef, Component, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NgLinker } from '../../../classes/ng-linker';
import { BaseService } from '../../../services/base.service';
import { EditorService } from '../../../services/editor.service';
@Component({
  selector: 'lib-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.css', '../form.css']
})
export class CheckboxInputComponent extends NgLinker implements OnDestroy, OnInit {
  public childFormGroup: FormGroup = new FormGroup({});
  private childFormChangeSub: Subscription;
  constructor(editorServ: EditorService, baseServ: BaseService, public cdRef: ChangeDetectorRef) {
    super(editorServ, baseServ, cdRef);
  }
  ngOnInit() {
    super.ngOnInit();
    this.base.ctrl.valueChanges
      .pipe(filter(e => Array.isArray(e) || typeof e === 'boolean'))
      .subscribe(() => {
        this.updateChildFormGroup();
      });
    this.updateChildFormGroup();
  }
  ngOnDestroy() {
    if (this.childFormChangeSub)
      this.childFormChangeSub.unsubscribe();
    super.ngOnDestroy();
  }
  updateParentCtrl() {
    const childKeys = Object.keys(this.childFormGroup.controls);
    if (childKeys.length === 1) {
      this.fg.get(this.config.key).setValue(this.childFormGroup.get(childKeys[0]).value);
    } else {
      const nextValue: string[] = childKeys.filter(e => this.childFormGroup.get(e).value);
      this.fg.get(this.config.key).setValue(nextValue);
    }
  }
  updateChildFormGroup() {
    let noEmitEvent = { emitEvent: false };
    this.config.options.forEach((opt, index) => {
      let nextValue: any;
      if (Array.isArray(this.base.ctrl.value)) {
        let typed = (this.fg.get(this.config.key).value as Array<string>);
        nextValue = typed.indexOf(opt.value) > -1;
      }
      else if (typeof this.base.ctrl.value === 'boolean') {
        nextValue = this.base.ctrl.value;
      }
      else if (this.base.ctrl.value === null || this.base.ctrl.value === '') {
        nextValue = '';
      }
      else {
        console.error('!! Unknown type, should be one of [Array,boolean]' + this.base.ctrl.value + typeof this.base.ctrl.value)
      }
      if (this.childFormGroup.get(opt.value)) {
        this.childFormGroup.get(opt.value).setValue(nextValue, noEmitEvent);
        if (this.config.disabled) {
          this.childFormGroup.get(opt.value).disable(noEmitEvent);
        } else {
          this.childFormGroup.get(opt.value).enable(noEmitEvent);
        }
      } else {
        // wait untill all controls addedd then update parent control value
        // otherwise parent control will have incorrect number of childKeys
        if (index === 0 && this.childFormChangeSub)
          this.childFormChangeSub.unsubscribe();
        this.childFormGroup.addControl(opt.value, new FormControl({ value: nextValue, disabled: this.config.disabled }));
        if (index === this.config.options.length - 1)
          this.childFormChangeSub = this.childFormGroup.valueChanges.subscribe(() => {
            this.updateParentCtrl();
          });
      }
    });
  }
}
