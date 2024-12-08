"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRemarksComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let InvoiceRemarksComponent = class InvoiceRemarksComponent {
    constructor(router, formbulider, svcInvoiceRemarks, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvoiceRemarks = svcInvoiceRemarks;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Invoice Remarks';
        this.colSearch = [
            { headerName: 'Invoice #', field: 'invoiceNo' },
            { headerName: 'Invoice Date', field: 'invoiceDate' },
            { headerName: 'Storer Group', field: 'storerGroupName' },
            { headerName: 'Warehouse', field: 'whName' }
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmInvoiceRemarks = this.formbulider.group({
            invoiceNo: [null, [forms_1.Validators.required]],
            projectName: [null, [forms_1.Validators.required]],
            projectTitle: [null, [forms_1.Validators.required]],
            remarks: [null, [forms_1.Validators.required]],
            invoiceId: [null],
        });
        this.frmInvoiceRemarks.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions  
    tbRecall() {
        this.initForm();
        this.frmInvoiceRemarks.controls.invoiceNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.invoiceno.nativeElement.focus();
    }
    //tbSearch(): void {
    //  try {
    //    this.svcWaitDlg.open({});
    //    this.svcInvoiceRemarks.getInvoices().subscribe(r => {
    //      this.svcSearchDlg.open("Search & Select Invoice", this.colSearch, r);
    //      this.svcSearchDlg.selected().subscribe(r => {
    //        if (r) {
    //          this.get(r.invoiceNo);
    //        }
    //      });
    //    },
    //      error => { this.svcToaster.showFailure(error); },
    //      () => { this.svcWaitDlg.close(); });
    //  }
    //  catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
    //}
    tbEdit() {
        this.frmInvoiceRemarks.enable();
        this.frmInvoiceRemarks.controls.invoiceNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.invoiceno.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmInvoiceRemarks.markAllAsTouched();
            if (!this.frmInvoiceRemarks.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmInvoiceRemarks.getRawValue();
                formData.footer = this.footer;
                this.svcInvoiceRemarks.save(formData).subscribe(() => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcInvoiceRemarks.get(Id).subscribe(invoiceremarks => {
                if (invoiceremarks) {
                    this.frmInvoiceRemarks.disable();
                    this.frmInvoiceRemarks.controls['invoiceNo'].setValue(invoiceremarks.invoiceNo);
                    this.frmInvoiceRemarks.controls['projectName'].setValue(invoiceremarks.projectName);
                    this.frmInvoiceRemarks.controls['projectTitle'].setValue(invoiceremarks.projectTitle);
                    this.frmInvoiceRemarks.controls['remarks'].setValue(invoiceremarks.remarks);
                    this.frmInvoiceRemarks.controls['invoiceId'].setValue(invoiceremarks.invoiceId);
                    this.footer = invoiceremarks.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmInvoiceRemarks.reset();
        this.frmInvoiceRemarks.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('invoiceno', { static: true })
], InvoiceRemarksComponent.prototype, "invoiceno", void 0);
InvoiceRemarksComponent = __decorate([
    core_1.Component({
        selector: 'app-invoiceremarks',
        templateUrl: './invoiceremarks.component.html',
        styleUrls: ['./invoiceremarks.component.css']
    })
], InvoiceRemarksComponent);
exports.InvoiceRemarksComponent = InvoiceRemarksComponent;
//# sourceMappingURL=invoiceremarks.component.js.map