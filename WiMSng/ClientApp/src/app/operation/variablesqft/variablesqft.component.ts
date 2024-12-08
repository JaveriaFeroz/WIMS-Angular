import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { SqFtReading } from './sqftreading';
import { VariableSqFt } from './variablesqft';
import { VariableSqFtService } from './variablesqft.service';

@Component({
  selector: 'app-variablesqft',
  templateUrl: './variablesqft.component.html',
  styleUrls: ['./variablesqft.component.css']
})

export class VariableSqFtComponent implements OnInit {
  //#region form variable
  public goVSF: GridOptions;
  readonly optionName: string = 'Daily Variable Sq. Ft';
  frmVSF: any;
  readingData: SqFtReading[] = [];
  lstStorerGroup: any;
  lstProfitCenter: any;
  lstStorageType: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = agFormHelper.addDays(-360)
  maxDate = new Date();
  frameworkComponents = {
    agDateEditor: agGridDateEditor
  }
  //#endregion
  
  constructor(private router: Router, private formbulider: FormBuilder, private svcVariableSqFt: VariableSqFtService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService  ) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmVSF = this.formbulider.group({
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],    
      storerGroupId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],
      storageTypeId: [null],
    });    
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = false;
    this.frmVSF.patchValue({ dateFrom: agFormHelper.addDays(-5), dateTo: new Date() });
  }
  //#region toolbar functions

  tbLoad() {
    try {
      this.frmVSF.markAllAsTouched();
      var formData: VariableSqFt = this.frmVSF.getRawValue();
      if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before hitting Load Button. Date From must always be earlier or same as Date To');
        return;
      }
      else if (!formData.storerGroupId || !formData.pcId || !formData.storageTypeId) {
        this.svcToaster.showFailure('Please select valid Storer Group, Profit Center & Storer Type before hitting load button.');
        return;
      }
      else {
        this.svcWaitDlg.open({});
        this.svcVariableSqFt.get(formData.dateFrom, formData.dateTo, formData.storerGroupId,
          formData.pcId, formData.storageTypeId).subscribe(ia => {
            if (ia) {
              this.readingData = ia.details;
              (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true;
              this.frmVSF.controls.dateFrom.disable();
              this.frmVSF.controls.dateTo.disable();
              this.frmVSF.controls.storerGroupId.disable();
              this.frmVSF.controls.pcId.disable();
              this.frmVSF.controls.storageTypeId.disable();
            }
            else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
          },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  tbSave() {
    try {
      this.frmVSF.markAllAsTouched();
      if (!this.frmVSF.invalid) {
        var formData: VariableSqFt = this.frmVSF.getRawValue();
        formData.details = this.getDetailFromGrid();
        this.validate(formData);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcVariableSqFt.save(formData).subscribe(
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
/*    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);*/
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }  
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goVSF = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      onCellClicked: function (event) {
        if (event.colDef.field == "overTime") {
          if (!event.data.selected) {
            event.node.setDataValue('overTime', true);
          }
          else {
            event.node.setDataValue('overTime', false);
          }
        }
      },
      onCellValueChanged: function (params) {
        //if (params.data.vsfId != 0) {
          params.data.edit = true;
        //}
        //else {
//          params.data.add = true;
  //      }
      },
    };
  }

  colVSF = [
    {
      headerName: 'Variable Sqare FT',
      children: [
        {
          headerName: "Storage Date", field: "storageDate", width: 105,
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Sqaure Feet", field: "sqFt", width: 120, type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: 'Apply Over Time ?', field: 'overTime', width: 150, editable: false,
          cellRenderer: params => {
            if (params.value) {
              return "<input type='checkbox' checked />";
            }
            else {
              return "<input type='checkbox'/>";
            }
          },
          cellEditor: agGridHelper.getCellCheckBox()
        }
      ]
    }   
  ];

  getDetailFromGrid() {
    let rowData = [];
    this.goVSF.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  private loadLookup() {
    try {
      this.svcVariableSqFt.getLookup().subscribe(
        data => {
          this.lstStorerGroup = data.lstStorerGroup;
          this.lstProfitCenter = data.lstProfitCenter;
          this.lstStorageType = data.lstStorageType;
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

  private validate(vsf: VariableSqFt) {
    this.errors = [];
    if (vsf.details.length == 0) {
      this.errors.push('Atleast one entry must exist in Transaction to perform save operation');
    }
    if (vsf.details.some(x => x.sqFt < 0)) {
      this.errors.push('The variable Sqaure Feet/Mtr reading cannot be -ve');
    }
    else if (vsf.details.some(x => x.overTime && x.sqFt == 0)) {
      this.errors.push('OverTime must not be selected unless you specify some Sq Feet for charging');
    }   
  }

  private initForm() {
    this.frmVSF.reset();
    this.frmVSF.enable();
    this.errors = [];
    this.footer = new agFooter();
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = false;
    this.readingData = [];
  }
  //#endregion local functions
}



