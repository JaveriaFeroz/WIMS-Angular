"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let GroupInvoiceComponent = class GroupInvoiceComponent {
    //#endregion
    constructor(router, formbulider, svcGroupInvoice, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcGroupInvoice = svcGroupInvoice;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Group Invoice';
        this.colSearch = [
            { headerName: 'Invoice #', field: 'invoiceNo', },
            { headerName: 'Invoice Date', field: 'invoiceDate' },
            { headerName: 'Store Group', field: 'storerGroupName' },
            { headerName: 'Profit Center', field: 'pcName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = agFormHelper_1.agFormHelper.addDays(-30);
        this.maxDate = new Date();
        this.colGroupInvoice = [
            {
                headerName: 'Invoices',
                children: [
                    {
                        headerName: 'S', field: 'selected', width: 70, editable: false, headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
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
                        headerName: "Invoice #", field: "invoiceNo", width: 100
                    },
                    {
                        headerName: "Invoice Date", field: "invoiceDate", width: 100
                    },
                    {
                        headerName: "Invoice Type", field: "workFlowName", width: 140
                    },
                    {
                        headerName: "Invoice Amount", field: "invoiceAmount", width: 120,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "id", field: "invoiceId", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        try {
            this.svcWaitDlg.open({});
            this.loadLookup();
            this.initGrid();
        }
        catch (ex) {
            svcToaster.showFailure(ex.message);
        }
        finally {
            this.svcWaitDlg.close();
        }
    }
    ngOnInit() {
        this.frmGroupInvoice = this.formbulider.group({
            groupInvoiceNo: [null, [forms_1.Validators.required]],
            invoiceDate: [null, [forms_1.Validators.required]],
            storerGroupId: [null, [forms_1.Validators.required]],
            pcId: [null, [forms_1.Validators.required]],
            groupInvoiceId: [null],
        });
        this.frmGroupInvoice.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        document.getElementById("btnLoad").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmGroupInvoice.reset();
        this.frmGroupInvoice.enable();
        this.frmGroupInvoice.controls.groupInvoiceNo.disable();
        this.frmGroupInvoice.patchValue({ invoiceDate: new Date() });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        document.getElementById("btnLoad").disabled = false;
        this.storerGroupId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmGroupInvoice.controls.groupInvoiceNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.groupInvoiceNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcGroupInvoice.getGroupInvoices().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Group Invoice", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.invoiceNo);
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
        this.frmGroupInvoice.enable();
        this.frmGroupInvoice.controls.groupInvoiceNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        document.getElementById("btnLoad").disabled = true;
        this.frmGroupInvoice.controls.storerGroupId.disable();
        this.frmGroupInvoice.controls.whId.disable();
        this.storerGroupId.focus();
    }
    tbLoad() {
        try {
            this.frmGroupInvoice.markAllAsTouched();
            const gi = this.frmGroupInvoice.getRawValue();
            if (!gi.storerGroupId || !gi.pcId) {
                this.svcToaster.showFailure('Please select valid Storer Group and Profit Center before hitting Load button to load relevant invoices for grouping');
                return;
            }
            this.svcWaitDlg.open({});
            this.svcGroupInvoice.load(gi.storerGroupId, gi.pcId).subscribe(data => {
                if (data.length != 0) {
                    this.groupInvoiceData = data;
                    document.getElementById("btnLoad").disabled = true;
                    this.frmGroupInvoice.controls.storerGroupId.disable();
                    this.frmGroupInvoice.controls.pcId.disable();
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        try {
            this.frmGroupInvoice.markAllAsTouched();
            if (!this.frmGroupInvoice.invalid) {
                var formData = this.frmGroupInvoice.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcGroupInvoice.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
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
        this.goGroupInvoice = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true
            },
            onCellClicked: function (event) {
                if (event.colDef.field == "selected") {
                    if (!event.data.selected) {
                        event.node.setDataValue('selected', true);
                    }
                    else {
                        event.node.setDataValue('selected', false);
                    }
                }
            },
        };
    }
    getDetailFromGrid() {
        let rowData = [];
        this.goGroupInvoice.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcGroupInvoice.get(Id).subscribe(gi => {
                if (gi) {
                    this.frmGroupInvoice.disable();
                    this.frmGroupInvoice.controls['groupInvoiceNo'].setValue(gi.groupInvoiceNo);
                    this.frmGroupInvoice.controls['invoiceDate'].setValue((gi.invoiceDate));
                    this.frmGroupInvoice.controls['storerGroupId'].setValue(gi.storerGroupId);
                    this.frmGroupInvoice.controls['pcId'].setValue(gi.pcId);
                    this.groupInvoiceData = gi.details;
                    this.footer = gi.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcGroupInvoice.getLookup().subscribe(data => {
                this.lstStorerGroup = data.lstStorerGroup;
                this.lstProfitCenter = data.lstProfitCenter;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(gi) {
        this.errors = [];
        if (gi.groupInvoiceNo) {
            this.errors.push('No further changes can be made to this Group Invoice at this stage');
        }
        if (gi.details.filter(x => x.selected).length < 2) {
            this.errors.push('Atleast 2 invoices must be selected to create group invoice');
        }
    }
    initForm() {
        this.frmGroupInvoice.reset();
        this.frmGroupInvoice.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.groupInvoiceData = [];
        this.frmGroupInvoice.patchValue({ invoiceDate: new Date() });
        document.getElementById("btnLoad").disabled = true;
    }
};
__decorate([
    core_1.ViewChild('storerGroupId', { static: true })
], GroupInvoiceComponent.prototype, "storerGroupId", void 0);
__decorate([
    core_1.ViewChild('groupInvoiceNo', { static: true })
], GroupInvoiceComponent.prototype, "groupInvoiceNo", void 0);
GroupInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-groupinvoice',
        templateUrl: './groupinvoice.component.html',
        styleUrls: ['./groupinvoice.component.css']
    })
], GroupInvoiceComponent);
exports.GroupInvoiceComponent = GroupInvoiceComponent;
//# sourceMappingURL=groupinvoice.component.js.map