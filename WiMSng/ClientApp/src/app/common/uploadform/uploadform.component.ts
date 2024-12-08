import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agEnum } from '../../helper/agEnum';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { UploadFormService } from '../uploadform/uploadform.service';

export interface DialogData {}
@Component({
  selector: 'app-uploadform',
  templateUrl: './uploadform.component.html',
  styleUrls: ['./uploadform.component.css']
})

export class UploadFormComponent implements OnInit {
  //#region form variables
  requestData: any[];
  public goRequest: GridOptions;
  requestFormGroup: any;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcWaitDlg: WaitDialogService,
    private svcUploadForm: UploadFormService, private toaster: agToasterService) { }

  ngOnInit(): void {
    this.requestFormGroup = this.formbulider.group({    });
    this.initGrid();
    this.getForms()
  }

  //#region toolbar functions
  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  getForms() {
    try {
      this.svcWaitDlg.open({});
      this.svcUploadForm.get(agEnum.WorkFlow.ALL).subscribe(
        data => { this.requestData = data; },
        error => { this.toaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.toaster.showFailure(e);
      this.svcWaitDlg.close();
    }
  }
  //#endregion local functions

  //#region form Grid Definition & functions
  colReq = [
    {
      headerName: "Document", field: "workFlowName", width: 90,
      cellStyle: { backgroundColor: 'lightgoldenrodyellow', color: 'darkgoldenrod', fontWeight: 'bold' },
    },
    {
      headerName: "Req #", field: "formId", width: 80,
      cellStyle: { backgroundColor: 'lightgoldenrodyellow', color: 'darkgoldenrod', fontWeight: 'bold' },
    },
    { headerName: "Warehouse", field: "whName", width: 160 },
    { headerName: "Storer ", field: "storerKey", width: 130 },
    { headerName: "Customer Ref #", field: "customerOrderNo", width: 150 },
    { headerName: "State", field: "stateName", width: 160 },
    { headerName: "Sender", field: "sender", width: 120 },
    { headerName: "Uploaded On", field: "sentOn", width: 150 },
    { headerName: "Uploaded in WMS", field: "uploadedinWMSDbOn", width: 150 }
  ];

  initGrid() {
    this.goRequest = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        floatingFilter: true,
        filter: true,
        resizable: true,
        sortable: true
      },
      onGridReady: () => {
        this.goRequest.api.sizeColumnsToFit();
      }
    };
  }
  //#endregion
}
