import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { UserManagementService } from './usermanagement.service';
import { UserOption } from './useroption';
import { UserProfile } from './userprofile';
import { UserRole } from './userrole';
import { UserWarehouse } from './userwarehouse';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})

export class UserManagementComponent implements OnInit {
  public goUserOption: GridOptions;
  public goUserWarehouse: GridOptions;
  public goUserRole: GridOptions;

  //#region constant variables
  readonly optionName: string = 'User Management';
  readonly colSearch =
    [
      { headerName: 'UserId', field: 'userId', width: 120 },
      { headerName: 'Name', field: 'userName' },
      { headerName: 'Branch', field: 'branchName' },
      { headerName: 'Department', field: 'departmentName' },
    ];
  //#endregion
  frmUserMgmt: any;
  optionData: UserOption[] = [];
  warehouseData: UserWarehouse[] = [];
  roleData: UserRole[] = [];
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('userId', { static: true }) userId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcUserManagement: UserManagementService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
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
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbRecall() {
    this.initForm();
    this.frmUserMgmt.controls.userId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.userId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcUserManagement.getUsers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select  User Management", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.userId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmUserMgmt.enable();
    this.frmUserMgmt.controls.userId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
  }

  tbSave() {
    try {
      if (!this.frmUserMgmt.invalid) {
        var formData: UserProfile = this.frmUserMgmt.getRawValue();
        formData.options = this.getUseroptionDataFromGrid();
        formData.warehouses = this.getUserWarehouseDataFromGrid();
        formData.roles = this.getUserRoleDataFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
            return
        }
        this.svcWaitDlg.open({});
        this.svcUserManagement.save(formData).subscribe(
          () => {
            this.initForm();
            agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Record saved Successfully');
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goUserOption = <GridOptions>{
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

    this.goUserWarehouse = <GridOptions>{
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

    this.goUserRole = <GridOptions>{
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

  //#region User Option Grid Definition & functions
  colUserOption = [
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
          cellEditor: agGridHelper.getCellCheckBox()

        },
        { headerName: "Option Name", field: "optionName", width: 190, floatingFilter: true, filter: true },
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
          cellEditor: agGridHelper.getCellCheckBox()
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
          cellEditor: agGridHelper.getCellCheckBox()

        },
      ]
    }
  ];

  getUseroptionDataFromGrid() {
    let rowData = [];
    this.goUserOption.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion       

  //#region User Warehouse Grid Definition & functions
  colUserWarehouse = [
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
          cellEditor: agGridHelper.getCellCheckBox()
        },
        { headerName: "Warehouse Name", field: "whName", width: 210, floatingFilter: true, filter: true }
      ]
    }
  ];

  getUserWarehouseDataFromGrid() {
    let rowData = [];
    this.goUserWarehouse.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion  

  //#region User Role Grid Definition & functions
  colUserRole = [
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
          cellEditor: agGridHelper.getCellCheckBox()
        },
        { headerName: "Role Name", field: "roleName", width: 180, floatingFilter: true, filter: true }
      ]
    }
  ];

  getUserRoleDataFromGrid() {
    let rowData = [];
    this.goUserRole.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion
  //#endregion

  //#region local functions
  get(Id: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcUserManagement.get(Id).subscribe(
        usermanagement => {
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
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private validate(up: UserProfile) {
    this.errors = [];
    if (up.options.some(x => !x.allowView && (x.allowAdd || x.allowEdit))) {
      this.errors.push('Please put check on Allow access when you request Allow Add or Allow Edit else remove check from Allow Add / Edit where Allow access is not turned on');
    }
  }

  private initForm() {
    this.frmUserMgmt.reset();
    this.frmUserMgmt.disable();
    this.errors = [];
    this.footer = new agFooter();
    this.optionData = [];
    this.warehouseData = [];
    this.roleData = [];
  }
  //#endregion local functions
}
