"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostProvisionComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agEnum_1 = require("../../helper/agEnum");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let CostProvisionComponent = class CostProvisionComponent {
    //#endregion
    constructor(route, router, formbulider, svcCostProvision, svcToaster, svcWaitDlg, svcSearchDlg, svcHistoryDlg, svcRecipient, svcFormSubmission, svcAuth) {
        this.route = route;
        this.router = router;
        this.formbulider = formbulider;
        this.svcCostProvision = svcCostProvision;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcRecipient = svcRecipient;
        this.svcFormSubmission = svcFormSubmission;
        this.svcAuth = svcAuth;
        this.optionName = 'Cost Provisions';
        this.colSearch = [
            { headerName: 'Provision #', field: 'provisionId', width: 70 },
            { headerName: 'Warehouse', field: 'whName' },
            { headerName: 'Profit Center', field: 'pcName' },
            { headerName: 'Period', field: 'periodName' },
            { headerName: 'Owner', field: 'owner' },
        ];
        this.cpData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.submissionButtonsStatus = "";
        this.config = { childList: true, subtree: true, attributes: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && (!document.getElementById('btnEdit').disabled || !document.getElementById('btnExit').disabled)) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        this.colCP = [
            {
                headerName: "Expense", field: "costHeadId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'CostHead', class: "250" }, valueFormatter: agGridHelper_1.agGridHelper.getCostHeadName, width: 250
            },
            {
                headerName: "Supplier", field: "supplierId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'Supplier', class: "200" }, valueFormatter: agGridHelper_1.agGridHelper.getSupplier, width: 200
            },
            {
                headerName: "Period", field: "periodId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'Period', class: "100" }, valueFormatter: agGridHelper_1.agGridHelper.getPeriod, width: 100
            },
            {
                headerName: "AmtExTax", field: "grossAmount", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80
            },
            {
                headerName: "Tax Amt", field: "taxAmount", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80
            },
            {
                headerName: "Net Amt", field: "netAmount", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, editable: false
            },
            {
                headerName: "Desc", field: "description", width: 250, cellEditor: "agLargeTextCellEditor"
            },
            { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
            { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
            { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ];
        this.loginUser = svcAuth.getUserId();
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmCP = this.formbulider.group({
            provisionId: [null, [forms_1.Validators.required]],
            pcId: [null, [forms_1.Validators.required]],
            periodName: [null],
            periodId: [null],
            stateName: [null],
            stateId: [null],
            owner: [null],
            completed: [null]
        });
        this.frmCP.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        if (_formid > 0) {
            this.get(_formid);
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    ngAfterViewInit() {
        this.disableSave();
        this.targetNode = document.getElementById('divSave');
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmCP.reset();
        this.frmCP.enable();
        this.frmCP.controls.provisionId.disable();
        this.frmCP.patchValue({
            stateId: 0, stateName: "New", completed: false, periodId: this.svcAuth.getPeriodId,
            periodName: this.svcAuth.getPeriodName(), owner: this.svcAuth.getUserId(),
        });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.footer.createdBy = this.svcAuth.getUserId();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.pcId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmCP.controls.provisionId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.provisionId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcCostProvision.getCostProvisions().subscribe(r => {
                this.svcSearchDlg.open("Search & Select  Cost Provision", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.provisionId);
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
        this.frmCP.enable();
        this.frmCP.controls.provisionId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        const cp = this.frmCP.getRawValue();
        if (cp.StateId > 1) {
            this.frmCP.controls.pcId.disable();
            agFormHelper_1.agFormHelper.setGridToolbar(false);
            agFormHelper_1.agFormHelper.setGridStatus(false);
        }
        else {
            agFormHelper_1.agFormHelper.setGridToolbar(true);
            agFormHelper_1.agFormHelper.setGridStatus(true);
        }
        this.pcId.focus();
    }
    tbLoad() {
        try {
            this.frmCP.markAllAsTouched();
            if (this.frmCP.controls.pcId.value) {
                this.svcWaitDlg.open({});
                this.svcCostProvision.load(this.frmCP.controls.pcId.value).subscribe(cp => {
                    if (cp.length != 0) {
                        this.cpData = cp;
                        this.frmCP.controls.pcId.disable();
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        try {
            this.frmCP.markAllAsTouched();
            if (!this.frmCP.invalid) {
                var formData = this.frmCP.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcCostProvision.save(formData).subscribe(data => {
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                        this.svcWaitDlg.close();
                        this.svcToaster.showSuccess(' Cost Provision # ' + data.provisionId +
                            ' saved successfully. Please click submit button to proceed further!');
                        this.get(data.provisionId);
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
        sessionStorage.removeItem("lstPeriod");
        this.router.navigate(['/MainForm']);
    }
    tbHistory(formId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(agEnum_1.agEnum.WorkFlow.CostProvision, formId).subscribe(r => {
                this.svcHistoryDlg.open("Activity History for Cost Provision # " + formId, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
    //#region form submission
    tbFormSubmission(formId, stateId) {
        this.svcWaitDlg.open({});
        let recipients, nextStateId, sub = new submission_1.Submission();
        return new Promise((resolve, reject) => {
            try {
                if (stateId == 2 || stateId == 5) {
                    recipients = this.svcRecipient.getCPRecipients(formId, stateId);
                }
                else if (stateId == 3 || stateId == 4 || stateId == 99) {
                    recipients = this.svcRecipient.getCreator(agEnum_1.agEnum.WorkFlow.CostProvision, formId);
                }
                rxjs_1.forkJoin([recipients]).subscribe(results => {
                    recipients = results[0]["recipient"];
                    if (stateId == 4 || stateId == 99) {
                        nextStateId = stateId;
                    }
                    else {
                        nextStateId = results[0]["nextStateId"];
                    }
                    if (recipients === undefined || recipients.length == 0) {
                        this.svcToaster.showWarning("No Recipient(s) are configured for current state of this Form. " +
                            "Submission process can not continue while Recipient are missing.");
                        this.svcWaitDlg.close();
                        return;
                    }
                    else {
                        this.svcFormSubmission.open("Cost Provision # " + this.frmCP.controls.provisionId.value, agEnum_1.agEnum.getCPState(nextStateId), recipients);
                        this.svcFormSubmission.selected().subscribe(r => {
                            if (r) {
                                if (r.recipientId !== undefined) {
                                    sub.formId = formId;
                                    sub.comments = r.submissionComments;
                                    sub.owner = r.recipientId;
                                    sub.stateId = nextStateId;
                                    this.submit(sub);
                                }
                                else {
                                    this.svcToaster.showWarning("No recipient selected. Please select valid recipient to proceed with onward submission.");
                                    return;
                                }
                            }
                        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); this.svcFormSubmission.close(); });
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                resolve(true);
            }
            catch (e) {
                this.svcToaster.showFailure(e);
                this.svcWaitDlg.close();
                reject(e);
            }
        });
    }
    submit(sub) {
        if (sub.stateId == 3) {
            sub.approved = true;
            sub.completed = true;
        }
        else if (sub.stateId == 4 || sub.stateId == 99) {
            sub.rejected = true;
            sub.approved = false;
            sub.completed = true;
        }
        else {
            sub.completed = false;
        }
        this.svcCostProvision.submit(sub).subscribe(() => {
            this.svcToaster.showSuccess('Cost Provision # ' + sub.formId +
                ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
            this.initForm();
            this.router.navigate(['/MainForm']);
        }, error => { this.svcToaster.showFailure(error); }, () => { });
    }
    //#endregion FormSubmission
    //#region grid setup
    initGrid() {
        this.goCP = {
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
            onRowDataChanged: () => { this.setFooter(); }
        };
    }
    onAddLine() {
        try {
            var res = this.goCP.api.applyTransaction({
                add: [{
                        costHeadId: null, supplierId: null, periodId: null, grossAmount: 0, taxAmount: 0, netAmount: 0, description: null,
                        add: true, edit: false, delete: false
                    }]
            });
            this.goCP.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "costHeadId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goCP.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goCP.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goCP.api);
                    this.setFooter();
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    onCellValueChanged(params) {
        const field = params.colDef.field;
        if (!params.data.add)
            params.data.edit = true;
        if (field == "costHeadId") {
            if (params.data.costHeadId != "") {
                params.node.setDataValue("costHeadId", parseInt(params.data.costHeadId));
            }
            else {
                params.node.setDataValue("costHeadId", null);
            }
        }
        else if (field == "supplierId") {
            if (params.data.supplierId != "") {
                params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
            }
            else {
                params.node.setDataValue("supplierId", null);
            }
        }
        else if (field == "periodId") {
            if (params.data.periodId != "") {
                params.node.setDataValue("periodId", parseInt(params.data.periodId));
            }
            else {
                params.node.setDataValue("periodId", null);
            }
        }
        else if (field === "grossAmount" || field === "taxAmount") {
            const rowNode = this.goCP.api.getDisplayedRowAtIndex(params.rowIndex);
            rowNode.setDataValue('netAmount', params.data.grossAmount + params.data.taxAmount);
            this.setFooter();
        }
    }
    setFooter() {
        try {
            let _grossAmount = 0, _taxAmount = 0, _netAmount = 0;
            this.goCP.api.forEachNode(function (rowNode, index) {
                if (!rowNode.data.delete && rowNode.data.costHeadId != undefined) {
                    _grossAmount += rowNode.data.grossAmount,
                        _taxAmount += rowNode.data.taxAmount, _netAmount += rowNode.data.netAmount;
                }
            });
            this.goCP.api.setPinnedBottomRowData([{
                    costHeadId: null, supplierId: null, periodId: null,
                    grossAmount: _grossAmount, taxAmount: _taxAmount, netAmount: _netAmount
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    getDetailFromGrid() {
        let rowData = [];
        this.goCP.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcCostProvision.get(Id).subscribe(cp => {
                if (cp) {
                    this.frmCP.disable();
                    this.frmCP.controls['provisionId'].setValue(cp.provisionId);
                    this.frmCP.controls['pcId'].setValue(cp.pcId);
                    this.frmCP.controls['periodId'].setValue(cp.periodId);
                    this.frmCP.controls['periodName'].setValue(cp.periodName);
                    this.frmCP.controls['stateId'].setValue(cp.stateId);
                    this.frmCP.controls['completed'].setValue(cp.completed);
                    cp.stateName = agEnum_1.agEnum.getCPState(cp.stateId);
                    this.frmCP.controls['stateName'].setValue(cp.stateName);
                    this.frmCP.controls['owner'].setValue(cp.owner);
                    this.cpData = cp.details;
                    this.goCP.api.setRowData(cp.details);
                    this.footer = cp.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcCostProvision.getLookup().subscribe(data => {
                this.lstProfitCenter = data.lstProfitCenter;
                sessionStorage.setItem("lstCostHead", JSON.stringify(data.lstCostHead));
                sessionStorage.setItem("lstSupplier", JSON.stringify(data.lstSupplier));
                sessionStorage.setItem("lstPeriod", JSON.stringify(data.lstPeriod));
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(cp) {
        this.errors = [];
        if (cp.completed || cp.stateId > 1 || cp.owner != cp.footer.createdBy || cp.owner != this.svcAuth.getUserId()) {
            this.errors.push('No further changes can be made to Cost Provision at this stage!');
        }
        else {
            if (cp.details.filter(x => !x.delete).length == 0) {
                this.errors.push('Atleast one row must exist in Grid to perform save operation');
            }
            else if (cp.details.some(x => !x.delete && !x.costHeadId || !x.supplierId || !x.periodId)) {
                this.errors.push('No row in Cost Provision Transaction can have empty Cost Head, Supplier or Period');
            }
            else if (cp.details.some(x => !x.delete && x.grossAmount <= 0)) {
                this.errors.push('The Amount Excl Tax in each row must be greater than zero');
            }
            else if (cp.details.some(x => !x.delete && x.taxAmount < 0)) {
                this.errors.push('The Tax Amount in each row must be zero or +ve');
            }
            if (cp.details.filter(x => !x.delete).length > 0) {
                var detDuplicate = cp.details.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, costId: item.costHeadId, periodId: item.periodId })).slice().sort();
                for (var i = 0; i < detDuplicate.length - 1; i++) {
                    if (detDuplicate[i + 1]['supplierId'] === detDuplicate[i]['supplierId']) {
                        if (detDuplicate[i + 1]['costId'] === detDuplicate[i]['costId']) {
                            if (detDuplicate[i + 1]['periodId'] === detDuplicate[i]['periodId']) {
                                this.errors.push('The combination of Supplier, Cost Head and Period must be unique!');
                                i = detDuplicate.length;
                            }
                        }
                    }
                }
            }
        }
    }
    setActionBarVisibility(formMode) {
        this.submissionButtonsStatus = (formMode != agFormHelper_1.agFormMode.ReadOnly && formMode != agFormHelper_1.agFormMode.Review) ? "disabled" : "";
    }
    disableSave() {
        if (document.getElementById("btnSave"))
            document.getElementById("btnSave").disabled = true;
    }
    initForm() {
        this.frmCP.reset();
        this.frmCP.disable();
        this.footer = new footer_1.agFooter();
        this.errors = [];
        this.cpData = [];
        this.setFooter();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
    }
};
__decorate([
    core_1.ViewChild('provisionId', { static: true })
], CostProvisionComponent.prototype, "provisionId", void 0);
__decorate([
    core_1.ViewChild('pcId', { static: true })
], CostProvisionComponent.prototype, "pcId", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], CostProvisionComponent.prototype, "btnEdit", void 0);
CostProvisionComponent = __decorate([
    core_1.Component({
        selector: 'app-costprovision',
        templateUrl: './costprovision.component.html',
        styleUrls: ['./costprovision.component.css']
    })
], CostProvisionComponent);
exports.CostProvisionComponent = CostProvisionComponent;
//# sourceMappingURL=costprovision.component.js.map