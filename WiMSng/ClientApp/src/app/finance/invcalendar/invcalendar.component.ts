import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InvCalendar } from './invcalendar';
import { InvCalendarService } from './invcalendar.service';
import { InvCal_Detail } from './invcal_detail';

@Component({
  selector: 'app-invcalendar',
  templateUrl: './invcalendar.component.html',
  styleUrls: ['./invcalendar.component.css']
})

export class InvCalendarComponent implements OnInit {
  //#region form variables
  public goActiveCal: GridOptions;
  public goPastCal: GridOptions;
  readonly optionName: string = 'Invoice Calendar';
  readonly colSearch =
    [
      { headerName: 'Calendar ', field: 'calendarId', width: 70 },
      { headerName: 'CalendarName', field: 'calendarName' }
    ];
  frmInvCalendar: any;
  activeCalData: InvCal_Detail[] = [];
  pastCalData: InvCal_Detail[] = [];
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  @ViewChild('calendarId', { static: true }) calendarId: ElementRef;
  @ViewChild('calendarName', { static: true }) calendarName: ElementRef;
  frameworkComponents = { agDateEditor: agGridDateEditor }
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInvCal: InvCalendarService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmInvCalendar = this.formbulider.group({
      calendarId: [null],
      calendarName: [null, [Validators.required]], 
    });
    this.frmInvCalendar.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInvCalendar.reset();
    this.frmInvCalendar.enable();
    this.frmInvCalendar.controls.calendarId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);    
    this.calendarName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.frmInvCalendar.controls.calendarId.enable();
    this.calendarId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInvCal.getInvoiceCalendar().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Invoice Calendar", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) { this.get(r.calendarId); }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInvCalendar.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmInvCalendar.controls.calendarId.disable();
    this.calendarName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmInvCalendar.markAllAsTouched();
      if (!this.frmInvCalendar.invalid) {
        var formData: InvCalendar= this.frmInvCalendar.getRawValue();
        formData.details = this.getCurrentDetailFromGrid();
        formData.expired = [];
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcInvCal.save(formData).subscribe(
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
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    sessionStorage.removeItem("lstPeriod");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goActiveCal = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "periodId") {
          if (params.data.periodId != "") {
            params.node.setDataValue("periodId", parseInt(params.data.periodId));
          }
          else {
            params.node.setDataValue("periodId", null);
          }
        }
      },
    };

    this.goPastCal = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true
      }
    };
  }
  
  colActiveCal = [
    {
      headerName: 'Current & Future Invoice Periods',
      children: [
        {
          headerName: "Date From", field: "dateFrom", width: 95,
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Date To", field: "dateTo", width: 95,
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Period", field: "periodId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Period', class: "100" }, valueFormatter: agGridHelper.getPeriod, width: 100
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddLine  () {
    try {
      var res = this.goActiveCal.api.applyTransaction({
        add: [{
          dateFrom: null, dateTo: null, periodId: null, expired: false,  add: true, edit: false, delete: false
        }]
      });
      this.goActiveCal.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "dateFrom" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goActiveCal.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goActiveCal.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goActiveCal.api);
        }      
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getCurrentDetailFromGrid() {
    let rowData = [];
    this.goActiveCal.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  colPastCal = [
    {
      headerName: 'Past Invoice Periods',
      children: [
        { headerName: "Date From", field: "dateFrom", width: 95, valueFormatter: agGridHelper.dateFormatter },
        { headerName: "Date To", field: "dateTo", width: 95, valueFormatter: agGridHelper.dateFormatter },
        { headerName: "Period", field: "periodName", width: 100 }
      ]
    }  
  ];
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInvCal.get(Id).subscribe(
        ic => {
          if (ic) {
            this.frmInvCalendar.disable();
            this.frmInvCalendar.controls['calendarId'].setValue(ic.calendarId);
            this.frmInvCalendar.controls['calendarName'].setValue(ic.calendarName);
            this.activeCalData = ic.details;
            this.pastCalData = ic.expired;
            this.footer = ic.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridStatus(false);
            agFormHelper.setGridToolbar(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcInvCal.getLookup().subscribe(
        data => { sessionStorage.setItem("lstPeriod", JSON.stringify(data.lstPeriod)); },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(ic: InvCalendar) {
    this.errors = [];
    if (ic.details.filter(x => !x.delete).length == 0) {
      this.errors.push('Atleast one entry must exist in Invoice Calendar Transaction to perform save operation');
    }
    if (ic.details.some(x => !x.delete && !x.periodId)) {
      this.errors.push('Period is a required field and must be mentioned on all Grid Rows');
    }
    if (ic.details.some(x => !x.delete && (!x.dateFrom || !x.dateTo))) {
      this.errors.push('Date From / To are required field and must be provided for every row of Grid');
    }
    if (ic.details.some(x => !x.delete && x.dateFrom > x.dateTo)) {
      this.errors.push('Date From must always be older or equal to Date To');
    }

    if (ic.details.filter(x => !x.delete).length > 0) {
      var detDuplicate = ic.details.filter(x => !x.delete).map(item => ({ dateFrom: item.dateFrom, dateTo: item.dateTo })).slice().sort();
      for (var i = 0; i < detDuplicate.length - 1; i++) {
        if (detDuplicate[i + 1]['dateFrom'] === detDuplicate[i]['dateFrom']) {
          if (detDuplicate[i + 1]['dateTo'] === detDuplicate[i]['dateTo']) {
            this.errors.push('The combination of Date From & To must be unique!');
            i = detDuplicate.length;
          }
        }
      }
    }
  }

  private initForm() {
    this.frmInvCalendar.reset();
    this.frmInvCalendar.disable();
    this.errors = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
    this.activeCalData = [];
    this.pastCalData = [];
  }
  //#endregion local functions
}
