import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ProfitCenter } from './profitcenter';
import { ProfitCenterService } from './profitcenter.service';

@Component({
  selector: 'app-profitcenter',
  templateUrl: './profitcenter.component.html',
  styleUrls: ['./profitcenter.component.css']
})

export class ProfitCenterComponent implements OnInit { 
  //#region form variables
  readonly optionName: string = 'Profit Center';
  readonly colSearch =
    [
      { headerName: 'WH Id', field: 'whId', width: 70 },
      { headerName: 'Warehouse Name', field: 'whName' },
      { headerName: 'PC Id', field: 'pcId', width: 70 },
      { headerName: 'Profit Center Name', field: 'pcName' },
    ];
  frmProfitCenter: any;
  lstWarehouse: any;
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  @ViewChild('pcId', { static: true }) pcId: ElementRef;
  @ViewChild('pcCode', { static: true }) pcCode: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcProfitCenter: ProfitCenterService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService ) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmProfitCenter = this.formbulider.group({
      pcId: [null, [Validators.required]],
      pcCode: [null, [Validators.required]],
      pcName: [null, [Validators.required]],
      deptCode: [null, [Validators.required]],
      whId: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmProfitCenter.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmProfitCenter.reset();
    this.frmProfitCenter.enable();
    this.frmProfitCenter.controls.pcId.disable();
    this.frmProfitCenter.patchValue({ isActive: true});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);    
    this.pcCode.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmProfitCenter.controls.pcId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.pcId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcProfitCenter.getProfitCenters().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Profit Center", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.pcId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmProfitCenter.enable();
    this.frmProfitCenter.controls.pcId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.pcCode.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmProfitCenter.markAllAsTouched();
      if (!this.frmProfitCenter.invalid) {
        var formData: ProfitCenter= this.frmProfitCenter.getRawValue();
        formData.footer = this.footer;
        this.svcWaitDlg.open({});
        this.svcProfitCenter.save(formData).subscribe(
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
      this.svcProfitCenter.get(Id).subscribe(
        pc => {
          if (pc) {
            this.frmProfitCenter.disable();
            this.frmProfitCenter.controls['pcId'].setValue(pc.pcId);
            this.frmProfitCenter.controls['pcCode'].setValue(pc.pcCode);
            this.frmProfitCenter.controls['pcName'].setValue(pc.pcName);
            this.frmProfitCenter.controls['deptCode'].setValue(pc.deptCode);
            this.frmProfitCenter.controls['whId'].setValue(pc.whId);
            this.frmProfitCenter.controls['isActive'].setValue(pc.isActive);
            this.footer = pc.footer;
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
      this.svcProfitCenter.getLookup().subscribe(
        data => {
          this.lstWarehouse = data.lstWarehouse;
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
    this.frmProfitCenter.reset();
    this.frmProfitCenter.disable();
    this.errors = [];
  }
  //#endregion local functions
}
