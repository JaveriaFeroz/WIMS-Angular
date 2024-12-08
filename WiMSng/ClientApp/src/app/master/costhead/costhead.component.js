"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostHeadComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let CostHeadComponent = class CostHeadComponent {
    //#endregion
    constructor(router, formbulider, svcCostHead, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCostHead = svcCostHead;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region form variables
        this.optionName = 'Expense Type';
        this.colSearch = [
            { headerName: 'Id', field: 'headId', width: 70 },
            { headerName: 'Head Name', field: 'headName' },
            { headerName: 'Charge Code', field: 'chargeCode' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmCosthead = this.formbulider.group({
            headId: [null, [forms_1.Validators.required]],
            headName: [null, [forms_1.Validators.required]],
            chargeCode: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmCosthead.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmCosthead.reset();
        this.frmCosthead.enable();
        this.frmCosthead.controls.headId.disable();
        this.frmCosthead.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.headName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmCosthead.controls.headId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.headId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcCostHead.getCostHeads().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Cost Head", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.headId);
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
        this.frmCosthead.enable();
        this.frmCosthead.controls.headId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.headName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmCosthead.markAllAsTouched();
            if (!this.frmCosthead.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmCosthead.getRawValue();
                formData.footer = this.footer;
                this.svcCostHead.save(formData).subscribe(() => {
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
    get(id) {
        this.svcWaitDlg.open({});
        try {
            this.svcCostHead.get(id).subscribe(ch => {
                if (ch) {
                    this.frmCosthead.disable();
                    this.frmCosthead.controls['headId'].setValue(ch.headId);
                    this.frmCosthead.controls['headName'].setValue(ch.headName);
                    this.frmCosthead.controls['chargeCode'].setValue(ch.chargeCode);
                    this.frmCosthead.controls['isActive'].setValue(ch.isActive);
                    this.footer = ch.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
            this.svcCostHead.getLookup().subscribe(data => {
                this.lstChargeCode = data.lstChargeCode;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmCosthead.reset();
        this.frmCosthead.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('headName', { static: true })
], CostHeadComponent.prototype, "headName", void 0);
__decorate([
    core_1.ViewChild('headId', { static: true })
], CostHeadComponent.prototype, "headId", void 0);
CostHeadComponent = __decorate([
    core_1.Component({
        selector: 'app-costhead',
        templateUrl: './costhead.component.html',
        styleUrls: ['./costhead.component.css']
    })
], CostHeadComponent);
exports.CostHeadComponent = CostHeadComponent;
//# sourceMappingURL=costhead.component.js.map