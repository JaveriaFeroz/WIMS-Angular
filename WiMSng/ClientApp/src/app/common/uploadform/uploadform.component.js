"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFormComponent = void 0;
const core_1 = require("@angular/core");
const agEnum_1 = require("../../helper/agEnum");
let UploadFormComponent = class UploadFormComponent {
    //#endregion
    constructor(router, formbulider, svcWaitDlg, svcUploadForm, toaster) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWaitDlg = svcWaitDlg;
        this.svcUploadForm = svcUploadForm;
        this.toaster = toaster;
        //#endregion local functions
        //#region form Grid Definition & functions
        this.colReq = [
            {
                headerName: "Document", field: "workFlowName", width: 90,
                cellStyle: { backgroundColor: 'lightgoldenrodyellow', color: 'darkgoldenrod', fontWeight: 'bold' },
            },
            {
                headerName: "Req #", field: "formId", width: 80,
                cellStyle: { backgroundColor: 'lightgoldenrodyellow', color: 'darkgoldenrod', fontWeight: 'bold' },
            },
            { headerName: "Warehouse", field: "whName", width: 160 },
            { headerName: "Storer ", field: "storerKey", width: 130 },
            { headerName: "Customer Ref #", field: "customerOrderNo", width: 150 },
            { headerName: "State", field: "stateName", width: 160 },
            { headerName: "Sender", field: "sender", width: 120 },
            { headerName: "Uploaded On", field: "sentOn", width: 150 },
            { headerName: "Uploaded in WMS", field: "uploadedinWMSDbOn", width: 150 }
        ];
    }
    ngOnInit() {
        this.requestFormGroup = this.formbulider.group({});
        this.initGrid();
        this.getForms();
    }
    //#region toolbar functions
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    getForms() {
        try {
            this.svcWaitDlg.open({});
            this.svcUploadForm.get(agEnum_1.agEnum.WorkFlow.ALL).subscribe(data => { this.requestData = data; }, error => { this.toaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.toaster.showFailure(e);
            this.svcWaitDlg.close();
        }
    }
    initGrid() {
        this.goRequest = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                floatingFilter: true,
                filter: true,
                resizable: true,
                sortable: true
            },
            onGridReady: () => {
                this.goRequest.api.sizeColumnsToFit();
            }
        };
    }
};
UploadFormComponent = __decorate([
    core_1.Component({
        selector: 'app-uploadform',
        templateUrl: './uploadform.component.html',
        styleUrls: ['./uploadform.component.css']
    })
], UploadFormComponent);
exports.UploadFormComponent = UploadFormComponent;
//# sourceMappingURL=uploadform.component.js.map