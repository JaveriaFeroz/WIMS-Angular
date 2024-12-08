"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableSqFtComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let VariableSqFtComponent = class VariableSqFtComponent {
    //#endregion
    constructor(router, formbulider, svcVariableSqFt, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcVariableSqFt = svcVariableSqFt;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Daily Variable Sq. Ft';
        this.readingData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = agFormHelper_1.agFormHelper.addDays(-360);
        this.maxDate = new Date();
        this.frameworkComponents = {
            agDateEditor: agGrid_date_component_1.agGridDateEditor
        };
        this.colVSF = [
            {
                headerName: 'Variable Sqare FT',
                children: [
                    {
                        headerName: "Storage Date", field: "storageDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Sqaure Feet", field: "sqFt", width: 120, type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: 'Apply Over Time ?', field: 'overTime', width: 150, editable: false,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    }
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmVSF = this.formbulider.group({
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]],
            storerGroupId: [null, [forms_1.Validators.required]],
            pcId: [null, [forms_1.Validators.required]],
            storageTypeId: [null],
        });
        document.getElementById("btnLoad").disabled = false;
        this.frmVSF.patchValue({ dateFrom: agFormHelper_1.agFormHelper.addDays(-5), dateTo: new Date() });
    }
    //#region toolbar functions
    tbLoad() {
        try {
            this.frmVSF.markAllAsTouched();
            var formData = this.frmVSF.getRawValue();
            if (formData.dateFrom > formData.dateTo) {
                this.svcToaster.showFailure('Please select valid date range before hitting Load Button. Date From must always be earlier or same as Date To');
                return;
            }
            else if (!formData.storerGroupId || !formData.pcId || !formData.storageTypeId) {
                this.svcToaster.showFailure('Please select valid Storer Group, Profit Center & Storer Type before hitting load button.');
                return;
            }
            else {
                this.svcWaitDlg.open({});
                this.svcVariableSqFt.get(formData.dateFrom, formData.dateTo, formData.storerGroupId, formData.pcId, formData.storageTypeId).subscribe(ia => {
                    if (ia) {
                        this.readingData = ia.details;
                        document.getElementById("btnLoad").disabled = true;
                        this.frmVSF.controls.dateFrom.disable();
                        this.frmVSF.controls.dateTo.disable();
                        this.frmVSF.controls.storerGroupId.disable();
                        this.frmVSF.controls.pcId.disable();
                        this.frmVSF.controls.storageTypeId.disable();
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
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
            this.frmVSF.markAllAsTouched();
            if (!this.frmVSF.invalid) {
                var formData = this.frmVSF.getRawValue();
                formData.details = this.getDetailFromGrid();
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcVariableSqFt.save(formData).subscribe(() => {
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
        /*    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);*/
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goVSF = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            onCellClicked: function (event) {
                if (event.colDef.field == "overTime") {
                    if (!event.data.selected) {
                        event.node.setDataValue('overTime', true);
                    }
                    else {
                        event.node.setDataValue('overTime', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                //if (params.data.vsfId != 0) {
                params.data.edit = true;
                //}
                //else {
                //          params.data.add = true;
                //      }
            },
        };
    }
    getDetailFromGrid() {
        let rowData = [];
        this.goVSF.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    loadLookup() {
        try {
            this.svcVariableSqFt.getLookup().subscribe(data => {
                this.lstStorerGroup = data.lstStorerGroup;
                this.lstProfitCenter = data.lstProfitCenter;
                this.lstStorageType = data.lstStorageType;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(vsf) {
        this.errors = [];
        if (vsf.details.length == 0) {
            this.errors.push('Atleast one entry must exist in Transaction to perform save operation');
        }
        if (vsf.details.some(x => x.sqFt < 0)) {
            this.errors.push('The variable Sqaure Feet/Mtr reading cannot be -ve');
        }
        else if (vsf.details.some(x => x.overTime && x.sqFt == 0)) {
            this.errors.push('OverTime must not be selected unless you specify some Sq Feet for charging');
        }
    }
    initForm() {
        this.frmVSF.reset();
        this.frmVSF.enable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
        document.getElementById("btnLoad").disabled = false;
        this.readingData = [];
    }
};
VariableSqFtComponent = __decorate([
    core_1.Component({
        selector: 'app-variablesqft',
        templateUrl: './variablesqft.component.html',
        styleUrls: ['./variablesqft.component.css']
    })
], VariableSqFtComponent);
exports.VariableSqFtComponent = VariableSqFtComponent;
//# sourceMappingURL=variablesqft.component.js.map