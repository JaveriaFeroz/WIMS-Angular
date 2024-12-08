"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agEnum_1 = require("../../helper/agEnum");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let GenerateInvoiceComponent = class GenerateInvoiceComponent {
    //#endregion
    constructor(router, formbulider, svcInvoice, svcToaster, svcSearchDlg, svcWaitDlg, svcHistoryDlg, svcRecipient, svcFormSubmission, svcAuth, route) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvoice = svcInvoice;
        this.svcToaster = svcToaster;
        this.svcSearchDlg = svcSearchDlg;
        this.svcWaitDlg = svcWaitDlg;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcRecipient = svcRecipient;
        this.svcFormSubmission = svcFormSubmission;
        this.svcAuth = svcAuth;
        this.route = route;
        //#region form variables
        this.optionName = 'Generate Invoice';
        this.myForm = false;
        this.currentUserId = this.svcAuth.getUserId();
        this.errors = [];
        this.submissionButtonsStatus = "";
        this.footer = new footer_1.agFooter();
        this.colSearch = [
            { headerName: 'Form Id', field: 'formId' },
            { headerName: 'Storer Group', field: 'storerGroupName' },
            { headerName: 'Profit Center', field: 'pcName' },
            { headerName: 'State', field: 'stateName' }
        ];
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnEdit').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        this.loadLookup();
    }
    ngOnInit() {
        this.frmInvoice = this.formbulider.group({
            formId: [null],
            storerGroupId: [null, [forms_1.Validators.required]],
            pcId: [null, [forms_1.Validators.required]],
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]],
            calendarId: [null],
            calendarName: [null],
            gstRate: [null],
            stateId: [null],
            stateName: [null],
            owner: [null],
            completed: [false],
            inclLastPeriod: [false]
        });
        this.frmInvoice.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        if (_formid != null && _formid > 0) {
            this.get(_formid);
            this.myForm = true;
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divHToolbar'); //document.body;//document.getElementById('btnSave') as Node;
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInvoice.reset();
        this.frmInvoice.enable();
        this.frmInvoice.controls.formId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmInvoice.patchValue({
            stateId: 0, completed: false, stateName: "New", owner: this.currentUserId, inclLastPeriod: false //this.svcAuth.getUserId()//this.currentUserId
        });
        this.frmInvoice.controls.storerGroupId.enable();
        this.frmInvoice.controls.stateName.disable();
        this.footer.createdBy = this.currentUserId; //this.svcAuth.getUserId();
        this.storerGroupId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmInvoice.controls.formId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.formId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInvoice.getInvoices().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Invoice Form", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.formId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbHistory(formId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(agEnum_1.agEnum.WorkFlow.Invoice, formId).subscribe(r => {
                this.svcHistoryDlg.open("Invoice # " + formId, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        const inv = this.frmInvoice.getRawValue();
        if (inv.stateId == 1 || inv.stateId == 5) {
            if (inv.stateId == 1) {
                this.frmInvoice.enable();
                this.frmInvoice.controls.storerGroupId.disable();
                this.frmInvoice.controls.pcId.disable();
                this.frmInvoice.controls.inclLastPeriod.disable();
            }
            else {
                this.storerGroupId.focus();
                this.frmInvoice.enable();
            }
        }
        else {
            this.frmInvoice.disable();
        }
        this.frmInvoice.controls.inclLastPeriod.disable();
    }
    tbSave() {
        try {
            this.frmInvoice.markAllAsTouched();
            if (!this.frmInvoice.invalid) {
                var formData = this.frmInvoice.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcInvoice.validate(formData.storerGroupId, formData.pcId, formData.dateFrom, formData.dateTo).subscribe(data => {
                        if (Object.keys(data).length == 0) {
                            this.svcInvoice.save(formData).subscribe(inv => {
                                this.svcToaster.showSuccess('Invoice Request # ' + inv.newFormId +
                                    ' saved successfully. Press submit button to proceed your request for further Approval!');
                                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                                this.frmInvoice.controls['formId'].setValue(inv.newFormId);
                                this.frmInvoice.controls['owner'].setValue(inv.owner);
                                this.frmInvoice.controls['stateId'].setValue(1);
                                this.frmInvoice.controls['stateName'].setValue('Saved');
                                this.footer.createdBy = inv.owner;
                                this.frmInvoice.disable();
                                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                                this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                                this.svcWaitDlg.close();
                            });
                        }
                        else {
                            alert('There are ' + Object.keys(data).length + ' error(s) encoutered during invoice data ' +
                                'validation. Please fix issues and retry running invoice generation process');
                        }
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
    //#endregion toolbar functions
    //#region FormSubmission
    tbFormSubmission(formId, stateId) {
        this.svcWaitDlg.open({});
        let recipients, nextStateId, sub = new submission_1.Submission();
        return new Promise((resolve, reject) => {
            try {
                if (stateId == 2 || stateId == 5) {
                    recipients = this.svcRecipient.getInvoiceRecipients(formId, stateId);
                }
                if (stateId == 3 || stateId == 4 || stateId == 99) {
                    recipients = this.svcRecipient.getCreator(agEnum_1.agEnum.WorkFlow.Invoice, formId);
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
                        this.svcFormSubmission.open(agEnum_1.agEnum.getInvoiceState(nextStateId) + " - Invoice Request # " + formId, agEnum_1.agEnum.getInvoiceState(nextStateId), recipients);
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
                                    this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                                        "Submission process can not be executed while submission users are missing");
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
        this.svcInvoice.submit(sn).subscribe(() => {
            this.svcToaster.showSuccess('Invoice Generation Req # ' + sn.formId +
                ' was successfully submitted to ' + sn.owner + (sn.comments == "" ? " with no comments " : " with the comments " + sn.comments));
            this.tbUndo();
        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
    }
    //#endregion FormSubmission
    //#region local functions
    getCalendar(sgid, pcId, inclLastPeriod) {
        this.svcWaitDlg.open({});
        try {
            this.svcInvoice.getCalendars(sgid, pcId, inclLastPeriod).subscribe(cal => {
                if (cal) {
                    this.frmInvoice.controls['dateFrom'].setValue((cal.dateFrom));
                    this.frmInvoice.controls['dateTo'].setValue((cal.dateTo));
                    this.frmInvoice.controls['calendarId'].setValue(cal.calendarId);
                    this.frmInvoice.controls['calendarName'].setValue(cal.calendarName);
                    this.frmInvoice.controls['gstRate'].setValue(cal.gstRate);
                }
                else {
                    this.frmInvoice.reset();
                    this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    get(formId) {
        this.svcWaitDlg.open({});
        try {
            this.svcInvoice.get(formId).subscribe(inv => {
                if (inv) {
                    this.frmInvoice.controls['formId'].setValue(formId);
                    this.frmInvoice.controls['storerGroupId'].setValue(inv.storerGroupId);
                    this.frmInvoice.controls['pcId'].setValue(inv.pcId);
                    this.frmInvoice.controls['calendarId'].setValue(inv.calendarId);
                    this.frmInvoice.controls['calendarName'].setValue(inv.calendarName);
                    this.frmInvoice.controls['dateFrom'].setValue((inv.dateFrom));
                    this.frmInvoice.controls['dateTo'].setValue((inv.dateTo));
                    this.frmInvoice.controls['inclLastPeriod'].setValue(inv.inclLastPeriod);
                    this.frmInvoice.controls['gstRate'].setValue(inv.gstRate);
                    this.frmInvoice.controls['stateId'].setValue(inv.stateId);
                    inv.stateName = agEnum_1.agEnum.getInvoiceState(inv.stateId);
                    this.frmInvoice.controls['stateName'].setValue(inv.stateName);
                    this.frmInvoice.controls['owner'].setValue(inv.owner);
                    this.frmInvoice.controls['completed'].setValue(inv.completed);
                    this.footer = inv.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
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
            this.svcInvoice.getLookup().subscribe(data => {
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
    onChange() {
        const inv = this.frmInvoice.getRawValue();
        if (inv.storerGroupId && inv.pcId) {
            this.getCalendar(inv.storerGroupId, inv.pcId, inv.inclLastPeriod);
        }
    }
    validate(inv) {
        this.errors = [];
        if (inv.completed ||
            (inv.stateName != 'New' && inv.stateName != 'Saved') ||
            inv.owner != inv.footer.createdBy ||
            inv.owner != this.currentUserId) {
            this.errors.push('No further changes can be made to this Form at this stage!');
        }
        else if (inv.stateId == 5 && inv.owner != inv.footer.createdBy) {
            this.errors.push('The current owner of this Form is ' + inv.owner +
                '!. ' + inv.footer.createdBy + ' can make changes to Form contents provided it is returned to that user!');
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
        this.frmInvoice.reset();
    }
};
__decorate([
    core_1.ViewChild('storerGroupId', { static: true })
], GenerateInvoiceComponent.prototype, "storerGroupId", void 0);
__decorate([
    core_1.ViewChild('formId', { static: true })
], GenerateInvoiceComponent.prototype, "formId", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], GenerateInvoiceComponent.prototype, "btnEdit", void 0);
GenerateInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-generateinvoice',
        templateUrl: './generateinvoice.component.html',
        styleUrls: ['./generateinvoice.component.css']
    })
], GenerateInvoiceComponent);
exports.GenerateInvoiceComponent = GenerateInvoiceComponent;
//# sourceMappingURL=generateinvoice.component.js.map