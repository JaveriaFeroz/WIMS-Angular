import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { CostHead } from './costhead';
import { CostHeadService } from './costhead.service';

@Component({  
  selector: 'app-costhead',  
  templateUrl: './costhead.component.html',  
  styleUrls: ['./costhead.component.css']  
})  

export class CostHeadComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Expense Type';
  readonly colSearch =
  [
      { headerName: 'Id', field: 'headId', width: 70 },
      { headerName: 'Head Name', field: 'headName' },
      { headerName: 'Charge Code', field: 'chargeCode' },
    ];
  frmCosthead: any;
  lstChargeCode: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('headName', { static: true }) headName: ElementRef;
  @ViewChild('headId', { static: true }) headId: ElementRef;
  //#endregion

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcCostHead: CostHeadService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
  }  
  
  ngOnInit() {
    this.frmCosthead = this.formbulider.group({
      headId: [null, [Validators.required]],
      headName: [null, [Validators.required]],
      chargeCode: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmCosthead.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmCosthead.reset();  
    this.frmCosthead.enable();
    this.frmCosthead.controls.headId.disable();
    this.frmCosthead.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.headName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmCosthead.controls.headId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.headId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCostHead.getCostHeads().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Cost Head", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.headId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {      
    this.frmCosthead.enable();   
    this.frmCosthead.controls.headId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.headName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmCosthead.markAllAsTouched();
      if (!this.frmCosthead.invalid) {
        this.svcWaitDlg.open({});
        var formData: CostHead = this.frmCosthead.getRawValue();
        formData.footer = this.footer;
        this.svcCostHead.save(formData).subscribe(
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
      this.svcCostHead.get(id).subscribe(
        ch => {
          if (ch) {
            this.frmCosthead.disable();
            this.frmCosthead.controls['headId'].setValue(ch.headId);
            this.frmCosthead.controls['headName'].setValue(ch.headName);
            this.frmCosthead.controls['chargeCode'].setValue(ch.chargeCode);
            this.frmCosthead.controls['isActive'].setValue(ch.isActive);
            this.footer = ch.footer;
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
      this.svcCostHead.getLookup().subscribe(
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
    this.frmCosthead.reset();    
    this.frmCosthead.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
