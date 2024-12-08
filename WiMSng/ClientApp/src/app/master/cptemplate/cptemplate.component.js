"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPTemplateComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let CPTemplateComponent = class CPTemplateComponent {
    //#endregion
    constructor(router, formbulider, svcCPTemplate, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCPTemplate = svcCPTemplate;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Cost Provision Template';
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colCPTemplate = [
            {
                headerName: 'Cost Provision Template',
                children: [
                    {
                        headerName: "Cost Head", field: "costHeadId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'CostHead', class: "220" }, valueFormatter: agGridHelper_1.agGridHelper.getCostHead, width: 220
                    },
                    {
                        headerName: "Supplier", field: "supplierId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), editable: true,
                        cellEditorParams: { source: 'Supplier', class: "220" }, valueFormatter: agGridHelper_1.agGridHelper.getSupplier, width: 220
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.onAddLine = function () {
            try {
                var res = this.goCPTemplate.api.applyTransaction({
                    add: [{
                            costHeadId: null, supplierId: null, add: true, edit: false, delete: false
                        }]
                });
                this.goCPTemplate.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "costHeadId" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Line: ');
            }
        };
        this.onDeleteLine = function () {
            try {
                if (this.goDocs.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.goDocs.api.getSelectedRows().forEach(x => x.delete = true);
                        agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goCPTemplate.api);
                    }
                }
                else
                    this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
            }
            catch (exception) {
                this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
            }
        };
        sessionStorage.removeItem("lstSupplier");
        sessionStorage.removeItem("lstCostHead");
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmCPtemplate = this.formbulider.group({
            //whId: [null, [Validators.required]],
            pcId: [null, [forms_1.Validators.required]],
        });
        this.frmCPtemplate.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    //tbAdd() {
    //  this.frmCPtemplate.reset();
    //  this.frmCPtemplate.enable();
    //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    //  agFormHelper.setGridToolbar(true);
    //  agFormHelper.setGridStatus(true);
    //}
    tbRecall() {
        this.initForm();
        //this.frmCPtemplate.controls.whId.enable();
        this.frmCPtemplate.controls.pcId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.pcId.focus({});
    }
    tbEdit() {
        this.frmCPtemplate.enable();
        //this.frmCPtemplate.controls.whId.disable();
        this.frmCPtemplate.controls.pcId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmCPtemplate.markAllAsTouched();
            if (!this.frmCPtemplate.invalid) {
                var formData = this.frmCPtemplate.getRawValue();
                formData.details = this.getGFDataFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcCPTemplate.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstSupplier");
        sessionStorage.removeItem("lstCostHead");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goCPTemplate = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "costHeadId") {
                    if (params.data.costHeadId != "") {
                        params.node.setDataValue("costHeadId", parseInt(params.data.costHeadId));
                    }
                    else {
                        params.node.setDataValue("costHeadId", null);
                    }
                }
                if (params.colDef.field == "supplierId") {
                    if (params.data.supplierId != "") {
                        params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
                    }
                    else {
                        params.node.setDataValue("supplierId", null);
                    }
                }
            },
        };
    }
    getGFDataFromGrid() {
        let rowData = [];
        this.goCPTemplate.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(pcId) {
        const cpt = this.frmCPtemplate.getRawValue();
        //let whId = cpt.whId;
        //let pcId = cpt.pcId;
        //if (whId && pcId) {
        if (pcId)
            this.svcWaitDlg.open({});
        try {
            this.svcCPTemplate.get(pcId).subscribe(cptemplate => {
                if (cptemplate) {
                    this.frmCPtemplate.disable();
                    //this.frmCPtemplate.controls['whId'].setValue(whId);
                    this.frmCPtemplate.controls['pcId'].setValue(pcId);
                    this.cpTemplateData = cptemplate.details;
                    this.footer = cptemplate.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
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
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcCPTemplate.getLookup().subscribe(data => {
                //this.lstWarehouse = data.lstWarehouse;
                this.lstProfitCenter = data.lstProfitCenter;
                sessionStorage.setItem("lstCostHead", JSON.stringify(data.lstCostHead));
                sessionStorage.setItem("lstSupplier", JSON.stringify(data.lstSupplier));
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //onKeyChange() {
    //  this.get();
    //}
    validate(cp) {
        this.errors = [];
        if (Object.keys(cp.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one entry must exist in CPTemplate Transaction to perform save operation');
        }
        if (cp.details.some(x => !x.delete && !x.costHeadId)) {
            this.errors.push('No row can contain empty Cost Head');
        }
        if (cp.details.some(x => !x.delete && !x.supplierId)) {
            this.errors.push('No row can contain empty Supplier');
        }
        if (cp.details.filter(x => !x.delete).length > 0) {
            var detDuplicate = cp.details.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, costHeadId: item.costHeadId })).slice().sort();
            for (var i = 0; i < detDuplicate.length - 1; i++) {
                if (detDuplicate[i + 1]['supplierId'] === detDuplicate[i]['supplierId']) {
                    if (detDuplicate[i + 1]['costHeadId'] === detDuplicate[i]['costHeadId']) {
                        this.errors.push('The combination of Cost Head & Supplier must be unique!');
                        i = detDuplicate.length;
                    }
                }
            }
        }
    }
    initForm() {
        this.frmCPtemplate.reset();
        this.frmCPtemplate.disable();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.errors = [];
        this.cpTemplateData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('pcId', { static: true })
], CPTemplateComponent.prototype, "pcId", void 0);
CPTemplateComponent = __decorate([
    core_1.Component({
        selector: 'app-mecptemplate',
        templateUrl: './cptemplate.component.html',
        styleUrls: ['./cptemplate.component.css']
    })
], CPTemplateComponent);
exports.CPTemplateComponent = CPTemplateComponent;
//# sourceMappingURL=cptemplate.component.js.map