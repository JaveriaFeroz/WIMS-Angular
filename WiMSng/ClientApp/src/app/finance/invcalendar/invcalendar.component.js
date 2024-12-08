"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvCalendarComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let InvCalendarComponent = class InvCalendarComponent {
    //#endregion
    constructor(router, formbulider, svcInvCal, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvCal = svcInvCal;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Invoice Calendar';
        this.colSearch = [
            { headerName: 'Calendar ', field: 'calendarId', width: 70 },
            { headerName: 'CalendarName', field: 'calendarName' }
        ];
        this.activeCalData = [];
        this.pastCalData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.frameworkComponents = { agDateEditor: agGrid_date_component_1.agGridDateEditor };
        this.colActiveCal = [
            {
                headerName: 'Current & Future Invoice Periods',
                children: [
                    {
                        headerName: "Date From", field: "dateFrom", width: 95,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Date To", field: "dateTo", width: 95,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Period", field: "periodId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Period', class: "100" }, valueFormatter: agGridHelper_1.agGridHelper.getPeriod, width: 100
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.colPastCal = [
            {
                headerName: 'Past Invoice Periods',
                children: [
                    { headerName: "Date From", field: "dateFrom", width: 95, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter },
                    { headerName: "Date To", field: "dateTo", width: 95, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter },
                    { headerName: "Period", field: "periodName", width: 100 }
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmInvCalendar = this.formbulider.group({
            calendarId: [null],
            calendarName: [null, [forms_1.Validators.required]],
        });
        this.frmInvCalendar.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInvCalendar.reset();
        this.frmInvCalendar.enable();
        this.frmInvCalendar.controls.calendarId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.calendarName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.frmInvCalendar.controls.calendarId.enable();
        this.calendarId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInvCal.getInvoiceCalendar().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Invoice Calendar", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.calendarId);
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
        this.frmInvCalendar.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.frmInvCalendar.controls.calendarId.disable();
        this.calendarName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmInvCalendar.markAllAsTouched();
            if (!this.frmInvCalendar.invalid) {
                var formData = this.frmInvCalendar.getRawValue();
                formData.details = this.getCurrentDetailFromGrid();
                formData.expired = [];
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcInvCal.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
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
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        sessionStorage.removeItem("lstPeriod");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goActiveCal = {
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
                if (params.colDef.field == "periodId") {
                    if (params.data.periodId != "") {
                        params.node.setDataValue("periodId", parseInt(params.data.periodId));
                    }
                    else {
                        params.node.setDataValue("periodId", null);
                    }
                }
            },
        };
        this.goPastCal = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true
            }
        };
    }
    onAddLine() {
        try {
            var res = this.goActiveCal.api.applyTransaction({
                add: [{
                        dateFrom: null, dateTo: null, periodId: null, expired: false, add: true, edit: false, delete: false
                    }]
            });
            this.goActiveCal.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "dateFrom" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goActiveCal.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goActiveCal.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goActiveCal.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getCurrentDetailFromGrid() {
        let rowData = [];
        this.goActiveCal.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcInvCal.get(Id).subscribe(ic => {
                if (ic) {
                    this.frmInvCalendar.disable();
                    this.frmInvCalendar.controls['calendarId'].setValue(ic.calendarId);
                    this.frmInvCalendar.controls['calendarName'].setValue(ic.calendarName);
                    this.activeCalData = ic.details;
                    this.pastCalData = ic.expired;
                    this.footer = ic.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcInvCal.getLookup().subscribe(data => { sessionStorage.setItem("lstPeriod", JSON.stringify(data.lstPeriod)); }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(ic) {
        this.errors = [];
        if (ic.details.filter(x => !x.delete).length == 0) {
            this.errors.push('Atleast one entry must exist in Invoice Calendar Transaction to perform save operation');
        }
        if (ic.details.some(x => !x.delete && !x.periodId)) {
            this.errors.push('Period is a required field and must be mentioned on all Grid Rows');
        }
        if (ic.details.some(x => !x.delete && (!x.dateFrom || !x.dateTo))) {
            this.errors.push('Date From / To are required field and must be provided for every row of Grid');
        }
        if (ic.details.some(x => !x.delete && x.dateFrom > x.dateTo)) {
            this.errors.push('Date From must always be older or equal to Date To');
        }
        if (ic.details.filter(x => !x.delete).length > 0) {
            var detDuplicate = ic.details.filter(x => !x.delete).map(item => ({ dateFrom: item.dateFrom, dateTo: item.dateTo })).slice().sort();
            for (var i = 0; i < detDuplicate.length - 1; i++) {
                if (detDuplicate[i + 1]['dateFrom'] === detDuplicate[i]['dateFrom']) {
                    if (detDuplicate[i + 1]['dateTo'] === detDuplicate[i]['dateTo']) {
                        this.errors.push('The combination of Date From & To must be unique!');
                        i = detDuplicate.length;
                    }
                }
            }
        }
    }
    initForm() {
        this.frmInvCalendar.reset();
        this.frmInvCalendar.disable();
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
        this.activeCalData = [];
        this.pastCalData = [];
    }
};
__decorate([
    core_1.ViewChild('calendarId', { static: true })
], InvCalendarComponent.prototype, "calendarId", void 0);
__decorate([
    core_1.ViewChild('calendarName', { static: true })
], InvCalendarComponent.prototype, "calendarName", void 0);
InvCalendarComponent = __decorate([
    core_1.Component({
        selector: 'app-invcalendar',
        templateUrl: './invcalendar.component.html',
        styleUrls: ['./invcalendar.component.css']
    })
], InvCalendarComponent);
exports.InvCalendarComponent = InvCalendarComponent;
//# sourceMappingURL=invcalendar.component.js.map