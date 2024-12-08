"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlJobComponent = void 0;
const core_1 = require("@angular/core");
let ControlJobComponent = class ControlJobComponent {
    //extractISData: ControlJobDetail[];
    //CurrentPeriod: any;
    //CurrentPeriodId: any;
    //#endregion
    constructor(router, formbulider, svcAuth, svcControlJob, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAuth = svcAuth;
        this.svcControlJob = svcControlJob;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region from variable
        this.optionName = 'Control Job';
        this.errors = [];
        this.colControlJob = [
            {
                headerName: 'Control Job Mapping',
                children: [
                    { headerName: "Storer Group", field: "storerGroupName", editable: false, width: 250 },
                    { headerName: "Profit Center", field: "pcName", editable: false, width: 200 },
                    { headerName: "Revenue Job#", field: "revenueJobNo", editable: true, width: 170 },
                    { headerName: "Cost Job#", field: "costJobNo", editable: true, width: 170 },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                ]
            }
        ];
        this.initGrid();
        //var data = JSON.parse(sessionStorage.getItem("Period"));
        //this.CurrentPeriod = data.periodName;
        //this.CurrentPeriodId = data.periodId;
    }
    ngOnInit() {
        this.frmControlJob = this.formbulider.group({ periodName: [null], periodId: [null] });
        this.frmControlJob.patchValue({ periodId: this.svcAuth.getPeriodId(), periodName: this.svcAuth.getPeriodName() });
        this.get(this.svcAuth.getPeriodId());
    }
    //#region toolbar functions
    tbSave() {
        try {
            this.frmControlJob.markAllAsTouched();
            if (!this.frmControlJob.invalid) {
                var formData = this.frmControlJob.getRawValue();
                formData.details = this.getDetailFromGrid().filter(x => x.edit || x.revenueJobNo != "" || x.costJobNo != "");
                this.svcWaitDlg.open({});
                this.svcControlJob.save(formData).subscribe(() => {
                    this.initForm();
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goControlJob = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
        };
    }
    getDetailFromGrid() {
        let rowData = [];
        this.goControlJob.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcControlJob.get(Id).subscribe(cj => {
                if (cj) {
                    this.controljobsData = cj.details;
                }
                else {
                    this.svcToaster.showWarning('No record found for current Period or no Active Rate Sheet exist in Client Rate');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //private validate(cj: ControlJob) {
    //   this.errors = [];
    //   //if (AI.details.some(x => x.revenueJobNo != "")) {
    //   //  /*var a = AI.details.filter(x => x.revenueJobNo);*/
    //   //  var valueArr = AI.details.map(function (item) { return item.revenueJobNo })
    //   //  alert(JSON.stringify(valueArr));
    //   //  var count = valueArr.length;
    //   //  alert(count);
    //   //  //if (Object.keys(AI.details.filter(x => x.revenueJobNo)).lenght != 10) {
    //   //  //  this.errors.push('Revenue Job # in each line item must be specified and must exactly be 10 characters long');
    //   //  //}
    //   //}
    // }
    initForm() {
        this.frmControlJob.reset();
        this.errors = [];
        this.controljobsData = [];
        this.frmControlJob.patchValue({ periodId: this.svcAuth.getPeriodId(), periodName: this.svcAuth.getPeriodName() });
        this.get(this.svcAuth.getPeriodId());
    }
};
ControlJobComponent = __decorate([
    core_1.Component({
        selector: 'app-controljob',
        templateUrl: './controljob.component.html',
        styleUrls: ['./controljob.component.css']
    })
], ControlJobComponent);
exports.ControlJobComponent = ControlJobComponent;
//# sourceMappingURL=controljob.component.js.map