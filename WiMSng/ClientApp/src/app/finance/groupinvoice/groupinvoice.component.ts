import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { GroupInvoice } from './groupinvoice';
import { GroupInvoiceService } from './groupinvoice.service';
import { GroupInvoiceDetail } from './groupinvoicedetail';

@Component({
  selector: 'app-groupinvoice',
  templateUrl: './groupinvoice.component.html',
  styleUrls: ['./groupinvoice.component.css']
})

export class GroupInvoiceComponent implements OnInit {
  //#region form variables
  public goGroupInvoice: GridOptions;
  readonly optionName: string = 'Group Invoice';
  readonly colSearch =
    [
      { headerName: 'Invoice #', field: 'invoiceNo',  },
      { headerName: 'Invoice Date', field: 'invoiceDate' },
      { headerName: 'Store Group', field: 'storerGroupName' },
      { headerName: 'Profit Center', field: 'pcName' },
    ];
  frmGroupInvoice: any;
  groupInvoiceData: GroupInvoiceDetail[];
  lstStorerGroup: any;
  lstProfitCenter: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = agFormHelper.addDays(-30);
  maxDate = new Date();
  @ViewChild('storerGroupId', { static: true }) storerGroupId: MatSelect;
  @ViewChild('groupInvoiceNo', { static: true }) groupInvoiceNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcGroupInvoice: GroupInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    try {
      this.svcWaitDlg.open({});
      this.loadLookup();
      this.initGrid();
    }
    catch (ex) { svcToaster.showFailure(ex.message); }
    finally { this.svcWaitDlg.close();}
  }

  ngOnInit() {
    this.frmGroupInvoice = this.formbulider.group({
      groupInvoiceNo: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]], 
      storerGroupId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],
      groupInvoiceId: [null],
    });     
    this.frmGroupInvoice.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);   
   (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true; 
  }

  //#region toolbar functions
  tbAdd() {
    this.frmGroupInvoice.reset();
    this.frmGroupInvoice.enable();
    this.frmGroupInvoice.controls.groupInvoiceNo.disable();
    this.frmGroupInvoice.patchValue({ invoiceDate: new Date() });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = false;
    this.storerGroupId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmGroupInvoice.controls.groupInvoiceNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.groupInvoiceNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcGroupInvoice.getGroupInvoices().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Group Invoice", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.invoiceNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }
 
  tbEdit() {
    this.frmGroupInvoice.enable();
    this.frmGroupInvoice.controls.groupInvoiceNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true;
    this.frmGroupInvoice.controls.storerGroupId.disable();
    this.frmGroupInvoice.controls.whId.disable();
    this.storerGroupId.focus();
  }

  tbLoad() {
    try {
      this.frmGroupInvoice.markAllAsTouched();
      const gi = this.frmGroupInvoice.getRawValue();
      if (!gi.storerGroupId || !gi.pcId) {
        this.svcToaster.showFailure('Please select valid Storer Group and Profit Center before hitting Load button to load relevant invoices for grouping');
        return;
      }
      this.svcWaitDlg.open({});
      this.svcGroupInvoice.load(gi.storerGroupId, gi.pcId).subscribe(data => {
        if (data.length != 0) {
          this.groupInvoiceData = data;
          (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true;
          this.frmGroupInvoice.controls.storerGroupId.disable();
          this.frmGroupInvoice.controls.pcId.disable();
        }
        else { this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  tbSave() {
    try {
      this.frmGroupInvoice.markAllAsTouched();
      if (!this.frmGroupInvoice.invalid) {
        var formData: GroupInvoice = this.frmGroupInvoice.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcGroupInvoice.save(formData).subscribe(
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
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goGroupInvoice = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true
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
    };
  }

  colGroupInvoice = [
    {
      headerName: 'Invoices',
      children: [
        {
          headerName: 'S', field: 'selected', width: 70, editable: false, headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
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
          headerName: "Invoice #", field: "invoiceNo", width: 100
        },
        {
          headerName: "Invoice Date", field: "invoiceDate", width: 100
        },
        {
          headerName: "Invoice Type", field: "workFlowName", width: 140
        },
        {
          headerName: "Invoice Amount", field: "invoiceAmount", width: 120,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "id", field: "invoiceId", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  getDetailFromGrid() {
    let rowData = [];
    this.goGroupInvoice.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcGroupInvoice.get(Id).subscribe(
        gi => {
          if (gi) {
            this.frmGroupInvoice.disable();
            this.frmGroupInvoice.controls['groupInvoiceNo'].setValue(gi.groupInvoiceNo);
            this.frmGroupInvoice.controls['invoiceDate'].setValue((gi.invoiceDate));
            this.frmGroupInvoice.controls['storerGroupId'].setValue(gi.storerGroupId);
            this.frmGroupInvoice.controls['pcId'].setValue(gi.pcId);
            this.groupInvoiceData = gi.details;
            this.footer = gi.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
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
      this.svcGroupInvoice.getLookup().subscribe(
        data => {
          this.lstStorerGroup = data.lstStorerGroup;
          this.lstProfitCenter = data.lstProfitCenter;
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(gi: GroupInvoice) {
    this.errors = [];
    if (gi.groupInvoiceNo) {
      this.errors.push('No further changes can be made to this Group Invoice at this stage');
    }
    if (gi.details.filter(x => x.selected).length < 2) {
      this.errors.push('Atleast 2 invoices must be selected to create group invoice');
    }
  }

  private initForm() {
    this.frmGroupInvoice.reset();
    this.frmGroupInvoice.disable();
    this.errors = [];
    this.footer = new agFooter();    
    this.groupInvoiceData = [];
    this.frmGroupInvoice.patchValue({ invoiceDate: new Date() });    
    (<HTMLInputElement>document.getElementById("btnLoad")).disabled = true;
  }
  //#endregion local functions
}
