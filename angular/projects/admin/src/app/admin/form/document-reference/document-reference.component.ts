import { Component, OnInit, Optional, Self, OnDestroy, HostBinding, Input, ElementRef } from '@angular/core';
import { MatFormFieldControl, MatSelectChange } from '@angular/material';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { DocumentService } from '../../../services/document.service';
import { Document } from 'tanam-models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'tanam-document-reference',
  templateUrl: './document-reference.component.html',
  styleUrls: ['./document-reference.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DocumentReferenceComponent,
    },
  ],
})
export class DocumentReferenceComponent implements MatFormFieldControl<Document>, ControlValueAccessor, OnInit, OnDestroy {
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `tanam-document-reference-${DocumentReferenceComponent._nextId++}`;
  controlType = 'document-reference';

  @Input() documentType: string;
  @Input() placeholder: string;

  focused: boolean;
  errorState: boolean;
  autofilled?: boolean;

  stateChanges = new Subject<void>();
  documentOptions$: Observable<Document[]>;

  private _required = false;
  private _disabled = false;
  private _value: Document;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: Document) => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly documentService: DocumentService,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.focusMonitor.monitor(this.elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get value(): Document {
    return this._value;
  }
  set value(document: Document) {
    this._value = !!document ? { ...document } : null;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get empty() {
    return !this._value;
  }

  ngOnInit() {
    this.documentOptions$ = this.documentService.query(this.documentType, {
      orderBy: {
        field: 'title',
        sortOrder: 'asc',
      },
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    this._onTouchedCallback();
  }

  writeValue(document: Document): void {
    this.value = document;
  }

  registerOnChange(callback: (val: Document) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  compareFn(c1: any, c2: any): boolean {
    return !!c1 && !!c2 ? c1.id === c2.id : c1 === c2;
  }

  onChange(changeEvent: MatSelectChange) {
    this._onChangeCallback(changeEvent.value);
    this.stateChanges.next();
  }
}