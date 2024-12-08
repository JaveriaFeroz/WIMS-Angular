"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementComponent = void 0;
const core_1 = require("@angular/core");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let UserManagementComponent = class UserManagementComponent {
    constructor(router, formbulider, svcUserManagement, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcUserManagement = svcUserManagement;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'User Management';
        this.colSearch = [
            { headerName: 'UserId', field: 'userId', width: 120 },
            { headerName: 'Name', field: 'userName' },
            { headerName: 'Branch', field: 'branchName' },
            { headerName: 'Department', field: 'departmentName' },
        ];
        this.optionData = [];
        this.warehouseData = [];
        this.roleData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        //#region User Option Grid Definition & functions
        this.colUserOption = [
            {
                headerName: 'Screen/Options allowed to the User',
                children: [
                    {
                        headerName: 'S', field: 'allowView', width: 70,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: "Option Name", field: "optionName", width: 190
                    },
                    {
                        headerName: 'Add', field: 'allowAdd', width: 70,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: 'Edit', field: 'allowEdit', width: 70,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                ]
            }
        ];
        //#endregion       
        //#region User Warehouse Grid Definition & functions
        this.colUserWarehouse = [
            {
                headerName: 'Warehouse(s) accessible to the User',
                children: [
                    {
                        headerName: 'S', field: 'selected', width: 70,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: "Warehouse Name", field: "whName", width: 210
                    }
                ]
            }
        ];
        //#endregion  
        //#region User Role Grid Definition & functions
        this.colUserRole = [
            {
                headerName: 'Role associated with the User',
                children: [
                    {
                        headerName: 'S', field: 'selected', width: 70,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: "Role Name", field: "roleName", width: 180
                    }
                ]
            }
        ];
        this.initGrid();
    }
    ngOnInit() {
        this.frmUserMgmt = this.formbulider.group({
            userId: [null],
            isActive: [null],
            userName: [null],
            departmentName: [null],
            branchName: [null],
            email: [null],
        });
        this.frmUserMgmt.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmUserMgmt.controls.userId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.userId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcUserManagement.getUsers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select  User Management", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.userId);
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
        this.frmUserMgmt.enable();
        this.frmUserMgmt.controls.userId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
    }
    tbSave() {
        try {
            if (!this.frmUserMgmt.invalid) {
                var formData = this.frmUserMgmt.getRawValue();
                formData.options = this.getUseroptionDataFromGrid();
                formData.warehouses = this.getUserWarehouseDataFromGrid();
                formData.roles = this.getUserRoleDataFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                this.svcWaitDlg.open({});
                this.svcUserManagement.save(formData).subscribe(() => {
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
    //#region grid setup
    initGrid() {
        this.goUserOption = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                filter: true,
                singleClickEdit: true
            },
            onCellClicked: function (event) {
                if (event.colDef.field == "allowView") {
                    if (!event.data.allowView) {
                        event.node.setDataValue('allowView', true);
                    }
                    else {
                        event.node.setDataValue('allowView', false);
                    }
                }
                if (event.colDef.field == "allowAdd") {
                    if (!event.data.allowAdd) {
                        event.node.setDataValue('allowAdd', true);
                    }
                    else {
                        event.node.setDataValue('allowAdd', false);
                    }
                }
                if (event.colDef.field == "allowEdit") {
                    if (!event.data.allowEdit) {
                        event.node.setDataValue('allowEdit', true);
                    }
                    else {
                        event.node.setDataValue('allowEdit', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.goUserWarehouse = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                filter: true,
                singleClickEdit: true
            },
            onCellClicked: function (event) {
                if (event.colDef.field == "selected") {
                    if (!event.data.selected) {
                        event.node.setDataValue('selected', true);
                    }
                    else {
                        event.node.setDataValue('selected', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.goUserRole = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                filter: true,
                singleClickEdit: true
            },
            onCellClicked: function (event) {
                if (event.colDef.field == "selected") {
                    if (!event.data.selected) {
                        event.node.setDataValue('selected', true);
                    }
                    else {
                        event.node.setDataValue('selected', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
    }
    getUseroptionDataFromGrid() {
        let rowData = [];
        this.goUserOption.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getUserWarehouseDataFromGrid() {
        let rowData = [];
        this.goUserWarehouse.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    getUserRoleDataFromGrid() {
        let rowData = [];
        this.goUserRole.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcUserManagement.get(Id).subscribe(usermanagement => {
                if (usermanagement) {
                    this.frmUserMgmt.disable();
                    this.frmUserMgmt.controls['userId'].setValue(usermanagement.userId);
                    this.frmUserMgmt.controls['userName'].setValue(usermanagement.userName);
                    this.frmUserMgmt.controls['departmentName'].setValue(usermanagement.departmentName);
                    this.frmUserMgmt.controls['branchName'].setValue(usermanagement.branchName);
                    this.frmUserMgmt.controls['email'].setValue(usermanagement.email);
                    this.frmUserMgmt.controls['isActive'].setValue(usermanagement.isActive);
                    this.footer = usermanagement.footer;
                    this.optionData = usermanagement.options;
                    this.warehouseData = usermanagement.warehouses;
                    this.roleData = usermanagement.roles;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    validate(up) {
        this.errors = [];
        if (up.options.some(x => !x.allowView && (x.allowAdd || x.allowEdit))) {
            this.errors.push('Please put check on Allow access when you request Allow Add or Allow Edit else remove check from Allow Add / Edit where Allow access is not turned on');
        }
    }
    initForm() {
        this.frmUserMgmt.reset();
        this.frmUserMgmt.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.optionData = [];
        this.warehouseData = [];
        this.roleData = [];
    }
};
__decorate([
    core_1.ViewChild('userId', { static: true })
], UserManagementComponent.prototype, "userId", void 0);
UserManagementComponent = __decorate([
    core_1.Component({
        selector: 'app-usermanagement',
        templateUrl: './usermanagement.component.html',
        styleUrls: ['./usermanagement.component.css']
    })
], UserManagementComponent);
exports.UserManagementComponent = UserManagementComponent;
//# sourceMappingURL=usermanagement.component.js.map