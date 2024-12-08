import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper } from '../../helper/agFormHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { PreInvoiceValidationService } from './preinvoicevalidation.service';

@Component({
  selector: 'app-preinvoicevalidation',
  templateUrl: './preinvoicevalidation.component.html',
  styleUrls: ['./preinvoicevalidation.component.css']
})

export class PreInvoiceValidationComponent implements OnInit {
  //#region form level variables
  public goPIValidation: GridOptions;
  readonly optionName: string = 'Pre Invoice Validation';
  frmPIValidation: any;
  errors: string[] = [];
  piData: any[];
  //extractISData: any[];
  minDate = agFormHelper.addDays(-60);
  maxDate = new Date();
  lstStorerGroup: any;
  //lstWarehouse: any;
  lstProfitCenter: any;
  //Date: any;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcPIValidation: PreInvoiceValidationService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    //sessionStorage.removeItem("lstProfitCenter");
    try {
      this.svcWaitDlg.open({});
      this.loadLookup();
      this.initGrid();
      this.svcWaitDlg.close();
    }
    catch (ex) { this.svcWaitDlg.close(); }
    //this.MaxDate.setDate(this.MaxDate.getDate());
    //var dt = new Date();
    //this.Date = dt.setDate(dt.getDate() - 35);
  }

  ngOnInit(): void {
    this.frmPIValidation = this.formbulider.group({    
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      storerGroupId: [null, [Validators.required]],
      //whId: [null, [Validators.required]],
      pcId: [null, [Validators.required]]
    });
    this.frmPIValidation.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    //this.frmPIValidation.controls.whId.disable();
    //this.frmPIValidation.controls.pcId.disable();
  }

  //#region toolbar functions
  btnLoad(sgId: number, pcId: number) {
    try {
      this.frmPIValidation.markAllAsTouched();
      const frmPIValidation = this.frmPIValidation.getRawValue();
      var diffDays: any = Math.floor((frmPIValidation.DateTo - frmPIValidation.DateFrom) / (1000 * 60 * 60 * 24));
      if (diffDays > 35) {
        this.svcToaster.showFailure('Date Range for validarion should not exceed 35 days');
        return;
      }
      if (frmPIValidation.dateFrom > frmPIValidation.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting validation request. Date From must always be older than or equal to Date To');
        return;
      }
      if (!frmPIValidation.storerGroupId || !frmPIValidation.pcId) {
        this.svcToaster.showFailure('Please select valid Storer Group & Profit Center before submitting validation request.');
        return;
      }
      else {
        this.svcWaitDlg.open({});
        this.svcPIValidation.get(sgId, pcId, frmPIValidation.dateFrom, frmPIValidation.dateTo).subscribe(
          piv => {
            if (piv) {
              if (piv.length == 0) {
                this.svcToaster.showSuccess('Data for given parameters validated successfully. The data is fit for invoice generation, you may please proceed with invoice generation process, if intended', "Data Validated Successfully!");
                this.piData = [];
                this.goPIValidation.api.setRowData([]);
              }
              else {
                this.piData = piv;
              }
            }
            else {
              this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
            }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcToaster.showFailure(e); this.svcWaitDlg.close(); }
  }

  tbExport() {
    try {
      var data: any[] = this.getDetailFromGrid();
      if (data.length > 0) {
        agFormHelper.ExporttoExcel(data, 'InvoiceValidation.xlsx');
      }
      else {
        this.svcToaster.showWarning('No record exist in the list to export!');
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
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
    this.goPIValidation = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        sortable: true,
        resizable: true,
      },
    };
  }
  
  colPIValidation = [
    {
      headerName: 'Validation Summary',
      children: [
        { headerName: "StorerKey", field: "storerKey", editable: false, width: 100 },
        { headerName: "Warehouse", field: "whName", editable: false, width: 100 },
        { headerName: "SKU", field: "sku", editable: false, width: 140 },
        { headerName: "Event Type", field: "eventType", editable: false, width: 100 },
        { headerName: "Error Text", field: "errorText", editable: false, width: 600 }
      ]
    }    
  ];

  getDetailFromGrid() {
    let rowData = [];
    this.goPIValidation.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
 private loadLookup() {
    try {
      this.svcPIValidation.getLookup().subscribe(
        data => {
          this.lstStorerGroup = data.lstStorerGroup;
          this.lstProfitCenter = data.lstProfitCenter;
          //this.lstWarehouse = data.lstWarehouse;
          //sessionStorage.setItem("lstProfitCenter", JSON.stringify(data.lstProfitCenter));
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

  //onStorerChange(sgid: number) {
  //  if (sgid != null) {
  //    this.frmPIValidation.controls.whId.enable();
  //  }
  //}

  //onWarehouseChange(whId:number) {
  //  if (whId != null) {
  //    var lstProfitCenter = JSON.parse(sessionStorage.getItem("lstProfitCenter"));
  //    this.lstProfitCenter = lstProfitCenter.filter(x => x.whId === whId);
  //    this.frmPIValidation.controls.pcCode.enable();
  //  }
  //}

  private initForm() {
    this.frmPIValidation.reset();
    this.errors = [];
    //this.frmPIValidation.controls.whId.disable();
    //this.frmPIValidation.controls.pcId.disable();
    this.piData = [];
    this.frmPIValidation.patchValue({ dateFrom: new Date(), dateTo: new Date() });
  }
  //#endregion local functions
}
