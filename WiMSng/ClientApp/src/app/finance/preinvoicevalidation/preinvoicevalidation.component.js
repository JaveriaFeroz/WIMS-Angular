"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreInvoiceValidationComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
let PreInvoiceValidationComponent = class PreInvoiceValidationComponent {
    //Date: any;
    //#endregion
    constructor(router, formbulider, svcPIValidation, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcPIValidation = svcPIValidation;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Pre Invoice Validation';
        this.errors = [];
        //extractISData: any[];
        this.minDate = agFormHelper_1.agFormHelper.addDays(-60);
        this.maxDate = new Date();
        this.colPIValidation = [
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
        //sessionStorage.removeItem("lstProfitCenter");
        try {
            this.svcWaitDlg.open({});
            this.loadLookup();
            this.initGrid();
            this.svcWaitDlg.close();
        }
        catch (ex) {
            this.svcWaitDlg.close();
        }
        //this.MaxDate.setDate(this.MaxDate.getDate());
        //var dt = new Date();
        //this.Date = dt.setDate(dt.getDate() - 35);
    }
    ngOnInit() {
        this.frmPIValidation = this.formbulider.group({
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]],
            storerGroupId: [null, [forms_1.Validators.required]],
            //whId: [null, [Validators.required]],
            pcId: [null, [forms_1.Validators.required]]
        });
        this.frmPIValidation.patchValue({ dateFrom: new Date(), dateTo: new Date() });
        //this.frmPIValidation.controls.whId.disable();
        //this.frmPIValidation.controls.pcId.disable();
    }
    //#region toolbar functions
    btnLoad(sgId, pcId) {
        try {
            this.frmPIValidation.markAllAsTouched();
            const frmPIValidation = this.frmPIValidation.getRawValue();
            var diffDays = Math.floor((frmPIValidation.DateTo - frmPIValidation.DateFrom) / (1000 * 60 * 60 * 24));
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
                this.svcPIValidation.get(sgId, pcId, frmPIValidation.dateFrom, frmPIValidation.dateTo).subscribe(piv => {
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
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
            this.svcWaitDlg.close();
        }
    }
    tbExport() {
        try {
            var data = this.getDetailFromGrid();
            if (data.length > 0) {
                agFormHelper_1.agFormHelper.ExporttoExcel(data, 'InvoiceValidation.xlsx');
            }
            else {
                this.svcToaster.showWarning('No record exist in the list to export!');
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
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
        this.goPIValidation = {
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
    getDetailFromGrid() {
        let rowData = [];
        this.goPIValidation.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    loadLookup() {
        try {
            this.svcPIValidation.getLookup().subscribe(data => {
                this.lstStorerGroup = data.lstStorerGroup;
                this.lstProfitCenter = data.lstProfitCenter;
                //this.lstWarehouse = data.lstWarehouse;
                //sessionStorage.setItem("lstProfitCenter", JSON.stringify(data.lstProfitCenter));
            }, error => {
                this.svcToaster.showFailure(error);
            });
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
    initForm() {
        this.frmPIValidation.reset();
        this.errors = [];
        //this.frmPIValidation.controls.whId.disable();
        //this.frmPIValidation.controls.pcId.disable();
        this.piData = [];
        this.frmPIValidation.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    }
};
PreInvoiceValidationComponent = __decorate([
    core_1.Component({
        selector: 'app-preinvoicevalidation',
        templateUrl: './preinvoicevalidation.component.html',
        styleUrls: ['./preinvoicevalidation.component.css']
    })
], PreInvoiceValidationComponent);
exports.PreInvoiceValidationComponent = PreInvoiceValidationComponent;
//# sourceMappingURL=preinvoicevalidation.component.js.map