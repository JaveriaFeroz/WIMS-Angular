import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Calendar } from './calendar';
import { CalendarService } from './calendar.service';
import { CalendarDays } from './calendardays';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  //#region form variable
  public goCalendar: GridOptions;
  readonly optionName: string = 'Calendar';  
  frmCalendar: any;
  calendarData: CalendarDays[];
  lstDayType: any;
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  minDate = new Date().getDate() - 35;
  maxDate = new Date().getDate() + 180;
  frameworkComponents = {
    agDateEditor: agGridDateEditor
  }
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcWaitDlg: WaitDialogService,
    private svcCalendar: CalendarService, private svcToaster: agToasterService) {
    sessionStorage.removeItem("lstDayType");
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmCalendar = this.formbulider.group({
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]]
    });   
  }

  //#region toolbar functions
  tbLoad() {
    try {
      var formData: Calendar = this.frmCalendar.getRawValue();
      if (!formData.dateFrom || !formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting calendar extraction request.');
        return;
      }
      if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting calendar extraction request. Date From must always be same or earlier than Date To');
        return;
      }
      else {
        this.svcWaitDlg.open({});
        this.svcCalendar.get(formData.dateFrom, formData.dateTo).subscribe(
          c => {
            if (c) {
              this.calendarData = c.details;
              this.frmCalendar.controls.dateFrom.disable();
              this.frmCalendar.controls.dateTo.disable();
              (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true;
              this.svcWaitDlg.close();
            }
            else {
              this.svcToaster.showWarning('No record found with your provided Date Range or you don`t have access to this record');
              this.svcWaitDlg.close();
            }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  tbSave() {
    try {
      this.frmCalendar.markAllAsTouched();
      if (!this.frmCalendar.invalid) {
        var formData: Calendar = this.frmCalendar.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcCalendar.save(formData).subscribe(
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
    sessionStorage.removeItem("lstDayType");
    this.router.navigate(['/MainForm']);
  } 
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goCalendar = <GridOptions>{
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
        if (params.colDef.field == "dayTypeId") {
          if (params.data.dayTypeId != "") {
            params.node.setDataValue("dayTypeId", parseInt(params.data.dayTypeId));
          }
          else {
            params.node.setDataValue("dayTypeId", null);
          }
        }
      },
    };
  }

  colCalendar = [    
    {
      headerName: "Date", field: "calendarDate", width: 105,
      cellEditor: 'agDateEditor', editable: false,  valueFormatter: agGridHelper.dateFormatter
    },
    {
      headerName: "Day Type", field: "dayTypeId", cellEditor: agGridHelper.getAgilitySelect(), editable: true,
      cellEditorParams: { source: 'DayType', class: "180" }, valueFormatter: agGridHelper.getDayTypeName, width: 180
    }, 
    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
  ];   

  getDetailFromGrid() {
    let rowData = [];
    this.goCalendar.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion
  
  //#region local functions
  private loadLookup() {
    try {
      this.svcCalendar.getLookup().subscribe(
        data => {
          sessionStorage.setItem("lstDayType", JSON.stringify(data.lstDayType));  
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

  private validate(c: Calendar) {
    this.errors = [];
    if (c.details.some(x => !x.dayTypeId)) {
      this.errors.push('Valid day type must be selected for each date in Grid');
    }
  }

  private initForm() {
    this.frmCalendar.reset();
    this.frmCalendar.enable();
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = false;
    this.errors = [];
    this.goCalendar.api.setRowData([]);
    this.footer = new agFooter();
  }
  //#endregion local functions
}



