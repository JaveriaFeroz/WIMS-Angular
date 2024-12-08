import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { HandlingDoc } from './handlingdoc';
import { HandlingDocService } from './handlingdoc.service';

@Component({
  selector: 'app-handlingdoc',
  templateUrl: './handlingdoc.component.html',
  styleUrls: ['./handlingdoc.component.css']
})

export class HandlingDocComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Update Container Type/Quantity';
  frmHandlingDoc: any;
  lstContainerType: any[];
  lstWarehouse: any;
  lstDocType: any = [
    { id: 1, name: 'ASN' },
    { id: 2, name: 'SO' },
  ];
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('whId', { static: true }) whId: MatSelect;
  //#endregion

  targetNode: Node;
  config = { childList: true, subtree: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if ((mutation.addedNodes[0].id === 'btnSave' || mutation.addedNodes[0].id === 'btnUndo') && (<HTMLInputElement>document.getElementById('btnLoad')).disabled === false) {
          mutation.addedNodes[0].disabled = true;
        }
      }
    }
  };
  observer = new MutationObserver(this.callback);

  constructor(private router: Router, private formbulider: FormBuilder, private svcWaitDlg: WaitDialogService,
    private svcHandlingDoc: HandlingDocService, private svcToaster: agToasterService) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmHandlingDoc = this.formbulider.group({
      whId: [null, [Validators.required]],
      storerKey: [null, [Validators.required]],
      docTypeId: [null, [Validators.required]],
      docNo: [null, [Validators.required]],
      customerRefNo: [null],
      containerType1: [null],
      qty1: [null],
      containerType2: [null],
      qty2: [null],
      coLoad: [null],
    });
    this.frmHandlingDoc.controls.containerType1.disable();
    this.frmHandlingDoc.controls.qty1.disable();
    this.frmHandlingDoc.controls.containerType2.disable();
    this.frmHandlingDoc.controls.qty2.disable();
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = false;
  }

  ngAfterViewInit() {
    this.targetNode = document.getElementById('btnLoad');
    this.observer.observe(this.targetNode, this.config);
  }
  //#region toolbar functions

  tbLoad() {
    try {
      this.frmHandlingDoc.markAllAsTouched();
      if (!this.frmHandlingDoc.invalid) {
        var formData: HandlingDoc = this.frmHandlingDoc.getRawValue();
        this.svcWaitDlg.open({});
        this.svcHandlingDoc.get(formData.whId, formData.storerKey, formData.docNo, formData.docTypeId).subscribe(
          hd => {
            if (hd) {
              this.frmHandlingDoc.controls['whId'].setValue(hd.whId);
              this.frmHandlingDoc.controls['storerKey'].setValue(hd.storerKey);
              this.frmHandlingDoc.controls['docTypeId'].setValue(hd.docTypeId);
              this.frmHandlingDoc.controls['docNo'].setValue(hd.docNo);
              this.frmHandlingDoc.controls['customerRefNo'].setValue(hd.customerRefNo);
              this.frmHandlingDoc.controls['containerType1'].setValue(hd.containerType1);
              this.frmHandlingDoc.controls['qty1'].setValue(hd.qty1);
              this.frmHandlingDoc.controls['containerType2'].setValue(hd.containerType2);
              this.frmHandlingDoc.controls['qty2'].setValue(hd.qty2);
              this.frmHandlingDoc.controls['coLoad'].setValue(hd.coload);
              this.footer = hd.footer;
              this.frmHandlingDoc.controls.containerType1.enable();
              this.frmHandlingDoc.controls.qty1.enable();
              this.frmHandlingDoc.controls.containerType2.enable();
              this.frmHandlingDoc.controls.qty2.enable();
              this.frmHandlingDoc.controls.whId.disable();
              this.frmHandlingDoc.controls.storerKey.disable();
              this.frmHandlingDoc.controls.docTypeId.disable();
              this.frmHandlingDoc.controls.docNo.disable();
              (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true;
            }
            else { this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record'); }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  tbSave() {
    try {
      this.frmHandlingDoc.markAllAsTouched();
      if (!this.frmHandlingDoc.invalid) {
        var formData: HandlingDoc = this.frmHandlingDoc.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcHandlingDoc.save(formData).subscribe(
            () => {
              this.initForm();
              this.svcToaster.showSuccess('Record saved Successfully');
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); }
          );
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions 
  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcHandlingDoc.getLookUp().subscribe(
        data => {
          this.lstWarehouse = data.lstWarehouse;
          this.lstContainerType = data.lstContainerType;
          this.lstContainerType.push({ typeId: null, typeName: 'None' });
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(hd: HandlingDoc) {
    this.errors = [];
    if (!hd.containerType1 && hd.qty1 && hd.qty1 != 0) {
      this.errors.push('Please select valid Container Type 1 if you want to assign Container Qty');
    }
    else if (hd.containerType1 && !hd.qty1) {
      this.errors.push('Please provide valid Container Quantity if you wnat to select Container Type 1');
    }
    else if (hd.containerType1 && hd.qty1 <= 0) {
      this.errors.push('Container Quantity 1 must be positive');
    }
    else if (!hd.containerType2 && hd.qty2 && hd.qty2 != 0) {
      this.errors.push('Please select valid Container Type 2 if you want to assign Container Qty');
    }
    else if (hd.containerType2 && !hd.qty2) {
      this.errors.push('Please provide valid Container Quantity if you wnat to select Container Type 2');
    }
    else if (hd.containerType2 && hd.qty2 <= 0) {
      this.errors.push('Container Quantity 2 must be positive');
    }
  }

  private initForm() {
    this.frmHandlingDoc.reset();
    this.frmHandlingDoc.enable();
    this.footer = new agFooter();
    this.errors = [];
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = false;
  }
  //#endregion local functions
}
