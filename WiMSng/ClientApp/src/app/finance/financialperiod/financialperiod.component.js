"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialPeriodComponent = void 0;
const core_1 = require("@angular/core");
let FinancialPeriodComponent = class FinancialPeriodComponent {
    constructor(router, formbulider, svcFinancialPeriod, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcFinancialPeriod = svcFinancialPeriod;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Period Closure';
    }
    ngOnInit() {
        this.frmFinancialPeriod = this.formbulider.group({
            periodName: [null],
            currentMonth: [null],
            currentYear: [null],
        });
        this.frmFinancialPeriod.disable();
        this.get();
        //agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
    ////#region toolbar functions
    tbSave() {
        if (!this.frmFinancialPeriod.invalid) {
            this.svcWaitDlg.open({});
            //const financialperiod = this.frmFinancialPeriod.getRawValue();
            this.svcFinancialPeriod.save().subscribe(() => {
                this.initForm();
                //  agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                this.svcToaster.showSuccess('Current period closure and new Financial period opening completed successfully');
                this.get();
                this.svcWaitDlg.close();
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get() {
        try {
            this.svcFinancialPeriod.get().subscribe(financialperiod => {
                if (financialperiod) {
                    this.frmFinancialPeriod.disable();
                    this.frmFinancialPeriod.controls['periodName'].setValue(financialperiod.periodName);
                    this.frmFinancialPeriod.controls['currentMonth'].setValue(financialperiod.currentMonth);
                    this.frmFinancialPeriod.controls['currentYear'].setValue(financialperiod.currentYear);
                    //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmFinancialPeriod.reset();
        this.frmFinancialPeriod.disable();
    }
};
FinancialPeriodComponent = __decorate([
    core_1.Component({
        selector: 'app-financialperiod',
        templateUrl: './financialperiod.component.html',
        styleUrls: ['./financialperiod.component.css']
    })
], FinancialPeriodComponent);
exports.FinancialPeriodComponent = FinancialPeriodComponent;
//# sourceMappingURL=financialperiod.component.js.map