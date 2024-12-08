"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agEnum_1 = require("../../helper/agEnum");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let AccInvoiceComponent = class AccInvoiceComponent {
    //#endregion
    constructor(router, formbulider, svcAccInvoice, svcToaster, svcWaitDlg, svcSearchDlg, route, svcRecipient, svcAuth, svcFormSubmission, svcHistoryDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAccInvoice = svcAccInvoice;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.route = route;
        this.svcRecipient = svcRecipient;
        this.svcAuth = svcAuth;
        this.svcFormSubmission = svcFormSubmission;
        this.svcHistoryDlg = svcHistoryDlg;
        //#region form variables
        this.optionName = this.route.snapshot.data.title;
        this.workFlowId = this.route.snapshot.data.workFlowId;
        this.myForm = false;
        this.colSearch = [
            { headerName: 'Invoice #', field: 'invoiceNo', width: 100 },
            { headerName: 'Invoice Date', field: 'invoiceDate', width: 100 },
            { headerName: 'Storer Group Name', field: 'storerGroupName' },
            { headerName: 'Profit Center Name', field: 'pcName' },
        ];
        this.accInvoiceData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = agFormHelper_1.agFormHelper.addDays(-35);
        this.maxDate = new Date();
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
        this.colAccInvoice = [
            {
                headerName: 'Invoice Details',
                children: [
                    {
                        headerName: "Charge", field: "chargeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), editable: this.allowDetailEdit(),
                        cellEditorParams: { source: 'Charge', class: "200" }, valueFormatter: agGridHelper_1.agGridHelper.getChargeName, width: 200
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, editable: this.allowUnitEdit(), valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        editable: this.allowDetailEdit(), valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                    },
                    {
                        headerName: "UoM", field: "uoMId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'UoM', class: "100" }, valueFormatter: agGridHelper_1.agGridHelper.getUoMName, width: 100
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, editable: false
                    },
                    {
                        headerName: 'Show Rate/Vol', field: 'print', width: 120, editable: false,
                        cellRenderer: params => {
                            if (!params.node.rowPinned) {
                                if (params.value) {
                                    return "<input type='checkbox' checked />";
                                }
                                else {
                                    return "<input type='checkbox'/>";
                                }
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
        this.loginUser = svcAuth.getUserId();
        var _formid = (this.route.snapshot.queryParamMap.get("formId"));
        if (_formid != null) {
            this.get(_formid.toString());
            this.myForm = true;
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    ngOnInit() {
        this.frmAccInvoice = this.formbulider.group({
            invoiceId: [null],
            invoiceNo: [null, [forms_1.Validators.required]],
            invoiceDate: [null, [forms_1.Validators.required]],
            remarks: [null, [forms_1.Validators.required]],
            storerGroupId: [null, [forms_1.Validators.required]],
            pcId: [null, [forms_1.Validators.required]],
            gstRate: [null],
            workFlowId: [null],
            stateId: [null],
            stateName: [null],
            owner: [null],
            completed: [null],
        });
        this.frmAccInvoice.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.frmAccInvoice.patchValue({
            stateId: 0, stateName: "New", completed: false, invoiceDate: new Date(),
            owner: this.svcAuth.getUserId(), workFlowId: this.workFlowId, gstRate: 0
        });
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divSave');
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmAccInvoice.reset();
        this.frmAccInvoice.enable();
        this.frmAccInvoice.controls.invoiceNo.disable();
        this.frmAccInvoice.patchValue({
            stateId: 0, stateName: "New", completed: false, invoiceDate: new Date(),
            owner: this.svcAuth.getUserId(), workFlowId: this.workFlowId, gstRate: 0
        });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.footer.createdBy = this.svcAuth.getUserId();
        this.storerGroupId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmAccInvoice.controls.invoiceNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.invoiceNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcAccInvoice.getInvoices(this.workFlowId).subscribe(r => {
                this.svcSearchDlg.open("Search & Select Invoice", this.colSearch, r);
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
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.frmAccInvoice.controls.invoiceNo.disable();
        const accinvoice = this.frmAccInvoice.getRawValue();
        //if (this.workFlowId == 4 && (accinvoice.stateId == 1 || accinvoice.stateId == 5)) {
        if (accinvoice.stateId == 1 || accinvoice.stateId == 5) {
            this.frmAccInvoice.enable();
            this.storerGroupId.focus();
            agFormHelper_1.agFormHelper.setGridToolbar(true);
            agFormHelper_1.agFormHelper.setGridStatus(true);
        }
        else {
            this.frmAccInvoice.disable();
            agFormHelper_1.agFormHelper.setGridToolbar(false);
            agFormHelper_1.agFormHelper.setGridStatus(false);
        }
    }
    tbSave() {
        try {
            this.frmAccInvoice.markAllAsTouched();
            if (!this.frmAccInvoice.invalid) {
                var formdata = this.frmAccInvoice.getRawValue();
                formdata.details = this.getDetailFromGrid();
                formdata.footer = this.footer;
                this.validate(formdata);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcAccInvoice.save(formdata).subscribe(data => {
                        // if (this.workFlowId == 4) {
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                        this.svcToaster.showSuccess('Invoice # ' + data.newInvoiceNo + ' saved successfully. Press submit button for onward approval and processing!');
                        this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                        agFormHelper_1.agFormHelper.setGridToolbar(false);
                        agFormHelper_1.agFormHelper.setGridStatus(false);
                        //(<HTMLButtonElement>document.getElementById("btnGridAdd")).disabled = true;
                        this.get(data.newInvoiceNo);
                        //}
                        //else {
                        //                this.initForm();
                        //              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                        //            this.svcToaster.showSuccess('Invoice # ' + data.newInvoiceNo + ' saved successfully');
                        //        }     
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
        if (this.myForm)
            this.router.navigate(['common/MyForm']);
        else {
            this.initForm();
            this.frmAccInvoice.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        }
    }
    tbExit() {
        this.initForm();
        if (this.myForm)
            this.router.navigate(['common/MyForm']);
        else
            this.router.navigate(['/MainForm']);
    }
    tbHistory(formId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(this.workFlowId, formId).subscribe(r => {
                this.svcHistoryDlg.open("Ad Hoc Invoice" + formId, agGridHelper_1.agGridHelper.colHistory, r);
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
                    recipients = this.svcRecipient.getAccInvoiceRecipients(formId, this.workFlowId, stateId);
                }
                if (stateId == 3 || stateId == 4 || stateId == 99) {
                    recipients = this.svcRecipient.getCreator(this.workFlowId, formId);
                }
                rxjs_1.forkJoin([recipients]).subscribe(results => {
                    var data = results[0];
                    recipients = data["recipient"];
                    if (stateId == 4 || stateId == 99) {
                        nextStateId = stateId;
                    }
                    else {
                        nextStateId = data["nextStateId"];
                    }
                    if (recipients === undefined || recipients.length == 0) {
                        this.svcToaster.showWarning("No submission user is configured for selected Form State." +
                            "Submission process can not be executed while submission users are missing" +
                            "Please raise Service Request through eForms if you require any support from IT Department");
                        this.svcWaitDlg.close();
                        return;
                    }
                    else {
                        this.svcFormSubmission.open(agEnum_1.agEnum.getInvoiceState(nextStateId) + " - Invoice # " + this.frmAccInvoice.controls.invoiceNo.value, agEnum_1.agEnum.getInvoiceState(nextStateId), recipients);
                        this.svcFormSubmission.selected().subscribe(r => {
                            if (r) {
                                if (r.recipientId !== undefined) {
                                    sub.formId = formId;
                                    sub.formNo = this.invoiceNo.nativeElement.value;
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
    submit(sn) {
        if (sn.stateId == 3) {
            sn.completed = true;
            sn.approved = true;
        }
        else if (sn.stateId == 4 || sn.stateId == 99) {
            sn.completed = true;
            sn.rejected = true;
            sn.approved = false;
        }
        else {
            sn.completed = false;
        }
        this.svcWaitDlg.open({});
        this.svcAccInvoice.submit(sn).subscribe(() => {
            this.svcToaster.showSuccess('Invoice # ' + sn.formNo +
                ' was successfully submitted to ' + sn.owner + (sn.comments == "" ? " with no comments " : " with the comments " + sn.comments));
            this.tbUndo();
        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
    }
    //#endregion FormSubmission
    //#region grid setup
    initGrid() {
        this.goAccInvoice = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            onCellClicked: function (event) {
                if (event.colDef.field == "print") {
                    if (!event.data.print) {
                        event.node.setDataValue('print', true);
                    }
                    else {
                        event.node.setDataValue('print', false);
                    }
                }
            },
            onCellEditingStarted: function (event) {
                if (event.rowPinned)
                    event.api.stopEditing();
            },
            onRowSelected: function (event) {
                if (event.rowPinned) {
                    event.node.setSelected(false, true);
                }
            },
            onRowDataChanged: () => { this.setFooter(); }
        };
    }
    onAddLine() {
        try {
            var res = this.goAccInvoice.api.applyTransaction({
                add: [{
                        chargeId: null, quantity: 0, rate: 0, uoMId: null, amount: 0, print: true, add: true, edit: false, delete: false
                    }]
            });
            this.goAccInvoice.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line:');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goAccInvoice.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goAccInvoice.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goAccInvoice.api);
                    this.setFooter();
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Invalid Request');
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Delete Line');
        }
    }
    ;
    onAICellValueChanged(params) {
        const colId = params.colDef.field;
        if (!params.data.add)
            params.data.edit = true;
        if (colId == "chargeId") {
            if (params.data.chargeId != "") {
                params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
            }
            else {
                params.node.setDataValue("chargeId", null);
            }
        }
        if (colId == "uoMId") {
            if (params.data.uoMId != "") {
                params.node.setDataValue("uoMId", parseInt(params.data.uoMId));
            }
            else {
                params.node.setDataValue("uoMId", null);
            }
        }
        if (colId === "quantity" || colId === "rate") {
            params.node.setDataValue("amount", params.data.quantity * params.data.rate);
            this.setFooter();
        }
    }
    setFooter() {
        try {
            let _quantity = 0;
            let _amount = 0;
            this.goAccInvoice.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.chargeId != undefined && !rowNode.data.delete) {
                    _quantity += rowNode.data.quantity,
                        _amount += rowNode.data.amount;
                }
            });
            this.goAccInvoice.api.setPinnedBottomRowData([{
                    chargeId: null, quantity: _quantity, rate: null, uoMId: null, amount: _amount
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    getDetailFromGrid() {
        let rowData = [];
        this.goAccInvoice.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    allowDetailEdit() {
        return this.workFlowId == 4;
    }
    allowUnitEdit() {
        return this.workFlowId != 3;
    }
    //#endregion
    //#region local functions
    get(Id) {
        try {
            this.svcWaitDlg.open({});
            this.svcAccInvoice.get(Id, this.workFlowId).subscribe(ai => {
                if (ai) {
                    this.frmAccInvoice.disable();
                    this.frmAccInvoice.controls['invoiceId'].setValue(ai.invoiceId);
                    this.frmAccInvoice.controls['invoiceNo'].setValue(ai.invoiceNo);
                    this.frmAccInvoice.controls['invoiceDate'].setValue(ai.invoiceDate);
                    this.frmAccInvoice.controls['remarks'].setValue(ai.remarks);
                    this.frmAccInvoice.controls['storerGroupId'].setValue(ai.storerGroupId);
                    this.frmAccInvoice.controls['pcId'].setValue(ai.pcId);
                    this.frmAccInvoice.controls['gstRate'].setValue(ai.gstRate);
                    this.frmAccInvoice.controls['stateId'].setValue(ai.stateId);
                    this.frmAccInvoice.controls['completed'].setValue(ai.completed);
                    ai.stateName = agEnum_1.agEnum.getInvoiceState(ai.stateId);
                    this.frmAccInvoice.controls['stateName'].setValue(ai.stateName);
                    this.frmAccInvoice.controls['owner'].setValue(ai.owner);
                    this.accInvoiceData = ai.details;
                    this.footer = ai.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                    if (this.workFlowId == 4) {
                        document.getElementById("btnGridAdd").disabled = true;
                    }
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
    loadInvoiceDetail() {
        try {
            const ai = this.frmAccInvoice.getRawValue();
            if (ai.storerGroupId != null && ai.pcId != null) {
                this.svcWaitDlg.open({});
                if (this.workFlowId == 2) {
                    this.svcAccInvoice.getVariable(ai.storerGroupId, ai.pcId, ai.invoiceDate).subscribe(ai => {
                        if (ai) {
                            this.accInvoiceData = ai;
                            agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                        }
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
                else if (this.workFlowId == 3) {
                    this.svcAccInvoice.getFixed(ai.storerGroupId, ai.pcId, ai.invoiceDate).subscribe(ai => {
                        if (ai) {
                            this.accInvoiceData = ai;
                            agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
                        }
                        else {
                            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                        }
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
                this.svcWaitDlg.open({});
                this.svcAccInvoice.getDefaultGST(ai.storerGroupId, ai.pcId, ai.workFlowId).subscribe(gstrate => {
                    if (gstrate) {
                        this.frmAccInvoice.controls['gstRate'].setValue(gstrate);
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcAccInvoice.getLookup().subscribe(data => {
                this.lstStorerGroup = data.lstStorerGroup;
                this.lstProfitCenter = data.lstProfitCenter;
                sessionStorage.setItem("lstCharge", JSON.stringify(data.lstCharge));
                sessionStorage.setItem("lstUoM", JSON.stringify(data.lstUoM));
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(ai) {
        this.errors = [];
        if (ai.completed || ai.stateId > 1 || ai.owner != ai.footer.createdBy || ai.owner != this.svcAuth.getUserId()) {
            this.errors.push('No further changes can be made to this Invoice at this stage!');
        }
        else if (ai.stateId == 5 && ai.owner != ai.footer.createdBy) {
            this.errors.push('The current owner of this Invoice is ' + ai.owner +
                '!. Only ' + ai.footer.createdBy + ' can make changes to this Invoice if that user is the current owner!');
        }
        if (ai.details.filter(x => !x.delete).length == 0) {
            this.errors.push('Atleast one entry must exist in Invoice Detail to perform save operation');
        }
        else {
            if (ai.details.some(x => !x.delete && !x.chargeId)) {
                this.errors.push('Selection of accessrial charge is mandatory for every row of invoice detail');
            }
            if (ai.details.some(x => !x.delete && !x.uoMId)) {
                this.errors.push('Selection of UoM is mandatory every row of invoice detail');
            }
            if (ai.details.some(x => !x.delete && x.quantity <= 0)) {
                this.errors.push('No row in Invoice detail can contain zero quantity');
            }
            if (ai.details.some(x => !x.delete && x.rate <= 0)) {
                this.errors.push('No row in invoice detail can contain zero Rate');
            }
            var detDuplicate = ai.details.filter(x => !x.delete).map(function (item) { return item.chargeId; }).sort();
            for (var i = 0; i < detDuplicate.length - 1; i++) {
                if (detDuplicate[i + 1] === detDuplicate[i]) {
                    this.errors.push('Charge code must be unique in Invoice Detail!');
                    i = detDuplicate.length;
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
        if (document.getElementById('btnGridAdd') != null) {
            document.getElementById("btnGridAdd").disabled = true;
        }
    }
    initForm() {
        this.frmAccInvoice.reset();
        this.frmAccInvoice.disable();
        this.errors = [];
        this.accInvoiceData = [];
        //this.myForm = false;
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.frmAccInvoice.patchValue({ workFlowId: this.workFlowId, invoiceDate: new Date() });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('storerGroupId', { static: true })
], AccInvoiceComponent.prototype, "storerGroupId", void 0);
__decorate([
    core_1.ViewChild('invoiceNo', { static: true })
], AccInvoiceComponent.prototype, "invoiceNo", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], AccInvoiceComponent.prototype, "btnEdit", void 0);
AccInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-accinvoice',
        templateUrl: './accinvoice.component.html',
        styleUrls: ['./accinvoice.component.css']
    })
], AccInvoiceComponent);
exports.AccInvoiceComponent = AccInvoiceComponent;
//# sourceMappingURL=accinvoice.component.js.map