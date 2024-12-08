import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { RateSheetService } from './ratesheet.service';
import { RateSheet_Accessorial } from './ratesheet_accessorial';
import { RateSheet_Handling } from './ratesheet_handling';
import { RateSheet_Handling_ContainerType } from './ratesheet_handling_containertype';
import { RateSheet_Handling_SKU } from './ratesheet_handling_sku';
import { RateSheet_ProjectRemarks } from './ratesheet_projectremarks';
import { RateSheet_Storage } from './ratesheet_storage';
import { RateSheet_Storage_ExLoc } from './ratesheet_storage_exloc';
import { RateSheet_Storage_LocCategory } from './ratesheet_storage_loccategory';

@Component({
  selector: 'app-ratesheet',
  templateUrl: './ratesheet.component.html',
  styleUrls: ['./ratesheet.component.css']
})

export class RateSheetComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Rate Sheet';
  frmRateSheet: any;
  public goStorage: GridOptions;
  public goExemptLoc: GridOptions;
  public goStorageLoc: GridOptions;
  public goHandling: GridOptions;
  public goHandlingContainer: GridOptions;
  public goHandlingSKU: GridOptions;
  public goFixed: GridOptions;
  public goVariable: GridOptions;
  public goRemarks: GridOptions;
  readonly colSearch =
    [
      { headerName: 'Rate Sheet #', field: 'rateSheetId'},
      { headerName: 'Storer Group', field: 'storerGroupName' },
      { headerName: 'Profit Center', field: 'pcName' },
      { headerName: 'Active?', field: 'isActive' },
    ];
  storageData: RateSheet_Storage[];
  handlingData: RateSheet_Handling[];
  remarksData: RateSheet_ProjectRemarks[];
  fixedData: RateSheet_Accessorial[];
  variableData: RateSheet_Accessorial[];
  exemptLocData: RateSheet_Storage_ExLoc[];
  storageLocData: RateSheet_Storage_LocCategory[];
  handlingSKUData: RateSheet_Handling_SKU[];
  handlingContainerData: RateSheet_Handling_ContainerType[];
  selectedStorageNodeId: number = -1;
  selectedHandlingNodeId: number = -1;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  viewOption: any;
  containerHidden: boolean = true;
  skuHidden: boolean = true;
  @ViewChild('ratesheetId', { static: true }) ratesheetId: ElementRef;
  //#endregion
  
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcRateSheet: RateSheetService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {  
    this.initGrid();
  }

  ngOnInit() {
    this.frmRateSheet = this.formbulider.group({  
      rateSheetId: [null],    
      storerGroupName: [null],
      pcName: [null],
      kamName: [null],
      calendarName: [null],
      minInvAmount: [null],
      expiryDate: [null],
      isActive: [null],       
    });  
    this.frmRateSheet.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbRecall() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.frmRateSheet.controls.rateSheetId.enable();
    this.ratesheetId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRateSheet.getRateSheets().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Rate Sheet", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.rateSheetId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmRateSheet.enable();
    this.frmRateSheet.controls.rateSheetId.disable();
    this.frmRateSheet.controls.isActive.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridStatus(true);   
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
    this.goStorage = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'blue' };
        }
      },
      onCellEditingStarted: function (event) {
        if (event.rowPinned)
          event.api.stopEditing();
      },
    };

    this.goStorageLoc = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
    };

    this.goHandling = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'blue' };
        }
      },
      onCellEditingStarted: function (event) {
        if (event.rowPinned)
          event.api.stopEditing();
      },
    };

    this.goHandlingContainer = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
    };

    this.goHandlingSKU = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
    };

    this.goRemarks = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },   
      rowSelection: 'single',
    };

    this.goFixed = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
    };

    this.goVariable = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
    };

    this.goExemptLoc = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true
      },
      rowSelection: 'single',
    };
  }

  colStorage = [
    {
      headerName: 'Storage Rate',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date",
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date",
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Type", field: "stName", width: 150
        },
        {
          headerName: "Unit", field: "suName", width: 90
        },
        {
          headerName: "Period", field: "periodTypeName", width: 60
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Overtime", field: "otRate", type: "numericColumn", width: 75, headerTooltip: "Over Time Rate",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Fix Sq Ft", field: "fixedSqFt", type: "numericColumn", width: 70,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Min Vol.", field: "minVolume", type: "numericColumn", width: 70,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Min Amt.", field: "minAmount", type: "numericColumn", width: 75,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: 'Print?', field: 'isVisible', width: 55, editable: false, headerTooltip: "Print Fixed Sq Ft for this row on Invoice?",
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
          headerName: 'Step Chgs', field: 'stepCharges', width: 65, editable: false, headerTooltip: "Setp Charges Applicable?",
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

  colStorageLoc = [
    {
      headerName: 'Storage Location',
      children: [        
        { headerName: "Location Category", field: "lcName", width: 200 },
        {
          headerName: 'UPP', field: 'upp', width: 50, editable: false, headerTooltip: "Calculate Pallets through Packkey for this Location Category?",
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

  colHandling = [
    {
      headerName: 'Handling Rate',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry date for this Rate",
          valueFormatter: agGridHelper.dateFormatter
        },
        { headerName: "Type", field: "htName", width: 100 },
        { headerName: "Unit", field: "huName", width: 110 },
        
        {
          headerName: "Rate", field: "rate", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Sunday", field: "sundayRate", type: "numericColumn", headerTooltip: "Sunday Handling Rate",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 65,
        },
        {
          headerName: "Holiday", field: "holidayRate", type: "numericColumn", headerTooltip: "Gazetted Holiday Handling Rate",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 75,
        },
        {
          headerName: "Min Vol", field: "minVolume", type: "numericColumn", headerTooltip: "Minimum chargeable units for this activity",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 70,
        },
        {
          headerName: "Min Amt", field: "minAmount", type: "numericColumn", headerTooltip: "Minimum chargeable amount for the activity",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 75,
        },
        { headerName: "L.Unit", field: "looseUnitName", width: 80 },
        {
          headerName: "L.Rate", field: "looseRate", type: "numericColumn", headerTooltip: "Rate per unit for loose unit handling",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 80,
        },
        {
          headerName: 'Uq.Plt', field: 'uniquePalletCount', width: 80, editable: false, headerTooltip: "Count only unique pallet numbers",
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

  colHandlingContainer = [
    {
      headerName: 'Container Capacity-wise Rate',
      children: [        
        { headerName: "Container Capacity", field: "containerTypeName", width: 180 },
        {
          headerName: "Rate", field: "rate", type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 80,
        },
      ]
    }    
  ];

  colHandlingSKU = [
    {
      headerName: 'SKU Minimum Unit(s)',
      children: [
        { headerName: "SKU", field: "skuCode", width: 180 },
        {
          headerName: "Min Unit", field: "minUnit", type: "numericColumn", width: 70,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
      ]
    }    
  ];

  colFixed = [
    {
      headerName: 'Fixed Accessorial Charges',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date for this Rate",
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Charge", field: "chargeName", width: 220
        },
        {
          headerName: "Qty", field: "qty", type: "numericColumn", width: 100,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Rate/Unit", field: "rate", type: "numericColumn", width: 100,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
      ]
    }    
  ];

  colVariable = [
    {
      headerName: 'Variable Accessorial Charges',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date for this Rate",
          valueFormatter: agGridHelper.dateFormatter
        },
        { headerName: "Charge", field: "chargeName", width: 220 },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", width: 100, headerTooltip: "Rate / Unit (Quantity)",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
      ]
    }  
  ];

  colRemarks = [
    {
      headerName: 'Project & Remarks Default',
      children: [
        { headerName: "Invoice Type", field: "workFlowName", width: 150 },
        { headerName: "Title", field: "projectTitle", width: 250, cellEditor: "agLargeTextCellEditor" },
        { headerName: "Project Name", field: "projectName", width: 250, cellEditor: "agLargeTextCellEditor" },
        { headerName: "Remarks", field: "remarks", width: 250, cellEditor: "agLargeTextCellEditor" },
        {
          headerName: "GST %", field: "gstRate", type: "numericColumn", width: 60,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
      ]
    }
  ];

  colExemptLoc = [
    {
      headerName: 'Exempted Location Categories',
      children: [        
        { headerName: "Location Category", field: "lcName", width: 225 },
      ]
    }    
  ];

  validateGridStatus() {
    var rd = (document.querySelector('[id="btnRecall"]')['disabled'] == true &&
      document.querySelector('[id="btnEdit"]')['disabled'] == true &&
      document.querySelector('[id="btnUndo"]')['disabled'] == false);
    agFormHelper.setGridStatus(rd);
  }
  //#endregion

  //#region local functions
   get(id: number) {
    this.svcWaitDlg.open({});
     try {
       this.svcRateSheet.get(id).subscribe(
        rs => {
          if (rs) {
            this.frmRateSheet.disable();
            this.frmRateSheet.controls['rateSheetId'].setValue(rs.rateSheetId);
            this.frmRateSheet.controls['storerGroupName'].setValue(rs.storerGroupName);
            this.frmRateSheet.controls['pcName'].setValue(rs.pcName);
            this.frmRateSheet.controls['kamName'].setValue(rs.kamName);
            this.frmRateSheet.controls['expiryDate'].setValue((rs.expiryDate));
            this.frmRateSheet.controls['calendarName'].setValue(rs.calendarName);
            this.frmRateSheet.controls['minInvAmount'].setValue(rs.minInvAmount);
            this.frmRateSheet.controls['isActive'].setValue(rs.isActive);
            this.storageData = rs.storage;
            this.handlingData = rs.handling;
            this.remarksData = rs.projectRemarks;
            this.exemptLocData = rs.exemptedSL;
            this.fixedData = rs.fixedAccessorial;
            this.variableData = rs.variableAccessorial;
            this.footer = rs.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }
 
  showLCInfo(row) {
    this.storageLocData = this.goStorage.api.getRowNode(row.node.id).data.locationCategory;
  }

  showContainerInfo(row) {
    this.handlingContainerData = this.goHandling.api.getRowNode(row.node.id).data.containerRate;
  }

  showSKUInfo(row) {
    this.handlingSKUData = this.goHandling.api.getRowNode(row.node.id).data.skUs;
  }

  onHandlingRowSelected(event) {
    if (event.node.selected) {
      if (event.node.data.huName === "Container Type") {
        this.showContainerInfo(event);
        this.containerHidden = false;
        this.skuHidden = true;
      }
      else if (event.node.data.huName === "SKU (Pallet)") {
        this.showSKUInfo(event);
        this.containerHidden = true;
        this.skuHidden = false;
      }
      else {
        this.containerHidden = true;
        this.skuHidden = true;
      }
    }
  }

  onStorageRowSelected(event) {
    if (event.node.selected) {
        this.showLCInfo(event);       
      }
  }

  private initForm() {
    this.frmRateSheet.reset();
    this.frmRateSheet.disable();
    this.errors = [];
    this.footer = new agFooter();
    agFormHelper.setGridStatus(false);
    this.selectedStorageNodeId = -1;
    this.selectedHandlingNodeId = -1;
    this.storageData = [];
    this.storageLocData = [];
    this.exemptLocData = [];
    this.handlingData = [];
    this.handlingContainerData = [];
    this.handlingSKUData = [];
    this.fixedData = [];
    this.variableData = []
    this.remarksData = [];
    this.containerHidden = true;
    this.skuHidden = true;   
  }
  //#endregion local functions
}
