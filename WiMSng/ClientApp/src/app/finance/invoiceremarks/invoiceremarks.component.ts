import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InvoiceRemarks } from './invoiceremarks';
import { InvoiceRemarksService } from './invoiceremarks.service';

@Component({  
  selector: 'app-invoiceremarks',  
  templateUrl: './invoiceremarks.component.html',  
  styleUrls: ['./invoiceremarks.component.css']  
})  

export class InvoiceRemarksComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Invoice Remarks';
  frmInvoiceRemarks: any;
  footer: agFooter = new agFooter();
  @ViewChild('invoiceNo', { static: true }) invoiceNo: ElementRef
  @ViewChild('projectName', { static: true }) projectName: ElementRef
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcWaitDlg: WaitDialogService,
    private svcInvoiceRemarks: InvoiceRemarksService, private svcToaster: agToasterService) {       }  
  
  ngOnInit() {
    this.frmInvoiceRemarks = this.formbulider.group({
      invoiceNo: [null, [Validators.required]],
      projectName: [null],
      projectTitle: [null],
      remarks: [null],
      invoiceId: [null],
    });
    this.frmInvoiceRemarks.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions  
  tbRecall() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.frmInvoiceRemarks.controls.invoiceNo.enable();
    this.invoiceNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmInvoiceRemarks.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmInvoiceRemarks.controls.invoiceNo.disable();
    this.projectName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmInvoiceRemarks.markAllAsTouched();
      if (!this.frmInvoiceRemarks.invalid) {
        this.svcWaitDlg.open({});
        var formData: InvoiceRemarks = this.frmInvoiceRemarks.getRawValue();
        formData.footer = this.footer;
        this.svcInvoiceRemarks.save(formData).subscribe(
          () => {
            this.svcToaster.showSuccess('Record saved Successfully');
            this.initForm();
            agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
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
   get(invoiceNo: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcInvoiceRemarks.get(invoiceNo).subscribe(
        ir => {
          if (ir) {
            this.frmInvoiceRemarks.disable();
            this.frmInvoiceRemarks.controls['invoiceNo'].setValue(ir.invoiceNo);
            this.frmInvoiceRemarks.controls['projectName'].setValue(ir.projectName);
            this.frmInvoiceRemarks.controls['projectTitle'].setValue(ir.projectTitle);
            this.frmInvoiceRemarks.controls['remarks'].setValue(ir.remarks);
            this.frmInvoiceRemarks.controls['invoiceId'].setValue(ir.invoiceId);
            this.footer = ir.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else {
            this.tbEdit();
          }         
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmInvoiceRemarks.reset();    
    this.frmInvoiceRemarks.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
