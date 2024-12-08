import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { KAM } from './kam';
import { KAMService } from './kam.service';

@Component({  
  selector: 'app-kam',  
  templateUrl: './kam.component.html',  
  styleUrls: ['./kam.component.css']  
})  

export class KAMComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'KAM';
  readonly colSearch =
  [
      { headerName: 'Id', field: 'kamId', width: 70 },
      { headerName: 'Key Account Manager Name', field: 'kamName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  frmKAM: any;
  //lstEmail: any;
  footer: agFooter = new agFooter();
  @ViewChild('kamName', { static: true }) kamName: ElementRef;
  @ViewChild('kamId', { static: true }) kamId: ElementRef;
  //#endregion

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcKAM: KAMService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }  
  
  ngOnInit() {
    this.frmKAM = this.formbulider.group({
      kamId: [null, [Validators.required]],
      kamName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      isActive: [null],
    });   
    this.frmKAM.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmKAM.reset();  
    this.frmKAM.enable();
    this.frmKAM.controls.kamId.disable();
    this.frmKAM.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.kamName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmKAM.controls.kamId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.kamId.nativeElement.focus();
  }

  tbEdit() {      
    this.frmKAM.enable();   
    this.frmKAM.controls.kamId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.kamName.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcKAM.getKAMs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select KAM", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.kamId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbSave() {
    try {
      this.frmKAM.markAllAsTouched();
      if (!this.frmKAM.invalid) {
        this.svcWaitDlg.open({});
        var formData :KAM = this.frmKAM.getRawValue();
        formData.footer = this.footer;
        this.svcKAM.save(formData).subscribe(
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
      this.svcKAM.get(Id).subscribe(
        kam => {
          if (kam) {
            this.frmKAM.disable();
            this.frmKAM.controls['kamId'].setValue(kam.kamId);
            this.frmKAM.controls['kamName'].setValue(kam.kamName);
            this.frmKAM.controls['email'].setValue(kam.email);
            this.frmKAM.controls['isActive'].setValue(kam.isActive);
            this.footer = kam.footer;
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
    this.frmKAM.reset();    
    this.frmKAM.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
