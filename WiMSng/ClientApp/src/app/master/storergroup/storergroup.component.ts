import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { StorerGroup } from './storergroup';
import { StorerGroupDetail } from './storergroupdetail';
import { StorerGroupService } from './storergroup.service';

@Component({
  selector: 'app-storergroup',
  templateUrl: './storergroup.component.html',
  styleUrls: ['./storergroup.component.css']
})

export class StorerGroupComponent implements OnInit {
  //#region form variables
  public goStorerGroup: GridOptions;
  readonly optionName: string = 'Storer Group';
  readonly colSearch =
    [
      { headerName: 'Group Id', field: 'groupId', width: 70 },
      { headerName: 'Group Name', field: 'groupName' }
    ];
  frmStorerGroup: any;
  storerData: StorerGroupDetail[] = [];
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  @ViewChild('groupName', { static: true }) groupName: ElementRef;
  @ViewChild('groupId', { static: true }) groupId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcStorerGroup: StorerGroupService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    sessionStorage.removeItem("lstStorer");
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmStorerGroup = this.formbulider.group({
      groupId: [null, [Validators.required]],
      groupName: [null, [Validators.required]],
      nameOnInvoice: [null, [Validators.required]],
      address: [null, [Validators.required]],
      contactPerson: [null],
      contactNo: [null],
      faxNo: [null],
      email: [null, [Validators.required]],
      creditDays: [null],
      ntn: [null],
      strn: [null],
      cwClientId: [null, [Validators.required]],
      printWithLetterHead: [null],
    });
    this.frmStorerGroup.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmStorerGroup.reset();
    this.frmStorerGroup.enable();
    this.frmStorerGroup.controls.groupId.disable();
    this.frmStorerGroup.patchValue({ printWithLetterHead: false  });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);    
    this.groupName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmStorerGroup.controls.groupId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.groupId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcStorerGroup.getStorerGroups().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Storer Group", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.groupId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmStorerGroup.enable();
    this.frmStorerGroup.controls.groupId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.groupName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    this.frmStorerGroup.markAllAsTouched();
    if (!this.frmStorerGroup.invalid) {
      var formData: StorerGroup = this.frmStorerGroup.getRawValue();
      formData.details = this.getDetailFromGrid();
      formData.footer = this.footer;
      this.validate(formData);
      if (this.errors.length > 0) {
        return;
      }
      else {
        this.svcWaitDlg.open({});
        this.svcStorerGroup.save(formData).subscribe(
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
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    sessionStorage.removeItem("lstStorer");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goStorerGroup = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

  colStorerGroup = [
    {
      headerName: 'Storer associated with this Group',
      children: [
        {
          headerName: "Storer Key", field: "storerKey", valueFormatter: agGridHelper.getStorerKey, width: 415,
          cellEditor: agGridHelper.getAgilitySelect(), cellEditorParams: { source: 'StorerKey', class: "415" }
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddLine  () {
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
  };

  onDeleteLine  () {
    try {
      if (this.goStorerGroup.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goStorerGroup.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goStorerGroup.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getDetailFromGrid() {
    let rowData = [];
    this.goStorerGroup.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcStorerGroup.get(id).subscribe(
        sg => {
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
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcStorerGroup.getLookup().subscribe(
        data => {
          sessionStorage.setItem("lstStorer", JSON.stringify(data.lstStorer));
        },
        error => {
          this.svcToaster.showFailure(error);
        },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(sg: StorerGroup) {
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
      var valueArr = sg.details.filter(x => !x.delete).map(function (item) { return item.storerKey }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Storer Key must be unique!');
          i = valueArr.length;
        }
      }
    }
  }

  private initForm() {
    this.frmStorerGroup.reset();
    this.frmStorerGroup.disable();
    this.errors = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.storerData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
