import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agGridHelper } from '../../helper/agGridHelper';
import { agEnum } from '../../helper/agEnum';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { MyFormService } from '../myform/myform.service';
import { RecipientService } from '../recipient/recipient.service';
import { getAPIBaseUrl } from '../../../main';

export interface DialogData {}
@Component({
  selector: 'app-myform',
  templateUrl: './myform.component.html',
  styleUrls: ['./myform.component.css']
})
export class MyFormComponent implements OnInit {
  //#region form variables
  formData: any[];   
  goForms: GridOptions;  
  optionFormGroup: any;
  apiURL: string;
  //#endregion

  constructor(private router: Router, @Inject('API_BASE_URL') baseUrl: string,
    private formbulider: FormBuilder, private svcMyForm: MyFormService, private svcHistoryDlg: HistoryDialogService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService, private svcRecipient: RecipientService,
  ) { this.apiURL = baseUrl; }

  ngOnInit(): void {
     this.optionFormGroup = this.formbulider.group({  options:['0'] });  
    this.initGrid();
    this.GetMyForms(0)
  }

  //#region toolbar functions
  tbHistroy(formId: number, workFlowName: string, workFlowId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(workFlowId, formId).subscribe(r => {
        this.svcHistoryDlg.open("Activity history Of " + workFlowName + " # " + formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }
  
  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  GetMyForms(id: number) {
    try {
      if (id == 0) {
        this.svcMyForm.ActiveForms(agEnum.WorkFlow.ALL).subscribe(
          data => {
            this.formData = data;
          },
          error => {
            this.svcToaster.showFailure(error);
          }
        );
      }
      else if (id == 1) {
        this.svcMyForm.SentForms(agEnum.WorkFlow.ALL).subscribe(
          data => {
            this.formData = data;
          },
          error => {
            this.svcToaster.showFailure(error);
          }
        );
      }
      else if (id == 2) {
        this.svcMyForm.CompletedForms(agEnum.WorkFlow.ALL).subscribe(
          data => {
            this.formData = data;
          },
          error => {
            this.svcToaster.showFailure(error);
          }
        );
      }
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }
  //#endregion local functions

  //#region form Grid Definition & functions
  colForms = [
    {
      headerName: "Work Flow", field: "workFlowName", width: 110,
      cellStyle: {
        backgroundColor: 'lightgoldenrodyellow',
        color: 'darkgoldenrod',
        fontWeight: 'bold'
      },
    },
    {
      headerName: "Form #", field: "formId", width: 90,
      cellRenderer: function (params) {
        return '<a href="' + params.data.route + '?formId=' + params.value + '" title="Click to open this form">' + params.value + '</a>'
      },
      cellStyle: { textDecoration: 'underline' }
    },
    { headerName: "State", field: "stateName", width: 160 },
    { headerName: "Sender", field: "sender", width: 120 },
    { headerName: "Recipient", field: "recipient", width: 120 },
    { headerName: "Sent On", field: "sentOn", width: 120 },
    {
      headerName: "Amount", field: "documentValue", type: "numericColumn", filter: "agNumberColumnFilter",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 90
    },
    { headerName: "Comments", field: "submissionComments", width: 200, cellEditor: "agLargeTextCellEditor", tooltipField: "submissionComments" },
    {
      headerName: "History", field: "History", width: 40, filter: false,
      cellRenderer: function (params) {
        return '<a title="Click to view history of selected form"><img src="/WiMS/assets/images/history.png" width="20" height="20"/></a>'
      }
    },
    { headerName: 'WFId', field: 'workFlowId', hide: true, suppressColumnsToolPanel: true },
    { headerName: 'C', field: 'route', hide: true, suppressColumnsToolPanel: true },
    { headerName: 'TK', field: 'trackingKey', hide: true, suppressColumnsToolPanel: true }
  ];

  initGrid()
  {
    this.goForms = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      //columnDefs: this.colForms,
      rowSelection: 'single',
      defaultColDef: {
        editable: false,
        floatingFilter: true,
        filter: true,
        resizable: true,
        sortable: true
      },
      onGridReady: () => {
        this.goForms.api.sizeColumnsToFit();
      }
    };
  }

  onCellClicked(event) {
    const column = event.api.getFocusedCell().column.colDef.headerName;
    if (column == "History") {
      this.tbHistroy(event.node.data.trackingKey, event.node.data.workFlowName, event.node.data.workFlowId);
    }
  }
  //#endregion
}
