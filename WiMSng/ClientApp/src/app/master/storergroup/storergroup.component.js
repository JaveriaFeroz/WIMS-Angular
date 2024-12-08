"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorerGroupComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let StorerGroupComponent = class StorerGroupComponent {
    //#endregion
    constructor(router, formbulider, svcStorerGroup, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcStorerGroup = svcStorerGroup;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Storer Group';
        this.colSearch = [
            { headerName: 'Group Id', field: 'groupId', width: 70 },
            { headerName: 'Group Name', field: 'groupName' }
        ];
        this.storerData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colStorerGroup = [
            {
                headerName: 'Storer associated with this Group',
                children: [
                    {
                        headerName: "Storer Key", field: "storerKey", valueFormatter: agGridHelper_1.agGridHelper.getStorerKey, width: 415,
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), cellEditorParams: { source: 'StorerKey', class: "415" }
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        sessionStorage.removeItem("lstStorer");
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmStorerGroup = this.formbulider.group({
            groupId: [null, [forms_1.Validators.required]],
            groupName: [null, [forms_1.Validators.required]],
            nameOnInvoice: [null, [forms_1.Validators.required]],
            address: [null, [forms_1.Validators.required]],
            contactPerson: [null],
            contactNo: [null],
            faxNo: [null],
            email: [null, [forms_1.Validators.required]],
            creditDays: [null],
            ntn: [null],
            strn: [null],
            cwClientId: [null, [forms_1.Validators.required]],
            printWithLetterHead: [null],
        });
        this.frmStorerGroup.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmStorerGroup.reset();
        this.frmStorerGroup.enable();
        this.frmStorerGroup.controls.groupId.disable();
        this.frmStorerGroup.patchValue({ printWithLetterHead: false });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.groupName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmStorerGroup.controls.groupId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.groupId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcStorerGroup.getStorerGroups().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Storer Group", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.groupId);
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
        this.frmStorerGroup.enable();
        this.frmStorerGroup.controls.groupId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.groupName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        this.frmStorerGroup.markAllAsTouched();
        if (!this.frmStorerGroup.invalid) {
            var formData = this.frmStorerGroup.getRawValue();
            formData.details = this.getDetailFromGrid();
            formData.footer = this.footer;
            this.validate(formData);
            if (this.errors.length > 0) {
                return;
            }
            else {
                this.svcWaitDlg.open({});
                this.svcStorerGroup.save(formData).subscribe(() => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        sessionStorage.removeItem("lstStorer");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goStorerGroup = {
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
            },
        };
    }
    onAddLine() {
        try {
            var res = this.goStorerGroup.api.applyTransaction({
                add: [{
                        storerKey: null, add: true, edit: false, delete: false
                    }]
            });
            this.goStorerGroup.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "storerKey" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goStorerGroup.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goStorerGroup.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goStorerGroup.api);
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
    getDetailFromGrid() {
        let rowData = [];
        this.goStorerGroup.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(id) {
        this.svcWaitDlg.open({});
        try {
            this.svcStorerGroup.get(id).subscribe(sg => {
                if (sg) {
                    this.frmStorerGroup.disable();
                    this.frmStorerGroup.controls['groupId'].setValue(sg.groupId);
                    this.frmStorerGroup.controls['groupName'].setValue(sg.groupName);
                    this.frmStorerGroup.controls['nameOnInvoice'].setValue(sg.nameOnInvoice);
                    this.frmStorerGroup.controls['address'].setValue(sg.address);
                    this.frmStorerGroup.controls['contactPerson'].setValue(sg.contactPerson);
                    this.frmStorerGroup.controls['contactNo'].setValue(sg.contactNo);
                    this.frmStorerGroup.controls['faxNo'].setValue(sg.faxNo);
                    this.frmStorerGroup.controls['email'].setValue(sg.email);
                    this.frmStorerGroup.controls['creditDays'].setValue(sg.creditDays);
                    this.frmStorerGroup.controls['ntn'].setValue(sg.ntn);
                    this.frmStorerGroup.controls['strn'].setValue(sg.strn);
                    this.frmStorerGroup.controls['cwClientId'].setValue(sg.cwClientId);
                    this.frmStorerGroup.controls['printWithLetterHead'].setValue(sg.printWithLetterHead);
                    this.storerData = sg.details;
                    this.footer = sg.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
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
            this.svcStorerGroup.getLookup().subscribe(data => {
                sessionStorage.setItem("lstStorer", JSON.stringify(data.lstStorer));
            }, error => {
                this.svcToaster.showFailure(error);
            }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(sg) {
        this.errors = [];
        //let regexpNumber = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
        let cellFormat = new RegExp('^[0-9]{4}-[0-9]{7}$');
        let ntnFormat = new RegExp('^[0-9+]{7}-[0-9+]{1}$');
        //if (!MobileNo.test(GF.ContactNo)) {
        //  this.errors.push('Contact # must be defined in proper format like xxxx-xxxxxxx');
        //}
        if (sg.contactNo && !cellFormat.test(sg.contactNo)) {
            this.errors.push('Contact # must be defined in proper format like xxxx-xxxxxxx');
        }
        if (sg.ntn && !ntnFormat.test(sg.ntn)) {
            this.errors.push('NTN # must be defined in proper format like xxxxxxx-x');
        }
        //if (sg.details.length == 0) {
        //   this.errors.push('Atleast one entry must exist in StorerGroup Transaction to perform save operation');
        // }
        if (Object.keys(sg.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one storer must be mapped to this Storer Group to perform save operation');
        }
        if (sg.details.some(x => !x.delete && !x.storerKey)) {
            this.errors.push('No row can have empty storer Key, please remove rows that are not required');
        }
        else if (Object.keys(sg.details.filter(x => !x.delete)).length != 0) {
            var valueArr = sg.details.filter(x => !x.delete).map(function (item) { return item.storerKey; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Storer Key must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmStorerGroup.reset();
        this.frmStorerGroup.disable();
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.storerData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('groupName', { static: true })
], StorerGroupComponent.prototype, "groupName", void 0);
__decorate([
    core_1.ViewChild('groupId', { static: true })
], StorerGroupComponent.prototype, "groupId", void 0);
StorerGroupComponent = __decorate([
    core_1.Component({
        selector: 'app-storergroup',
        templateUrl: './storergroup.component.html',
        styleUrls: ['./storergroup.component.css']
    })
], StorerGroupComponent);
exports.StorerGroupComponent = StorerGroupComponent;
//# sourceMappingURL=storergroup.component.js.map