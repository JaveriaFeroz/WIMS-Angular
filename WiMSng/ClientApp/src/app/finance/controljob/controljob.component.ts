import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ControlJob } from './controljob';
import { ControlJobService } from './controljob.service';

@Component({
  selector: 'app-controljob',
  templateUrl: './controljob.component.html',
  styleUrls: ['./controljob.component.css']
})

export class ControlJobComponent implements OnInit {
  //#region from variable
  readonly optionName: string = 'Control Job';
  public goControlJob: GridOptions;
  //model: any = {};
  frmControlJob: any;
  errors: string[] = [];
  controljobsData: any[];
  //extractISData: ControlJobDetail[];
  //CurrentPeriod: any;
  //CurrentPeriodId: any;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcAuth: AuthService,
    private svcControlJob: ControlJobService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.initGrid();
    //var data = JSON.parse(sessionStorage.getItem("Period"));
    //this.CurrentPeriod = data.periodName;
    //this.CurrentPeriodId = data.periodId;
  }

  ngOnInit(): void {
    this.frmControlJob = this.formbulider.group({ periodName: [null], periodId: [null] });
    this.frmControlJob.patchValue({ periodId: this.svcAuth.getPeriodId(), periodName: this.svcAuth.getPeriodName() });
    this.get(this.svcAuth.getPeriodId());
  }

  //#region toolbar functions
  tbSave() {
    try {
      this.frmControlJob.markAllAsTouched();
      if (!this.frmControlJob.invalid) {
        var formData: ControlJob = this.frmControlJob.getRawValue();
        formData.details = this.getDetailFromGrid().filter(x => x.edit || x.revenueJobNo != "" || x.costJobNo != "");
        this.svcWaitDlg.open({});
        this.svcControlJob.save(formData).subscribe(
          () => {
            this.initForm();
            this.svcToaster.showSuccess('Record saved Successfully');
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) {  this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }  
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goControlJob = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },     
      onCellValueChanged: function (params) {
          params.data.edit = true;
      },
    };
  }

  colControlJob = [
    {
      headerName: 'Control Job Mapping',
      children: [
        { headerName: "Storer Group", field: "storerGroupName", editable: false, width: 250 },
        { headerName: "Profit Center", field: "pcName", editable: false, width: 200 },
        { headerName: "Revenue Job#", field: "revenueJobNo", editable: true, width: 170 },
        { headerName: "Cost Job#", field: "costJobNo", editable: true, width: 170 },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
      ]
    }
  ];

  getDetailFromGrid() {
    let rowData = [];
    this.goControlJob.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

 //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcControlJob.get(Id).subscribe(
        cj => {
          if (cj) {
            this.controljobsData = cj.details;
          }
          else { this.svcToaster.showWarning('No record found for current Period or no Active Rate Sheet exist in Client Rate'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmControlJob.reset();
    this.errors = [];
    this.controljobsData = [];
    this.frmControlJob.patchValue({ periodId: this.svcAuth.getPeriodId(), periodName: this.svcAuth.getPeriodName() });
    this.get(this.svcAuth.getPeriodId());
  }
  //#endregion
}
