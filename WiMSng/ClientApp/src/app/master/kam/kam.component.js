"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KAMComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let KAMComponent = class KAMComponent {
    //#endregion
    constructor(router, formbulider, svcKAM, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcKAM = svcKAM;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region form variables
        this.optionName = 'KAM';
        this.colSearch = [
            { headerName: 'Id', field: 'kamId', width: 70 },
            { headerName: 'Key Account Manager Name', field: 'kamName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        //lstEmail: any;
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmKAM = this.formbulider.group({
            kamId: [null, [forms_1.Validators.required]],
            kamName: [null, [forms_1.Validators.required]],
            email: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmKAM.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmKAM.reset();
        this.frmKAM.enable();
        this.frmKAM.controls.kamId.disable();
        this.frmKAM.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.kamName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmKAM.controls.kamId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.kamId.nativeElement.focus();
    }
    tbEdit() {
        this.frmKAM.enable();
        this.frmKAM.controls.kamId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.kamName.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcKAM.getKAMs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select KAM", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.kamId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        try {
            this.frmKAM.markAllAsTouched();
            if (!this.frmKAM.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmKAM.getRawValue();
                formData.footer = this.footer;
                this.svcKAM.save(formData).subscribe(() => {
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
            this.svcKAM.get(Id).subscribe(kam => {
                if (kam) {
                    this.frmKAM.disable();
                    this.frmKAM.controls['kamId'].setValue(kam.kamId);
                    this.frmKAM.controls['kamName'].setValue(kam.kamName);
                    this.frmKAM.controls['email'].setValue(kam.email);
                    this.frmKAM.controls['isActive'].setValue(kam.isActive);
                    this.footer = kam.footer;
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
    initForm() {
        this.frmKAM.reset();
        this.frmKAM.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('kamName', { static: true })
], KAMComponent.prototype, "kamName", void 0);
__decorate([
    core_1.ViewChild('kamId', { static: true })
], KAMComponent.prototype, "kamId", void 0);
KAMComponent = __decorate([
    core_1.Component({
        selector: 'app-kam',
        templateUrl: './kam.component.html',
        styleUrls: ['./kam.component.css']
    })
], KAMComponent);
exports.KAMComponent = KAMComponent;
//# sourceMappingURL=kam.component.js.map