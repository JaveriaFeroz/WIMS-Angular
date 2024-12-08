import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { CPTemplate } from './cptemplate';
import { CPTemplateService } from './cptemplate.service';
import { CPTemplateDetail } from './cptemplatedetail';

@Component({
  selector: 'app-mecptemplate',
  templateUrl: './cptemplate.component.html',
  styleUrls: ['./cptemplate.component.css']
})

export class CPTemplateComponent implements OnInit {
  //#region form variables
  public goCPTemplate: GridOptions;
  readonly optionName: string = 'Cost Provision Template';
  frmCPtemplate: any;
  cpTemplateData: CPTemplateDetail[];
  //lstWarehouse: any;
  lstProfitCenter: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('pcId', { static: true }) pcId: MatSelect;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcCPTemplate: CPTemplateService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    sessionStorage.removeItem("lstSupplier");
    sessionStorage.removeItem("lstCostHead");
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmCPtemplate = this.formbulider.group({
      //whId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],  
    });
    this.frmCPtemplate.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  //tbAdd() {
  //  this.frmCPtemplate.reset();
  //  this.frmCPtemplate.enable();
  //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
  //  agFormHelper.setGridToolbar(true);
  //  agFormHelper.setGridStatus(true);
  //}

  tbRecall() {
    this.initForm();
    //this.frmCPtemplate.controls.whId.enable();
    this.frmCPtemplate.controls.pcId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.pcId.focus({});
  }

  tbEdit() {
    this.frmCPtemplate.enable();
    //this.frmCPtemplate.controls.whId.disable();
    this.frmCPtemplate.controls.pcId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);       
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmCPtemplate.markAllAsTouched();
      if (!this.frmCPtemplate.invalid) {
        var formData: CPTemplate = this.frmCPtemplate.getRawValue();
        formData.details = this.getGFDataFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcCPTemplate.save(formData).subscribe(
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
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }   

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    sessionStorage.removeItem("lstSupplier");
    sessionStorage.removeItem("lstCostHead");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goCPTemplate = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true       
      },
      rowSelection: 'multiple',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "costHeadId") {
          if (params.data.costHeadId != "") {
            params.node.setDataValue("costHeadId", parseInt(params.data.costHeadId));
          }
          else {
            params.node.setDataValue("costHeadId", null);
          }
        }
        if (params.colDef.field == "supplierId") {
          if (params.data.supplierId != "") {
            params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
          }
          else {
            params.node.setDataValue("supplierId", null);
          }
        }
      },
    };
  }

  colCPTemplate = [
    {
      headerName: 'Cost Provision Template',
      children: [
        {
          headerName: "Cost Head", field: "costHeadId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'CostHead', class: "220" }, valueFormatter: agGridHelper.getCostHead, width: 220
        },
        {
          headerName: "Supplier", field: "supplierId", cellEditor: agGridHelper.getAgilitySelect(), editable: true,
          cellEditorParams: { source: 'Supplier', class: "220" }, valueFormatter: agGridHelper.getSupplier, width: 220
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddLine = function () {
    try {
      var res = this.goCPTemplate.api.applyTransaction({
        add: [{
          costHeadId: null, supplierId: null, add: true, edit: false, delete: false
        }]
      });
      this.goCPTemplate.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "costHeadId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine = function () {
    try {
      if (this.goDocs.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDocs.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goCPTemplate.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getGFDataFromGrid() {
    let rowData = [];
    this.goCPTemplate.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(pcId?: number) {
    const cpt = this.frmCPtemplate.getRawValue();
    //let whId = cpt.whId;
    //let pcId = cpt.pcId;
    //if (whId && pcId) {
    if (pcId)
      this.svcWaitDlg.open({});
    try {
      this.svcCPTemplate.get(pcId).subscribe(
        cptemplate => {
          if (cptemplate) {
            this.frmCPtemplate.disable();
            //this.frmCPtemplate.controls['whId'].setValue(whId);
            this.frmCPtemplate.controls['pcId'].setValue(pcId);
            this.cpTemplateData = cptemplate.details;
            this.footer = cptemplate.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcCPTemplate.getLookup().subscribe(
        data => {
          //this.lstWarehouse = data.lstWarehouse;
          this.lstProfitCenter = data.lstProfitCenter;
          sessionStorage.setItem("lstCostHead", JSON.stringify(data.lstCostHead));
          sessionStorage.setItem("lstSupplier", JSON.stringify(data.lstSupplier));
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  //onKeyChange() {
  //  this.get();
  //}

  private validate(cp: CPTemplate) {
    this.errors = [];
    if (Object.keys(cp.details.filter(x => !x.delete)).length == 0) {
      this.errors.push('Atleast one entry must exist in CPTemplate Transaction to perform save operation');
    }
    if (cp.details.some(x => !x.delete && !x.costHeadId)) {
      this.errors.push('No row can contain empty Cost Head');
    }
    if (cp.details.some(x => !x.delete && !x.supplierId)) {
      this.errors.push('No row can contain empty Supplier');
    }

    if (cp.details.filter(x => !x.delete).length > 0) {
      var detDuplicate = cp.details.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, costHeadId: item.costHeadId })).slice().sort();
      for (var i = 0; i < detDuplicate.length - 1; i++) {
        if (detDuplicate[i + 1]['supplierId'] === detDuplicate[i]['supplierId']) {
          if (detDuplicate[i + 1]['costHeadId'] === detDuplicate[i]['costHeadId']) {
            this.errors.push('The combination of Cost Head & Supplier must be unique!');
            i = detDuplicate.length;
          }
        }
      }
    }
  }

  private initForm() {
    this.frmCPtemplate.reset();
    this.frmCPtemplate.disable();
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.errors = [];
    this.cpTemplateData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
