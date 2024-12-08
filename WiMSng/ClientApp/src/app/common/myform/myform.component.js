"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFormComponent = void 0;
const core_1 = require("@angular/core");
const agGridHelper_1 = require("../../helper/agGridHelper");
const agEnum_1 = require("../../helper/agEnum");
let MyFormComponent = class MyFormComponent {
    //#endregion
    constructor(router, baseUrl, formbulider, svcMyForm, svcHistoryDlg, svcToaster, svcWaitDlg, svcRecipient) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcMyForm = svcMyForm;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcRecipient = svcRecipient;
        //#endregion local functions
        //#region form Grid Definition & functions
        this.colForms = [
            {
                headerName: "Work Flow", field: "workFlowName", width: 110,
                cellStyle: {
                    backgroundColor: 'lightgoldenrodyellow',
                    color: 'darkgoldenrod',
                    fontWeight: 'bold'
                },
            },
            {
                headerName: "Form #", field: "formId", width: 90,
                cellRenderer: function (params) {
                    return '<a href="' + params.data.route + '?formId=' + params.value + '" title="Click to open this form">' + params.value + '</a>';
                },
                cellStyle: { textDecoration: 'underline' }
            },
            { headerName: "State", field: "stateName", width: 160 },
            { headerName: "Sender", field: "sender", width: 120 },
            { headerName: "Recipient", field: "recipient", width: 120 },
            { headerName: "Sent On", field: "sentOn", width: 120 },
            {
                headerName: "Amount", field: "documentValue", type: "numericColumn", filter: "agNumberColumnFilter",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90
            },
            { headerName: "Comments", field: "submissionComments", width: 200, cellEditor: "agLargeTextCellEditor", tooltipField: "submissionComments" },
            {
                headerName: "History", field: "History", width: 40, filter: false,
                cellRenderer: function (params) {
                    return '<a title="Click to view history of selected form"><img src="/WiMS/assets/images/history.png" width="20" height="20"/></a>';
                }
            },
            { headerName: 'WFId', field: 'workFlowId', hide: true, suppressColumnsToolPanel: true },
            { headerName: 'C', field: 'route', hide: true, suppressColumnsToolPanel: true },
            { headerName: 'TK', field: 'trackingKey', hide: true, suppressColumnsToolPanel: true }
        ];
        this.apiURL = baseUrl;
    }
    ngOnInit() {
        this.optionFormGroup = this.formbulider.group({ options: ['0'] });
        this.initGrid();
        this.GetMyForms(0);
    }
    //#region toolbar functions
    tbHistroy(formId, workFlowName, workFlowId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(workFlowId, formId).subscribe(r => {
                this.svcHistoryDlg.open("Activity history Of " + workFlowName + " # " + formId, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    GetMyForms(id) {
        try {
            if (id == 0) {
                this.svcMyForm.ActiveForms(agEnum_1.agEnum.WorkFlow.ALL).subscribe(data => {
                    this.formData = data;
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
            else if (id == 1) {
                this.svcMyForm.SentForms(agEnum_1.agEnum.WorkFlow.ALL).subscribe(data => {
                    this.formData = data;
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
            else if (id == 2) {
                this.svcMyForm.CompletedForms(agEnum_1.agEnum.WorkFlow.ALL).subscribe(data => {
                    this.formData = data;
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initGrid() {
        this.goForms = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            //columnDefs: this.colForms,
            rowSelection: 'single',
            defaultColDef: {
                editable: false,
                floatingFilter: true,
                filter: true,
                resizable: true,
                sortable: true
            },
            onGridReady: () => {
                this.goForms.api.sizeColumnsToFit();
            }
        };
    }
    onCellClicked(event) {
        const column = event.api.getFocusedCell().column.colDef.headerName;
        if (column == "History") {
            this.tbHistroy(event.node.data.trackingKey, event.node.data.workFlowName, event.node.data.workFlowId);
        }
    }
};
MyFormComponent = __decorate([
    core_1.Component({
        selector: 'app-myform',
        templateUrl: './myform.component.html',
        styleUrls: ['./myform.component.css']
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], MyFormComponent);
exports.MyFormComponent = MyFormComponent;
//# sourceMappingURL=myform.component.js.map