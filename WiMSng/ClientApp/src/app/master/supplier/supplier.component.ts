import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agEnum } from '../../helper/agEnum';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { SupplierService } from './supplier.service';
import { Supplier} from './supplier';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})

export class SupplierComponent implements OnInit {
  //#region constant variableshh
  readonly optionName: string = 'Supplier';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'supplierId', width: 70 },
      { headerName: 'Head Name', field: 'supplierName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmSupplier: any;
  lstControlSupplierId: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('supplierName', { static: true }) supplierName: ElementRef;
  @ViewChild('supplierId', { static: true }) supplierId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcSupplier: SupplierService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmSupplier = this.formbulider.group({
      supplierId: [null, [Validators.required]],
      supplierName: [null, [Validators.required]],
      controlSupplierId: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmSupplier.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }
  //#region toolbar functions
  tbAdd() {
    this.frmSupplier.reset();
    this.frmSupplier.enable();
    this.frmSupplier.controls.supplierId.disable();
    this.frmSupplier.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.supplierName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmSupplier.controls.supplierId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.supplierId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcSupplier.getSuppliers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Supplier", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.supplierId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmSupplier.enable();
    this.frmSupplier.controls.supplierId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.supplierName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmSupplier.markAllAsTouched();
      if (!this.frmSupplier.invalid) {
        this.svcWaitDlg.open({});
        var formData :Supplier = this.frmSupplier.getRawValue();
        formData.footer = this.footer;
        this.svcSupplier.save(formData).subscribe(
          () => {
            this.initForm();
            agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Record saved Successfully');
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcSupplier.get(Id).subscribe(
        supplier => {
          if (supplier) {
            this.frmSupplier.disable();
            this.frmSupplier.controls['supplierId'].setValue(supplier.supplierId);
            this.frmSupplier.controls['supplierName'].setValue(supplier.supplierName);
            this.frmSupplier.controls['controlSupplierId'].setValue(supplier.controlSupplierId);
            this.frmSupplier.controls['isActive'].setValue(supplier.isActive);
            this.footer = supplier.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmSupplier.reset();
    this.frmSupplier.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
