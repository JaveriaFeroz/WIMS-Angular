"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeTypeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ChargeTypeComponent = class ChargeTypeComponent {
    //#endregion
    constructor(router, formbulider, svcChargetype, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcChargetype = svcChargetype;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region form variables
        this.optionName = 'Charge Type';
        this.colSearch = [
            { headerName: 'Type', field: 'typeId', width: 70 },
            { headerName: 'Charge Type Name', field: 'typeName', },
            { headerName: 'Desc On Invoice', field: 'descOnInvoice', width: 140 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmChargeType = this.formbulider.group({
            typeId: [null, [forms_1.Validators.required]],
            typeName: [null, [forms_1.Validators.required]],
            chargeCode: [null, [forms_1.Validators.required]],
            descOnInvoice: [null],
        });
        this.frmChargeType.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmChargeType.controls.typeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.typeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcChargetype.getChargeTypes().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Charge Type", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.typeId);
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
        this.frmChargeType.enable();
        this.frmChargeType.controls.typeId.disable();
        //this.frmChargeType.controls.typeName.disable();
        //this.frmChargeType.controls.descOnInvoice.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.typeName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmChargeType.markAllAsTouched();
            if (!this.frmChargeType.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmChargeType.getRawValue();
                formData.footer = this.footer;
                this.svcChargetype.save(formData).subscribe(() => {
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
            this.svcChargetype.get(id).subscribe(ct => {
                if (ct) {
                    this.frmChargeType.disable();
                    this.frmChargeType.controls['typeId'].setValue(ct.typeId);
                    this.frmChargeType.controls['typeName'].setValue(ct.typeName);
                    this.frmChargeType.controls['chargeCode'].setValue(ct.chargeCode);
                    this.frmChargeType.controls['descOnInvoice'].setValue(ct.descOnInvoice);
                    this.footer = ct.footer;
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
            this.svcChargetype.getLookup().subscribe(data => {
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
        this.frmChargeType.reset();
        this.frmChargeType.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('typeName', { static: true })
], ChargeTypeComponent.prototype, "typeName", void 0);
__decorate([
    core_1.ViewChild('typeId', { static: true })
], ChargeTypeComponent.prototype, "typeId", void 0);
ChargeTypeComponent = __decorate([
    core_1.Component({
        selector: 'app-chargetype',
        templateUrl: './chargetype.component.html',
        styleUrls: ['./chargetype.component.css']
    })
], ChargeTypeComponent);
exports.ChargeTypeComponent = ChargeTypeComponent;
//# sourceMappingURL=chargetype.component.js.map