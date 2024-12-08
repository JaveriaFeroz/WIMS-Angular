"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let CalendarComponent = class CalendarComponent {
    //#endregion
    constructor(router, formbulider, svcWaitDlg, svcCalendar, svcToaster) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWaitDlg = svcWaitDlg;
        this.svcCalendar = svcCalendar;
        this.svcToaster = svcToaster;
        this.optionName = 'Calendar';
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date().getDate() - 35;
        this.maxDate = new Date().getDate() + 180;
        this.frameworkComponents = {
            agDateEditor: agGrid_date_component_1.agGridDateEditor
        };
        this.colCalendar = [
            {
                headerName: "Date", field: "calendarDate", width: 105,
                cellEditor: 'agDateEditor', editable: false, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
            },
            {
                headerName: "Day Type", field: "dayTypeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), editable: true,
                cellEditorParams: { source: 'DayType', class: "180" }, valueFormatter: agGridHelper_1.agGridHelper.getDayTypeName, width: 180
            },
            { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        ];
        sessionStorage.removeItem("lstDayType");
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmCalendar = this.formbulider.group({
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]]
        });
    }
    //#region toolbar functions
    tbLoad() {
        try {
            var formData = this.frmCalendar.getRawValue();
            if (!formData.dateFrom || !formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting calendar extraction request.');
                return;
            }
            if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before submitting calendar extraction request. Date From must always be same or earlier than Date To');
                return;
            }
            else {
                this.svcWaitDlg.open({});
                this.svcCalendar.get(formData.dateFrom, formData.dateTo).subscribe(c => {
                    if (c) {
                        this.calendarData = c.details;
                        this.frmCalendar.controls.dateFrom.disable();
                        this.frmCalendar.controls.dateTo.disable();
                        document.getElementById("btnLoad").disabled = true;
                        this.svcWaitDlg.close();
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided Date Range or you don`t have access to this record');
                        this.svcWaitDlg.close();
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        try {
            this.frmCalendar.markAllAsTouched();
            if (!this.frmCalendar.invalid) {
                var formData = this.frmCalendar.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcCalendar.save(formData).subscribe(() => {
                        this.initForm();
                        this.svcToaster.showSuccess('Record saved Successfully');
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
        this.initForm();
    }
    tbExit() {
        sessionStorage.removeItem("lstDayType");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goCalendar = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "dayTypeId") {
                    if (params.data.dayTypeId != "") {
                        params.node.setDataValue("dayTypeId", parseInt(params.data.dayTypeId));
                    }
                    else {
                        params.node.setDataValue("dayTypeId", null);
                    }
                }
            },
        };
    }
    getDetailFromGrid() {
        let rowData = [];
        this.goCalendar.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    loadLookup() {
        try {
            this.svcCalendar.getLookup().subscribe(data => {
                sessionStorage.setItem("lstDayType", JSON.stringify(data.lstDayType));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(c) {
        this.errors = [];
        if (c.details.some(x => !x.dayTypeId)) {
            this.errors.push('Valid day type must be selected for each date in Grid');
        }
    }
    initForm() {
        this.frmCalendar.reset();
        this.frmCalendar.enable();
        document.getElementById("btnLoad").disabled = false;
        this.errors = [];
        this.goCalendar.api.setRowData([]);
        this.footer = new footer_1.agFooter();
    }
};
CalendarComponent = __decorate([
    core_1.Component({
        selector: 'app-calendar',
        templateUrl: './calendar.component.html',
        styleUrls: ['./calendar.component.css']
    })
], CalendarComponent);
exports.CalendarComponent = CalendarComponent;
//# sourceMappingURL=calendar.component.js.map