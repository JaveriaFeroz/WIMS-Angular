import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ChargeType } from './chargetype';
import { ChargeTypeService } from './chargetype.service';

@Component({  
  selector: 'app-chargetype',  
  templateUrl: './chargetype.component.html',  
  styleUrls: ['./chargetype.component.css']  
})  

export class ChargeTypeComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Charge Type';
  readonly colSearch =
  [
      { headerName: 'Type', field: 'typeId', width: 70 },
      { headerName: 'Charge Type Name', field: 'typeName', },
      { headerName: 'Desc On Invoice', field: 'descOnInvoice', width: 140 },
    ];
  frmChargeType: any;
  lstChargeCode: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('typeName', { static: true }) typeName: ElementRef;
  @ViewChild('typeId', { static: true }) typeId: ElementRef;
  //#endregion

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcChargetype: ChargeTypeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
  }  
  
  ngOnInit() {
    this.frmChargeType = this.formbulider.group({
      typeId: [null, [Validators.required]],
      typeName: [null, [Validators.required]],
      chargeCode: [null, [Validators.required]],
      descOnInvoice: [null],
    });
    this.frmChargeType.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbRecall() {
    this.initForm();
    this.frmChargeType.controls.typeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.typeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcChargetype.getChargeTypes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Charge Type", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.typeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmChargeType.enable();
    this.frmChargeType.controls.typeId.disable();
    //this.frmChargeType.controls.typeName.disable();
    //this.frmChargeType.controls.descOnInvoice.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.typeName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmChargeType.markAllAsTouched();
      if (!this.frmChargeType.invalid) {
        this.svcWaitDlg.open({});
        var formData: ChargeType = this.frmChargeType.getRawValue();
        formData.footer = this.footer;

        this.svcChargetype.save(formData).subscribe(
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
   get(id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcChargetype.get(id).subscribe(
        ct => {
          if (ct) {
            this.frmChargeType.disable();
            this.frmChargeType.controls['typeId'].setValue(ct.typeId);
            this.frmChargeType.controls['typeName'].setValue(ct.typeName);
            this.frmChargeType.controls['chargeCode'].setValue(ct.chargeCode);
            this.frmChargeType.controls['descOnInvoice'].setValue(ct.descOnInvoice);
            this.footer = ct.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

 private loadLookup() {
    try {
      this.svcChargetype.getLookup().subscribe(
        data => {
          this.lstChargeCode = data.lstChargeCode;
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }
  private initForm() {
    this.frmChargeType.reset();
    this.frmChargeType.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
