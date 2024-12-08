"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitCenterComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ProfitCenterComponent = class ProfitCenterComponent {
    //#endregion
    constructor(router, formbulider, svcProfitCenter, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcProfitCenter = svcProfitCenter;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region form variables
        this.optionName = 'Profit Center';
        this.colSearch = [
            { headerName: 'WH Id', field: 'whId', width: 70 },
            { headerName: 'Warehouse Name', field: 'whName' },
            { headerName: 'PC Id', field: 'pcId', width: 70 },
            { headerName: 'Profit Center Name', field: 'pcName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmProfitCenter = this.formbulider.group({
            pcId: [null, [forms_1.Validators.required]],
            pcCode: [null, [forms_1.Validators.required]],
            pcName: [null, [forms_1.Validators.required]],
            whId: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmProfitCenter.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmProfitCenter.reset();
        this.frmProfitCenter.enable();
        this.frmProfitCenter.controls.pcId.disable();
        this.frmProfitCenter.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.pcCode.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmProfitCenter.controls.pcId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.pcId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcProfitCenter.getProfitCenters().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Profit Center", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.pcId);
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
        this.frmProfitCenter.enable();
        this.frmProfitCenter.controls.pcId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.pcCode.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmProfitCenter.markAllAsTouched();
            if (!this.frmProfitCenter.invalid) {
                var formData = this.frmProfitCenter.getRawValue();
                formData.footer = this.footer;
                this.svcWaitDlg.open({});
                this.svcProfitCenter.save(formData).subscribe(() => {
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
            this.svcProfitCenter.get(Id).subscribe(pc => {
                if (pc) {
                    this.frmProfitCenter.disable();
                    this.frmProfitCenter.controls['pcId'].setValue(pc.pcId);
                    this.frmProfitCenter.controls['pcCode'].setValue(pc.pcCode);
                    this.frmProfitCenter.controls['pcName'].setValue(pc.pcName);
                    this.frmProfitCenter.controls['whId'].setValue(pc.whId);
                    this.frmProfitCenter.controls['isActive'].setValue(pc.isActive);
                    this.footer = pc.footer;
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
            this.svcProfitCenter.getLookup().subscribe(data => {
                this.lstWarehouse = data.lstWarehouse;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmProfitCenter.reset();
        this.frmProfitCenter.disable();
        this.errors = [];
    }
};
__decorate([
    core_1.ViewChild('pcId', { static: true })
], ProfitCenterComponent.prototype, "pcId", void 0);
__decorate([
    core_1.ViewChild('pcCode', { static: true })
], ProfitCenterComponent.prototype, "pcCode", void 0);
ProfitCenterComponent = __decorate([
    core_1.Component({
        selector: 'app-profitcenter',
        templateUrl: './profitcenter.component.html',
        styleUrls: ['./profitcenter.component.css']
    })
], ProfitCenterComponent);
exports.ProfitCenterComponent = ProfitCenterComponent;
//# sourceMappingURL=profitcenter.component.js.map