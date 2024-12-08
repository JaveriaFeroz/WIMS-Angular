"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateSheetComponent = void 0;
const core_1 = require("@angular/core");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let RateSheetComponent = class RateSheetComponent {
    //#endregion
    constructor(router, formbulider, svcRateSheet, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRateSheet = svcRateSheet;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region form variables
        this.optionName = 'Rate Sheet';
        this.colSearch = [
            { headerName: 'Rate Sheet #', field: 'rateSheetId' },
            { headerName: 'Storer Group', field: 'storerGroupName' },
            { headerName: 'Profit Center', field: 'pcName' },
            { headerName: 'Active?', field: 'isActive' },
        ];
        this.selectedStorageNodeId = -1;
        this.selectedHandlingNodeId = -1;
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.containerHidden = true;
        this.skuHidden = true;
        this.colStorage = [
            {
                headerName: 'Storage Rate',
                children: [
                    {
                        headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Type", field: "stName", width: 150
                    },
                    {
                        headerName: "Unit", field: "suName", width: 90
                    },
                    {
                        headerName: "Period", field: "periodTypeName", width: 60
                    },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Overtime", field: "otRate", type: "numericColumn", width: 75, headerTooltip: "Over Time Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Fix Sq Ft", field: "fixedSqFt", type: "numericColumn", width: 70,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Min Vol.", field: "minVolume", type: "numericColumn", width: 70,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Min Amt.", field: "minAmount", type: "numericColumn", width: 75,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: 'Print?', field: 'isVisible', width: 55, editable: false, headerTooltip: "Print Fixed Sq Ft for this row on Invoice?",
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: 'Step Chgs', field: 'stepCharges', width: 65, editable: false, headerTooltip: "Setp Charges Applicable?",
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                ]
            }
        ];
        this.colStorageLoc = [
            {
                headerName: 'Storage Location',
                children: [
                    { headerName: "Location Category", field: "lcName", width: 200 },
                    {
                        headerName: 'UPP', field: 'upp', width: 50, editable: false, headerTooltip: "Calculate Pallets through Packkey for this Location Category?",
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                ]
            }
        ];
        this.colHandling = [
            {
                headerName: 'Handling Rate',
                children: [
                    {
                        headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry date for this Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    { headerName: "Type", field: "htName", width: 100 },
                    { headerName: "Unit", field: "huName", width: 110 },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Sunday", field: "sundayRate", type: "numericColumn", headerTooltip: "Sunday Handling Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 65,
                    },
                    {
                        headerName: "Holiday", field: "holidayRate", type: "numericColumn", headerTooltip: "Gazetted Holiday Handling Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 75,
                    },
                    {
                        headerName: "Min Vol", field: "minVolume", type: "numericColumn", headerTooltip: "Minimum chargeable units for this activity",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 70,
                    },
                    {
                        headerName: "Min Amt", field: "minAmount", type: "numericColumn", headerTooltip: "Minimum chargeable amount for the activity",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 75,
                    },
                    { headerName: "L.Unit", field: "looseUnitName", width: 80 },
                    {
                        headerName: "L.Rate", field: "looseRate", type: "numericColumn", headerTooltip: "Rate per unit for loose unit handling",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80,
                    },
                    {
                        headerName: 'Uq.Plt', field: 'uniquePalletCount', width: 80, editable: false, headerTooltip: "Count only unique pallet numbers",
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                ]
            }
        ];
        this.colHandlingContainer = [
            {
                headerName: 'Container Capacity-wise Rate',
                children: [
                    { headerName: "Container Capacity", field: "containerTypeName", width: 180 },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80,
                    },
                ]
            }
        ];
        this.colHandlingSKU = [
            {
                headerName: 'SKU Minimum Unit(s)',
                children: [
                    { headerName: "SKU", field: "skuCode", width: 180 },
                    {
                        headerName: "Min Unit", field: "minUnit", type: "numericColumn", width: 70,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                ]
            }
        ];
        this.colFixed = [
            {
                headerName: 'Fixed Accessorial Charges',
                children: [
                    {
                        headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date for this Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Charge", field: "chargeName", width: 220
                    },
                    {
                        headerName: "Qty", field: "qty", type: "numericColumn", width: 100,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Rate/Unit", field: "rate", type: "numericColumn", width: 100,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                ]
            }
        ];
        this.colVariable = [
            {
                headerName: 'Variable Accessorial Charges',
                children: [
                    {
                        headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date for this Rate",
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    { headerName: "Charge", field: "chargeName", width: 220 },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", width: 100, headerTooltip: "Rate / Unit (Quantity)",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                ]
            }
        ];
        this.colRemarks = [
            {
                headerName: 'Project & Remarks Default',
                children: [
                    { headerName: "Invoice Type", field: "workFlowName", width: 150 },
                    { headerName: "Title", field: "projectTitle", width: 250, cellEditor: "agLargeTextCellEditor" },
                    { headerName: "Project Name", field: "projectName", width: 250, cellEditor: "agLargeTextCellEditor" },
                    { headerName: "Remarks", field: "remarks", width: 250, cellEditor: "agLargeTextCellEditor" },
                    {
                        headerName: "GST %", field: "gstRate", type: "numericColumn", width: 60,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                ]
            }
        ];
        this.colExemptLoc = [
            {
                headerName: 'Exempted Location Categories',
                children: [
                    { headerName: "Location Category", field: "lcName", width: 225 },
                ]
            }
        ];
        this.initGrid();
    }
    ngOnInit() {
        this.frmRateSheet = this.formbulider.group({
            rateSheetId: [null],
            storerGroupName: [null],
            pcName: [null],
            kamName: [null],
            calendarName: [null],
            minInvAmount: [null],
            expiryDate: [null],
            isActive: [null],
        });
        this.frmRateSheet.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.frmRateSheet.controls.rateSheetId.enable();
        this.ratesheetId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcRateSheet.getRateSheets().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Rate Sheet", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.rateSheetId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmRateSheet.enable();
        this.frmRateSheet.controls.rateSheetId.disable();
        this.frmRateSheet.controls.isActive.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goStorage = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'blue' };
                }
            },
            onCellEditingStarted: function (event) {
                if (event.rowPinned)
                    event.api.stopEditing();
            },
        };
        this.goStorageLoc = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
        };
        this.goHandling = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'blue' };
                }
            },
            onCellEditingStarted: function (event) {
                if (event.rowPinned)
                    event.api.stopEditing();
            },
        };
        this.goHandlingContainer = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
        };
        this.goHandlingSKU = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
        };
        this.goRemarks = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
        };
        this.goFixed = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
        };
        this.goVariable = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
        };
        this.goExemptLoc = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                sortable: true,
                filter: true,
                resizable: true
            },
            rowSelection: 'single',
        };
    }
    validateGridStatus() {
        var rd = (document.querySelector('[id="btnRecall"]')['disabled'] == true &&
            document.querySelector('[id="btnEdit"]')['disabled'] == true &&
            document.querySelector('[id="btnUndo"]')['disabled'] == false);
        agFormHelper_1.agFormHelper.setGridStatus(rd);
    }
    //#endregion
    //#region local functions
    get(id) {
        this.svcWaitDlg.open({});
        try {
            this.svcRateSheet.get(id).subscribe(rs => {
                if (rs) {
                    this.frmRateSheet.disable();
                    this.frmRateSheet.controls['rateSheetId'].setValue(rs.rateSheetId);
                    this.frmRateSheet.controls['storerGroupName'].setValue(rs.storerGroupName);
                    this.frmRateSheet.controls['pcName'].setValue(rs.pcName);
                    this.frmRateSheet.controls['kamName'].setValue(rs.kamName);
                    this.frmRateSheet.controls['expiryDate'].setValue((rs.expiryDate));
                    this.frmRateSheet.controls['calendarName'].setValue(rs.calendarName);
                    this.frmRateSheet.controls['minInvAmount'].setValue(rs.minInvAmount);
                    this.frmRateSheet.controls['isActive'].setValue(rs.isActive);
                    this.storageData = rs.storage;
                    this.handlingData = rs.handling;
                    this.remarksData = rs.projectRemarks;
                    this.exemptLocData = rs.exemptedSL;
                    this.fixedData = rs.fixedAccessorial;
                    this.variableData = rs.variableAccessorial;
                    this.footer = rs.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    showLCInfo(row) {
        this.storageLocData = this.goStorage.api.getRowNode(row.node.id).data.locationCategory;
    }
    showContainerInfo(row) {
        this.handlingContainerData = this.goHandling.api.getRowNode(row.node.id).data.containerRate;
    }
    showSKUInfo(row) {
        this.handlingSKUData = this.goHandling.api.getRowNode(row.node.id).data.skUs;
    }
    onHandlingRowSelected(event) {
        if (event.node.selected) {
            if (event.node.data.huName === "Container Type") {
                this.showContainerInfo(event);
                this.containerHidden = false;
                this.skuHidden = true;
            }
            else if (event.node.data.huName === "SKU (Pallet)") {
                this.showSKUInfo(event);
                this.containerHidden = true;
                this.skuHidden = false;
            }
            else {
                this.containerHidden = true;
                this.skuHidden = true;
            }
        }
    }
    onStorageRowSelected(event) {
        if (event.node.selected) {
            this.showLCInfo(event);
        }
    }
    initForm() {
        this.frmRateSheet.reset();
        this.frmRateSheet.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.selectedStorageNodeId = -1;
        this.selectedHandlingNodeId = -1;
        this.storageData = [];
        this.storageLocData = [];
        this.exemptLocData = [];
        this.handlingData = [];
        this.handlingContainerData = [];
        this.handlingSKUData = [];
        this.fixedData = [];
        this.variableData = [];
        this.remarksData = [];
        this.containerHidden = true;
        this.skuHidden = true;
    }
};
__decorate([
    core_1.ViewChild('ratesheetId', { static: true })
], RateSheetComponent.prototype, "ratesheetId", void 0);
RateSheetComponent = __decorate([
    core_1.Component({
        selector: 'app-ratesheet',
        templateUrl: './ratesheet.component.html',
        styleUrls: ['./ratesheet.component.css']
    })
], RateSheetComponent);
exports.RateSheetComponent = RateSheetComponent;
//# sourceMappingURL=ratesheet.component.js.map