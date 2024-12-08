import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { forkJoin } from 'rxjs';
//import { isNumber } from 'util';
import { RecipientService } from '../../common/recipient/recipient.service';
import { agEnum } from '../../helper/agEnum';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { FormSubmissionDialogService } from '../../helper/formsubmissionDialog/formsubmission-dialog.service';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { Submission } from '../../helper/submission';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { WF_RateSheet } from './wf_ratesheet';
import { WFRateSheetService } from './wf_ratesheet.service';
import { WF_RateSheet_Accessorial } from './wf_ratesheet_accessorial';
import { WF_RateSheet_Handling } from './wf_ratesheet_handling';
import { WF_RateSheet_Handling_ContainerType } from './wf_ratesheet_handling_containertype';
import { WF_RateSheet_Handling_SKU } from './wf_ratesheet_handling_sku';
import { WF_RateSheet_ProjectRemarks } from './wf_ratesheet_projectremarks';
import { WF_RateSheet_Storage } from './wf_ratesheet_storage';
import { WF_RateSheet_Storage_ExLoc } from './wf_ratesheet_storage_exloc';
import { WF_RateSheet_Storage_LocCategory } from './wf_ratesheet_storage_loccategory';

@Component({
  selector: 'app-wfratesheet',
  templateUrl: './wf_ratesheet.component.html',
  styleUrls: ['./wf_ratesheet.component.css']
})

export class WF_RateSheetComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Client Rate Setup Request';
  frmWFRateSheet: any;
  myForm: boolean = false;
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
      { headerName: 'Form Id', field: 'formId'},
      { headerName: 'Storer Group', field: 'storerGroupName' },
      { headerName: 'Profit Center', field: 'pcName' },
      { headerName: 'Status', field: 'stateName' },
    ];
  storageData: WF_RateSheet_Storage[];
  handlingData: WF_RateSheet_Handling[];
  remarksData: WF_RateSheet_ProjectRemarks[];
  fixedData: WF_RateSheet_Accessorial[];
  variableData: WF_RateSheet_Accessorial[];
  exemptLocData: WF_RateSheet_Storage_ExLoc[];
  storageLocData: WF_RateSheet_Storage_LocCategory[];
  handlingSKUData: WF_RateSheet_Handling_SKU[];
  handlingContainerData: WF_RateSheet_Handling_ContainerType[];
  lstStorerGroup: any;
  lstProfitCenter: any;
  lstInvCalendar: any;
  lstKAM: any;
  selectedStorageNodeId: number = -1;;
  selectedHandlingNodeId: number = -1;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = agFormHelper.addDays(0);
  maxDate = agFormHelper.addDays(730);
  currentUserId: string = this.svcAuth.getUserId();
  viewOption: any;
  isDisabled = true;
  containerHidden: boolean = true;
  skuHidden: boolean = true;
  frameworkComponents = { agDateEditor: agGridDateEditor }
  oldExpiryDate: any;
  oldMinAmount: any;
  oldKamId: any;
  oldInvCalendarId: any;
  oldRateSheetActive: any;
  submissionButtonsStatus = "";
  @ViewChild('storerGroupId', { static: true }) storerGroupId: MatSelect;
  @ViewChild('formId', { static: true }) formId: ElementRef;
  @ViewChild('btnEdit', { static: true }) btnEdit: HTMLButtonElement;
  targetNode: HTMLElement;
  config = { childList: true, subtree: true, attributes: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (
          !(<HTMLInputElement>document.getElementById('btnEdit')).disabled || !(<HTMLInputElement>document.getElementById('btnExit')).disabled)) { mutation.addedNodes[0].disabled = true; }
      }
    }
  };
  observer = new MutationObserver(this.callback);
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcToaster: agToasterService,
    private svcWFRateSheet: WFRateSheetService, private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService,
    private route: ActivatedRoute, private svcHistoryDlg: HistoryDialogService, private svcRecipient: RecipientService,
    private svcFormSubmission: FormSubmissionDialogService, private svcAuth: AuthService) {
    this.loadLookup();
    this.initGrid();
    var _formId = (this.route.snapshot.queryParamMap.get("formId"));
    if (_formId != null) {
      this.get(parseInt(_formId))
      this.myForm = true;
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngOnInit() {
    this.frmWFRateSheet = this.formbulider.group({
      formId: [null],
      storerGroupId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],
      kamId: [null, [Validators.required]],
      calendarId: [null, [Validators.required]],
      minInvAmount: [null],
      expiryDate: [null, [Validators.required]],
      isActive: [null],
      stateId: [null],
      stateName: [null],
      owner: [null],
      completed: [null],
      showLC: [null],
      showContainer: [null],
      showSKU: [null],
    });   
    this.frmWFRateSheet.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);    
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);    
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.targetNode = document.getElementById('divSave');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmWFRateSheet.reset();
    this.frmWFRateSheet.enable();
    this.frmWFRateSheet.controls.formId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmWFRateSheet.patchValue({
      stateId: 0, stateName: "New", completed: false, owner: this.currentUserId, isActive: true,
      showLC: false, showContainer: false, showHSKU: false, minInvAmount: 0  });
    this.footer.createdBy = this.svcAuth.getUserId();
    this.containerHidden = true;
    this.skuHidden = true;
    this.oldExpiryDate = null;
    this.storerGroupId.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.setActionBarVisibility(agFormMode.Initialize);
  }

  tbRecall() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.frmWFRateSheet.controls.formId.enable();
    this.formId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWFRateSheet.getRateSheets().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Rate Setup", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.formId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmWFRateSheet.controls.storerGroupId.disable();
    this.frmWFRateSheet.controls.pcId.disable();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.setActionBarVisibility(agFormMode.Edit);
  }

  tbSave() {
    try {
      this.frmWFRateSheet.markAllAsTouched();
      if (!this.frmWFRateSheet.invalid) {
        var formData: WF_RateSheet = this.frmWFRateSheet.getRawValue();
        if (this.selectedStorageNodeId != -1) {
          var stNode = this.goStorage.api.getRowNode(this.selectedStorageNodeId.toString());
          var stRow = stNode.data;
          stRow.locationCategory = this.getRSLDataFromGrid();
          stNode.setData(stRow);
        }
        if (this.selectedHandlingNodeId != -1) {
          var hdlgNode = this.goHandling.api.getRowNode(this.selectedHandlingNodeId.toString());
          var hdlgRow = hdlgNode.data;
          hdlgRow.containerRates = this.getRHCDataFromGrid();
          hdlgRow.skUs = this.getRHSDataFromGrid();
          if (hdlgRow.containerRates.some(x => x.add || x.edit || x.delete) ||
            hdlgRow.skUs.some(y => y.add || y.edit || y.delete)) {
            if (!hdlgRow.delete) {
              if (!hdlgRow.add)
                hdlgRow.edit = true;
            }
          }
          hdlgNode.setData(hdlgRow);
        }
        formData.storage = this.getStorageDataFromGrid();
        formData.exemptedSL = this.getExemptLocationDataFromGrid();
        formData.handling = this.getHandlingDataFromGrid();
        formData.fixedAccessorial = this.getFixedDataFromGrid();
        formData.variableAccessorial = this.getVariableDataFromGrid();
        formData.projectRemarks = this.getRemarksDataFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcWFRateSheet.save(formData).subscribe(
            result => {
              this.svcToaster.showSuccess('Client Rate Setup Request # ' + result.formId +
                ' saved successfully. Click Submit to proceed this request for further Approval!');
              agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
              this.get(result.formId);
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
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else {
      this.initForm();
      agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
  }

  tbExit() {
    this.initForm();
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else
      this.router.navigate(['/MainForm']);
  }

  tbHistory(formId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(agEnum.WorkFlow.WFRateSetup, formId).subscribe(r => {
        this.svcHistoryDlg.open("Client Rate Setup Request - " + formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions

  //#region form submission
  tbFormSubmission(formId: number, stateId: number) {
    this.svcWaitDlg.open({});
    let recipients, nextStateId: number, sub: Submission = new Submission();
      return new Promise((resolve, reject) => {
        try {
        if (stateId == 2 || stateId == 5) {
          recipients = this.svcRecipient.getRateSheetRecipients(formId, stateId);
        }
        else if (stateId == 3 || stateId == 4 || stateId == 99) {
          recipients = this.svcRecipient.getCreator(agEnum.WorkFlow.WFRateSetup, formId);
        }
        forkJoin([recipients]).subscribe(results => {
          var data = results[0];
          recipients = data["recipient"];
          if (stateId == 4 || stateId == 99) {
            nextStateId = stateId;
          }
          else {
            nextStateId = data["nextStateId"];
          }
          if (recipients === undefined || recipients.length == 0) {
            this.svcToaster.showWarning("No submission user is configured for selected Form State." +
              "Submission process can not be executed while submission users are missing" +
              "Please raise Service Request through eForms if you require any support from IT Department");
            this.svcWaitDlg.close();
            return;
          }
          else {
            this.svcFormSubmission.open(agEnum.getRateState(nextStateId) + " - RateSheet # " + this.frmWFRateSheet.controls.formId.value,
              agEnum.getRateState(nextStateId), recipients);
            this.svcFormSubmission.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  sub.formId = formId;
                  sub.comments = r.submissionComments;
                  sub.owner = r.recipientId;
                  sub.stateId = nextStateId;
                  this.submit(sub);
                }
                else {
                  this.svcToaster.showWarning("No recipient selected. Please select valid recipient to proceed with onward submission.");
                  return;
                }
              }
            },
              error => { this.svcToaster.showFailure(error); },
              () => { this.svcWaitDlg.close(); this.svcFormSubmission.close(); }
            );
          }
        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
          resolve(true);
        }
        catch (e) { this.svcToaster.showFailure(e); this.svcWaitDlg.close(); reject(e); }
      });
  }

  private submit(sn: Submission) {
    if (sn.stateId == 3) {
      sn.completed = true;
      sn.approved = true;
    }
    else if (sn.stateId == 4 || sn.stateId == 99 )
    {
      sn.completed = true;
      sn.rejected = true;
      sn.approved = false;
    }
    else {
      sn.completed = false;
    }
    this.svcWaitDlg.open({});
    this.svcWFRateSheet.submit(sn).subscribe(
      () => {
        this.svcToaster.showSuccess('Client Rate Setup Request # ' + sn.formId +
          ' was successfully submitted to ' + sn.owner + (sn.comments == "" ? " with no comments " : " with the comments " + sn.comments))
        this.tbUndo();
      },
      error => { this.svcToaster.showFailure(error); },
      () => { this.svcWaitDlg.close(); }
    );
  }
  //#endregion form submission

  //#region grid setup
  initGrid() {
    this.goStorage = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true        
      },
      rowSelection: 'single',
       onCellClicked: function (event) {
        if (event.colDef.field == "stepCharges") {
          if (!event.data.stepCharges) {
            event.node.setDataValue('stepCharges', true);
          }
          else {
            event.node.setDataValue('stepCharges', false);
          }
        }
        if (event.colDef.field == "isVisible") {
          if (!event.data.isVisible) {
            event.node.setDataValue('isVisible', true);
          }
          else {
            event.node.setDataValue('isVisible', false);
          }
        }
      },
      //onCellValueChanged: function (params) {        
      //  if (params.data.storageRateId != 0)
      //    params.data.edit = true;
      //  if (params.data.storageRateId == 0)
      //    params.data.add = true;
      //  params.data.noChange = false;
      //  if (params.colDef.field == "suId") {
      //    if (params.data.suId != "") {
      //      params.node.setDataValue("suId", parseInt(params.data.suId));
      //    }
      //    else {
      //      params.node.setDataValue("suId", null);
      //    }
      //  }
      //  if (params.colDef.field == "stId") {
      //    if (params.data.stId != "") {
      //      params.node.setDataValue("stId", parseInt(params.data.stId));
      //    }
      //    else {
      //      params.node.setDataValue("stId", null);
      //    }
      //  }
      //  if (params.colDef.field == "periodTypeId") {
      //    if (params.data.periodTypeId != "") {
      //      params.node.setDataValue("periodTypeId", parseInt(params.data.periodTypeId));
      //    }
      //    else {
      //      params.node.setDataValue("periodTypeId", null);
      //    }
      //  }
      //},
      //onCellEditingStarted: function (event) {
      //  if (event.rowPinned)
      //    event.api.stopEditing();
      //},
      //getRowStyle: function (params) {
      //  if (params.node.rowPinned) {
      //    return { 'font-weight': 'bold', 'color': 'blue' };
      //  }
      //},
    };

    this.goStorageLoc = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellClicked: function (event) {
        if (event.colDef.field == "upp") {
          if (!event.data.upp) {
            event.node.setDataValue('upp', true);
          }
          else {
            event.node.setDataValue('upp', false);
          }
        }
      },     
      //onCellEditingStarted: function (event) {
      //  if (event.rowPinned)
      //    event.api.stopEditing();
      //},
    };

    this.goHandling = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellClicked: function (event) {
        if (event.colDef.field == "uniquePalletCount") {
          if (!event.data.uniquePalletCount) {
            event.node.setDataValue('uniquePalletCount', true);
          }
          else {
            event.node.setDataValue('uniquePalletCount', false);
          }
        }
      },
      //onCellValueChanged: function (params) {
      //  if (params.data.handlingRateId != 0)
      //    params.data.edit = true;
      //  if (params.data.handlingRateId == 0)
      //    params.data.add = true;
      //  params.data.noChange = false;       
      //  if (params.colDef.field == "htId") {
      //    if (params.data.htId != "") {
      //      params.node.setDataValue("htId", parseInt(params.data.htId));
      //    }
      //    else {
      //      params.node.setDataValue("htId", null);
      //    }
      //  }
       
      //  if (params.colDef.field == "huId") {
      //    if (params.data.huId != "") {
      //      params.node.setDataValue("huId", parseInt(params.data.huId));
      //    }
      //    else {
      //      params.node.setDataValue("huId", null);
      //    }
      //  }

      //  if (params.colDef.field == "looseUnitId") {
      //    if (params.data.looseUnitId != "") {
      //      params.node.setDataValue("looseUnitId", parseInt(params.data.looseUnitId));
      //    }
      //    else {
      //      params.node.setDataValue("looseUnitId", null);
      //    }
      //  }
      //},
    //  onCellEditingStarted: function (event) {
    //    if (event.rowPinned)
    //      event.api.stopEditing();
    //  },
    //  getRowStyle: function (params) {
    //    if (params.node.rowPinned) {
    //      return { 'font-weight': 'bold', 'color': 'blue' };
    //    }
    //  },
    };

    this.goHandlingContainer = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single'
    };

    this.goHandlingSKU = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single'
    };

    this.goFixed = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {        
        if (params.data.acRateId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.acRateId == 0)
          params.data.add = true;
        if (params.colDef.field == "chargeId") {
          if (params.data.chargeId != "") {
            params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
          }
          else {
            params.node.setDataValue("chargeId", null);
          }
        }
      },
    };

    this.goVariable = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {        
        if (params.data.acRateId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.acRateId == 0)
          params.data.add = true;
        if (params.colDef.field == "chargeId") {
          if (params.data.chargeId != "") {
            params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
          }
          else {
            params.node.setDataValue("chargeId", null);
          }
        }
      },     
    };

    this.goExemptLoc = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (params.data.elId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.elId == 0)
          params.data.add = true;
        if (params.colDef.field == "lcId") {
          if (params.data.lcId != "") {
            params.node.setDataValue("lcId", parseInt(params.data.lcId));
          }
          else {
            params.node.setDataValue("lcId", null);
          }
        }
      },
    };

    this.goRemarks = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (params.data.prId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.prId == 0)
          params.data.add = true;
        if (params.colDef.field == "workFlowId") {
          if (params.data.workFlowId != "") {
            params.node.setDataValue("workFlowId", parseInt(params.data.workFlowId));
          }
          else {
            params.node.setDataValue("workFlowId", null);
          }
        }
      },
    };
  }

  //#region Storage Rate Sheet
  colStorage = [
    {
      headerName: 'Storage Rate(s)',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Type", field: "stId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'SType', class: "150" }, valueFormatter: agGridHelper.getSTypeName, width: 150
        },
        {
          headerName: "Unit", field: "suId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'SUnit', class: "110" }, valueFormatter: agGridHelper.getSUnitName, width: 110
        },
        {
          headerName: "Period", field: "periodTypeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'PeriodType', class: "60" }, valueFormatter: agGridHelper.getPeriodTypeName, width: 60
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
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddRSLine  () {
    try {
      var res = this.goStorage.api.applyTransaction({
        add: [{
          dateFrom: null, dateTo: null, stId: null, suId: null, periodTypeId: null,
          rate: 0, otRate: 0, fixedSqFt: 0, minVolume: 0, minAmount: 0,
          stepCharges: false, isVisible: false, locationCategory:[], add: true, edit: false, delete: false
        }]
      });
      this.goStorage.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "dateFrom" });   
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Storage Line');
    }
  };

  onDeleteRSLine  () {
    try {
      if (this.goStorage.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row(s)?")) {
          this.goStorage.api.getSelectedRows().forEach(x => x.delete = true  );
          agGridHelper.setGridDeleteFilter(this.goStorage.api);
          this.goStorageLoc.api.setRowData([]);
          this.selectedStorageNodeId = -1;   
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  onStorageCellValueChanged(params) {
    if (params.data.storageRateId != 0 && !params.data.add)
      params.data.edit = true;
    if (params.data.storageRateId == 0)
      params.data.add = true;
    params.data.noChange = false;
    if (params.colDef.field == "suId") {
      if (params.data.suId != "") {
        params.node.setDataValue("suId", parseInt(params.data.suId));
      }
      else {
        params.node.setDataValue("suId", null);
      }
    }
    if (params.colDef.field == "stId") {
      if (params.data.stId != "") {
        params.node.setDataValue("stId", parseInt(params.data.stId));
      }
      else {
        params.node.setDataValue("stId", null);
      }
    }
    if (params.colDef.field == "periodTypeId") {
      if (params.data.periodTypeId != "") {
        params.node.setDataValue("periodTypeId", parseInt(params.data.periodTypeId));
      }
      else {
        params.node.setDataValue("periodTypeId", null);
      }
    }
  }

  getStorageDataFromGrid() {
    let rowData = [];
    this.goStorage.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Storage Rate Sheet - Location Category Override
  colStorageLoc = [
  {
      headerName: 'Location Category Override',
      children: [
        {
          headerName: "Location Category", field: "lcId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'LocCat', class: "175" }, valueFormatter: agGridHelper.getLocCatName, width: 175
        },
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
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddRSLLine  () {
    try {
      if (this.selectedStorageNodeId !=-1) {
        var res = this.goStorageLoc.api.applyTransaction({
          add: [{
            lcId: null, upp: false, add: true, edit: false, delete: false
          }]
        });
        this.goStorageLoc.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "lcId" });
      }
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRSLLine  () {
    try {
      if (this.goStorageLoc.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row(s)?")) {
          this.goStorageLoc.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goStorageLoc.api);
        }        
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Location Category Override');
    }
  };

  getRSLDataFromGrid() {
    let rowData = [];
    if (this.goStorageLoc.api.getDisplayedRowCount() > 0)
      this.goStorageLoc.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Rate Sheet Storage - Exempted Location Categories
  colExemptLoc = [
    {
      headerName: 'Exempted Location Categories',
      children: [
        {
          headerName: "Location Category", field: "lcId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'LocCat', class: "225" }, valueFormatter: agGridHelper.getLocCatName, width: 225
        },
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddRELine() {
    try {
      var res = this.goExemptLoc.api.applyTransaction({
        add: [{ lcId: null, add: true, edit: false, delete: false }]
      });
      this.goExemptLoc.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "lcId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRELine() {
    try {
      if (this.goExemptLoc.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goExemptLoc.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goExemptLoc.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getExemptLocationDataFromGrid() {
    let rowData = [];
    this.goExemptLoc.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Handling Rate Sheet
  colHandling = [
    {
      headerName: 'Handling Rate(s)',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry date for this Rate",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Type", field: "htId", cellEditor: agGridHelper.getAgilitySelect(), headerTooltip: "Handling Type",
          cellEditorParams: { source: 'HType', class: "100" }, valueFormatter: agGridHelper.getHTypeName, width: 100
        },
        {
          headerName: "Unit", field: "huId", cellEditor: agGridHelper.getAgilitySelect(), headerTooltip: "Handling Unit",
          cellEditorParams: { source: 'HUnit', class: "110" }, valueFormatter: agGridHelper.getHUnitName, width: 110
        },
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
        {
          headerName: "L.Unit", field: "looseUnitId", cellEditor: agGridHelper.getAgilitySelect(), headerTooltip: "UoM For Loose Unit Handling",
          cellEditorParams: { source: 'LUnit', class: "80" }, valueFormatter: agGridHelper.getLUnit, width: 80
        },
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
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    } 
  ];

  onAddRHLine  () {
    try {
      var res = this.goHandling.api.applyTransaction({
        add: [{
          dateFrom: null, dateTo: null, htId: null, htuId: null,
          rate: 0, sundayRate: 0, holidayRate: 0, minVolume: 0, minAmount: 0, looseUnitId: null, looseRate: 0,
          uniquePalletCount: false, containerRates: [], skUs:[], add: true, edit: false, delete: false
        }]
      });
      this.goHandling.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "dateFrom" });
      this.selectedHandlingNodeId = res.add[0].rowIndex;
    }
    catch (exception) { this.svcToaster.showFailure(exception, 'Add Line:'); }
  };

  onDeleteRHLine  () {
    try {
      if (this.goHandling.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goHandling.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goHandling.api);
          this.goHandlingContainer.api.setRowData([]);
          this.goHandlingSKU.api.setRowData([]);          
          this.selectedHandlingNodeId = -1;
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  onHandlingCellValueChanged(params) {
    if (params.data.handlingRateId != 0 && !params.data.add)
      params.data.edit = true;
    if (params.data.handlingRateId == 0)
      params.data.add = true;
    params.data.noChange = false;
    if (params.colDef.field == "htId") {
      if (params.data.htId != "") {
        params.node.setDataValue("htId", parseInt(params.data.htId));
      }
      else {
        params.node.setDataValue("htId", null);
      }
    }
    if (params.colDef.field == "huId") {
      if (params.data.huId != "") {
        params.node.setDataValue("huId", parseInt(params.data.huId));
      }
      else {
        params.node.setDataValue("huId", null);
      }
    }
    if (params.colDef.field == "looseUnitId") {
      if (params.data.looseUnitId != "") {
        params.node.setDataValue("looseUnitId", parseInt(params.data.looseUnitId));
      }
      else {
        params.node.setDataValue("looseUnitId", null);
      }
    }
  }

  getHandlingDataFromGrid() {
    let rowData = [];
    this.goHandling.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Handling Rate Sheet - Container Capacity
  colHandlingContainer = [
    {
      headerName: 'Container Capacity-wise Rate',
      children: [
        {
          headerName: "Container Capacity", field: "containerTypeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'ContainerType', class: "180" }, valueFormatter: agGridHelper.getContainerTypeName, width: 180
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 80,
        },
        {
          headerName: "A", field: "action", width: 50, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }  
  ];

  onAddRHCLine  () {
    try {
      if (this.selectedHandlingNodeId!=-1) {
        var res = this.goHandlingContainer.api.applyTransaction({
          add: [{ containerTypeId: null, rate: 0, add: true, edit: false, delete: false }]
        });
        this.goHandlingContainer.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "containerTypeId" });
      }   
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Container Capacity');
    }
  };

  onDeleteRHCLine  () {
    try {
      if (this.goHandlingContainer.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goHandlingContainer.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goHandlingContainer.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getRHCDataFromGrid() {
    let rowData = [];
    this.goHandlingContainer.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Handling Rate Sheet - SKU
  colHandlingSKU = [
    {
      headerName: 'SKU Minimum Unit(s)',
      children: [
        {
          headerName: "SKU", field: "skuCode", width: 180
        },
        {
          headerName: "Min Unit", field: "minUnit", type: "numericColumn", width: 70,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddRHSLine  () {
    try {
      if (this.selectedHandlingNodeId != -1) {
        var res = this.goHandlingSKU.api.applyTransaction({
          add: [{ skuCode: null, minUnit: 0, add: true, edit: false, delete: false }]
        });
        this.goHandlingSKU.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "skuCode" });
      }
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRHSLine  () {
    try {
      if (this.goHandlingSKU.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goHandlingSKU.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goHandlingSKU.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getRHSDataFromGrid() {
    let rowData = [];
    this.goHandlingSKU.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Fixed Accessorial Rate Sheet
  colFixed = [
    {
      headerName: 'Fixed Accessorial Charges',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date for this Rate",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Charge", field: "chargeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Charge', class: "220" }, valueFormatter: agGridHelper.getChargeName, width: 220
        },
        {
          headerName: "Qty", field: "qty", type: "numericColumn", width: 100,
          valueFormatter: agGridHelper.formatNumbers,valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Rate/Unit", field: "rate", type: "numericColumn", width: 100,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddRFALine  () {
    try {
      var res = this.goFixed.api.applyTransaction({
        add: [{
          dateFrom: null, dateTo: null, chargeId: null, qty: 0, rate: 0, add: true, edit: false, delete: false
        }]
      });
      this.goFixed.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "dateFrom" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRFALine  () {
    try {
      if (this.goFixed.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goFixed.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goFixed.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getFixedDataFromGrid() {
    let rowData = [];
    this.goFixed.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Variable Accessorial Rate Sheet
  colVariable = [
    {
      headerName: 'Variable Accessorial Charges',
      children: [
        {
          headerName: "Eff Date", field: "dateFrom", width: 85, headerTooltip: "Effective Date for this Rate",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Exp Date", field: "dateTo", width: 85, headerTooltip: "Expiry Date for this Rate",
          cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Charge", field: "chargeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Charge', class: "220" }, valueFormatter: agGridHelper.getChargeName, width: 220
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", width: 100, headerTooltip: "Rate / Unit (Quantity)",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "A", field: "action", width: 30, editable: false
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddRVALine  () {
    try {
      var res = this.goVariable.api.applyTransaction({
        add: [{ dateFrom: null, dateTo: null, chargeId: null, rate: 0, add: true, edit: false, delete: false }]
      });
      this.goVariable.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "dateFrom" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRVALine  () {
    try {
      if (this.goVariable.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goVariable.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goVariable.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getVariableDataFromGrid() {
    let rowData = [];
    this.goVariable.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Rate Sheet - Project & Remarks Default Values
  colRemarks = [
    {
      headerName: 'Project & Remarks Default',
      children: [
        {
          headerName: "Invoice Type", field: "workFlowId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'WorkFlow', class: "150" }, valueFormatter: agGridHelper.getWorkFlowName, width: 150
        },
        { headerName: "Title", field: "projectTitle", width: 250, cellEditor: "agLargeTextCellEditor" },
        { headerName: "Project Name", field: "projectName", width: 250, cellEditor: "agLargeTextCellEditor" },
        { headerName: "Remarks", field: "remarks", width: 250, cellEditor: "agLargeTextCellEditor" },
        {
          headerName: "GST %", field: "gstRate", type: "numericColumn",  width: 60,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "A", field: "action", width: 30, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddRPLine() {
    try {
      var res = this.goRemarks.api.applyTransaction({
        add: [{ workFlowId: null, projectTitle: null, projectName: null, remarks: null, gstRate: 0, add: true, edit: false, delete: false }]
      });
      this.goRemarks.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "workFlowId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRPLine() {
    try {
      if (this.goRemarks.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goRemarks.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goRemarks.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getRemarksDataFromGrid() {
    let rowData = [];
    this.goRemarks.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  validateGridStatus() {
    var rd = (document.querySelector('[id="btnRecall"]')['disabled'] == true &&
      document.querySelector('[id="btnEdit"]')['disabled'] == true && 
      document.querySelector('[id="btnUndo"]')['disabled'] == false);
    agFormHelper.setGridStatus(rd);
    agFormHelper.setGridToolbar(rd);
  }
  //#endregion

  //#region local functions
  loadExisting() {
    const rs: WF_RateSheet = this.frmWFRateSheet.getRawValue();
    if (rs.storerGroupId && rs.pcId) {
      this.svcWaitDlg.open({});
      try {
        this.svcWFRateSheet.getExisting(rs.storerGroupId, rs.pcId).subscribe(
          data => {
            if (data) {
              //this.frmWFRateSheet.disable();
              //this.frmWFRateSheet.controls['formId'].setValue(WFRate.formId);
              //this.frmWFRateSheet.controls['rateSheetId'].setValue(WFRate.rateSheetId);
              //this.frmWFRateSheet.controls['storerGroupId'].setValue(WFRate.storerGroupId);            
              //this.frmWFRateSheet.controls['whId'].setValue(WFRate.whId);
              //this.frmWFRateSheet.controls['pcId'].setValue(data.pcId);
              this.frmWFRateSheet.controls['expiryDate'].setValue((data.expiryDate));
              this.frmWFRateSheet.controls['kamId'].setValue(data.kamId);
              this.frmWFRateSheet.controls['calendarId'].setValue(data.calendarId);
              this.frmWFRateSheet.controls['minInvAmount'].setValue(data.minInvAmount);
              this.frmWFRateSheet.controls['isActive'].setValue(data.isActive);
              this.oldExpiryDate = data.expiryDate;
              this.oldMinAmount = data.minInvAmount;
              this.oldKamId = data.kamId;
              this.oldInvCalendarId = data.calendarId;
              //this.oldRateSheetActive = data.isActive;
              this.frmWFRateSheet.controls['stateId'].setValue(0);
              //data.stateName = agEnum.getRateState(0);
              this.frmWFRateSheet.controls['stateName'].setValue(agEnum.getRateState(0));
              this.frmWFRateSheet.controls['owner'].setValue(this.currentUserId);//data.owner);
              this.frmWFRateSheet.controls['completed'].setValue(false);
              this.storageData = data.storage;
              this.handlingData = data.handling;
              this.exemptLocData = data.exemptedSL;
              this.fixedData = data.fixedAccessorial;
              this.variableData = data.variableAccessorial;
              this.remarksData = data.projectRemarks;
              agFormHelper.setFormControls(this.optionName, agFormMode.Add);
              this.frmWFRateSheet.controls.storerGroupId.disable();
              this.frmWFRateSheet.controls.pcId.disable();
              this.setActionBarVisibility(agFormMode.Add);
              agFormHelper.setGridToolbar(true);
              agFormHelper.setGridStatus(true);
            }
            else { this.svcToaster.showWarning('No record found with your provided key/value pair or you don`t have access to this record'); }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
      catch (e) { this.svcToaster.showFailure(e); }
    }
  }

  get(id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcWFRateSheet.get(id).subscribe(
        data => {
          if (data) {
            this.frmWFRateSheet.disable();
            //this.frmWFRateSheet.controls['rateSheetId'].setValue(data.rateSheetId);
            //this.frmWFRateSheet.controls['whId'].setValue(data.whId);
            this.frmWFRateSheet.controls['formId'].setValue(data.formId);
            this.frmWFRateSheet.controls['storerGroupId'].setValue(data.storerGroupId);
            this.frmWFRateSheet.controls['pcId'].setValue(data.pcId);
            this.frmWFRateSheet.controls['expiryDate'].setValue((data.expiryDate));
            this.frmWFRateSheet.controls['kamId'].setValue(data.kamId);
            this.frmWFRateSheet.controls['calendarId'].setValue(data.calendarId);
            this.frmWFRateSheet.controls['minInvAmount'].setValue(data.minInvAmount);
            this.frmWFRateSheet.controls['isActive'].setValue(data.isActive);
            this.frmWFRateSheet.controls['stateId'].setValue(data.stateId);
            this.frmWFRateSheet.controls['stateName'].setValue(agEnum.getRateState(data.stateId));
            this.frmWFRateSheet.controls['owner'].setValue(data.owner);
            this.frmWFRateSheet.controls['completed'].setValue(data.completed);
            this.storageData = data.storage;
            this.handlingData = data.handling;
            this.exemptLocData = data.exemptedSL;
            this.fixedData = data.fixedAccessorial;
            this.variableData = data.variableAccessorial;
            this.remarksData = data.projectRemarks;
            this.footer = data.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWFRateSheet.getLookup().subscribe(
        data => {
          //this.lstWarehouse = data.lstWarehouse;
          //sessionStorage.setItem("lstProfitCenter", JSON.stringify(data.lstProfitCenter));
          this.lstStorerGroup = data.lstStorerGroup;
          this.lstProfitCenter = data.lstProfitCenter;
          this.lstKAM = data.lstKAM;
          this.lstInvCalendar = data.lstInvCalendar;
          sessionStorage.setItem("lstStorageType", JSON.stringify(data.lstStorageType));
          sessionStorage.setItem("lstStorageUnit", JSON.stringify(data.lstStorageUnit));
          sessionStorage.setItem("lstPeriodType", JSON.stringify(data.lstPeriodType));
          sessionStorage.setItem("lstContainerType", JSON.stringify(data.lstContainerType));
          sessionStorage.setItem("lstHandingType", JSON.stringify(data.lstHandingType));
          sessionStorage.setItem("lstHandlingUnit", JSON.stringify(data.lstHandlingUnit));
          sessionStorage.setItem("lstCharge", JSON.stringify(data.lstCharge));
          sessionStorage.setItem("lstWorkFlow", JSON.stringify(data.lstWorkflow));
          sessionStorage.setItem("lstLooseUnit", JSON.stringify(data.lstLooseUnit));
          sessionStorage.setItem("lstLocCategory", JSON.stringify(data.lstLocCategory));
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

  private validate(req: WF_RateSheet) {
    this.errors = [];
    if (req.completed || (req.stateId > 1 && req.stateId != 5) || req.owner != req.footer.createdBy ||
      req.owner != this.svcAuth.getUserId()) {
      this.errors.push('No further changes can be made to this Request at this stage!');
    }
    else if (req.stateId == 5 && req.owner != req.footer.createdBy) {
      this.errors.push('The current owner of this Request is ' + req.owner +
        '!. ' + req.footer.createdBy + ' can make changes to request provided it is returned to that user!');
    }
    else {
      if (this.oldExpiryDate == null && req.storage.filter(x => !x.delete).length == 0 &&
        req.handling.filter(x => !x.delete).length == 0) {
        this.errors.push('At least one from Storage or Handling charges must be mentioned before saving the request!');
      }
      if (this.oldExpiryDate === req.expiryDate && this.oldMinAmount === req.minInvAmount && this.oldKamId === req.kamId
        && this.oldInvCalendarId === req.calendarId && this.oldRateSheetActive === req.isActive) {
        if (req.storage.filter(x => x.add || x.edit || x.delete).length == 0 &&
          req.handling.filter(x => x.add || x.edit || x.delete).length == 0 &&
          req.variableAccessorial.filter(x => x.add || x.edit || x.delete).length == 0 &&
          req.fixedAccessorial.filter(x => x.add || x.edit || x.delete).length == 0 &&
          req.projectRemarks.filter(x => x.add || x.edit || x.delete).length == 0 &&
          req.exemptedSL.filter(x => x.add || x.edit || x.delete).length == 0) {
          this.errors.push('No changes found to perform save operation');
        }
      }

      //#region storage charges validation
      if (req.storage.filter(x => !x.delete).length > 0) {
        if (req.storage.some(x => !x.delete && (!x.dateFrom || !x.dateTo))) {
          this.errors.push('Please provide valid date range for Storage charges');
        }
        else if (req.storage.some(x => !x.delete && (x.dateFrom > x.dateTo))) {
          this.errors.push('Storage Rate expiry date can not be older than effective date');
        }
        if (req.storage.some(x => !x.delete && x.rate <= 0)) {
          this.errors.push('Storage rate must be specified for each row');
        }
        if (req.storage.some(x => !x.delete && x.otRate < 0)) {
          this.errors.push('Storage overtime Rate must be +ve or Zero');
        }
        if (req.storage.some(x => !x.delete && x.fixedSqFt < 0)) {
          this.errors.push('Storage Fixed Sq Ft Rate must be +ve or Zero');
        }
        if (req.storage.some(x => !x.delete && x.minVolume < 0)) {
          this.errors.push('Storage Minimum volume must be +ve or Zero');
        }
        if (req.storage.some(x => !x.delete && x.minAmount < 0)) {
          this.errors.push('Storage Minimum Amount must be +ve or Zero');
        }
        if (req.storage.some(x => !x.delete && (!x.stId || !x.suId || !x.periodTypeId))) {
          this.errors.push('Valid storage type, unit & period must be selected for each row of Storage charges');
        }
        if (req.storage.some(x => !x.delete && (x.suId != 2 && x.otRate != 0))) {
          this.errors.push('Overtime rate can only be defined for storage type Variable Sq Ft');
        }
        if (req.storage.some(x => !x.delete && (x.suId != 11 && x.stepCharges))) {
          this.errors.push('Step charges functionality is only supported for Storage Unit Pallet');
        }
        if (req.storage.some(x => !x.delete && (x.suId == 1 && x.fixedSqFt == 0))) {
          this.errors.push('Valid Fixed square feet value is required if Storage type is set as Fixed Sq Ft');
        }
        if (req.storage.some(x => !x.delete && (x.suId != 1 && x.fixedSqFt != 0))) {
          this.errors.push('Fixed Sq Ft can only be defined for storage type Fixed Square Feet');
        }
        if (req.storage.some(x => !x.delete && (x.minAmount != 0 && x.minVolume != 0))) {
          this.errors.push('Both minimum amount and volume can`t be defined in single Storage Rate row');
        }
        if (req.storage.some(x => !x.delete && (x.minAmount == 0 || x.minVolume == 0) && x.stepCharges)) {
          this.errors.push('Both Storage Minimum Amount and Volume must be defined if Step Charges is applied');
        }
        if (req.storage.some(x => !x.delete && (x.minAmount != 0 && x.minVolume != 0) && !x.stepCharges)) {
          this.errors.push('Both Storage Minimum Amount and Volume can`t be defined together if it is not Step Charge');
        }
        if (req.storage.some(x => !x.delete && x.suId <= 3 && x.locationCategory.filter(y => !y.delete).length > 0)) {
          this.errors.push('Location Category details are not allowed for Storage unit Fixed Sq Ft and Variable Sq Ft');
        }
        if (req.storage.some(x => !x.delete && x.suId != 11 && x.locationCategory.some(y => !y.delete && y.upp))) {
          this.errors.push('Pallet by Packkey can only be selected when Storage unit is Pallet Spots');
        }

        var dupStorage = req.storage.filter(x => !x.delete).map(item => ({ dateFrom: item.dateFrom, dateTo: item.dateTo, stId: item.stId, suId: item.suId })).slice().sort();
        for (var i = 0; i < dupStorage.length - 1; i++) {
          if (dupStorage[i + 1]['dateFrom'] === dupStorage[i]['dateFrom']) {
            if (dupStorage[i + 1]['dateTo'] === dupStorage[i]['dateTo']) {
              if (dupStorage[i + 1]['stId'] === dupStorage[i]['stId']) {
                if (dupStorage[i + 1]['suId'] === dupStorage[i]['suId'])
                  this.errors.push('The combination of Date From/To, Storage Type and Storage Unit must be unique!');
                i = dupStorage.length;
              }
            }
          }
        }
      }
      //#endregion

      //#region expempted storage locations
      if (req.exemptedSL.filter(x => !x.delete).length > 0) {
        var slDuplicate = req.exemptedSL.filter(x => !x.delete).map(function (item) { return item.lcId; }).sort();
        for (var i = 0; i < slDuplicate.length - 1; i++) {
          if (slDuplicate[i + 1] === slDuplicate[i]) {
            this.errors.push('Location Category must be specified only once in Exempted Storage Location Category');
            i = slDuplicate.length;
          }
        }

        var locCat: WF_RateSheet_Storage_LocCategory[] = [];
        req.storage.filter(y => !y.delete).forEach(x => { locCat = locCat.concat(x.locationCategory.filter(z => !z.delete)); });
        if (locCat.filter(e => { return req.exemptedSL.some(item => !item.delete && item.lcId === e.lcId); }).length > 0) {
          this.errors.push('Same Location category can`t be used in both Chargeable and Exempted Location Category list');
        }
      }
      //#endregion

      //#region handling validate
      if (req.handling.filter(x => !x.delete).length > 0) {
        if (req.handling.some(x => !x.delete && (!x.dateFrom || !x.dateTo))) {
          this.errors.push('Please provide valid date range for Handling Charges');
        }
        else if (req.handling.some(x => !x.delete && (x.dateFrom > x.dateTo))) {
          this.errors.push('Handling Rate expiry date can not be older than effective date');
        }
        if (req.handling.some(x => !x.delete && (!x.htId || !x.huId))) {
          this.errors.push('Handling Type & Unit must be specified for each row');
        }
        if (req.handling.some(x => !x.delete && (x.rate <= 0 || x.sundayRate <= 0 || x.holidayRate <= 0) && x.huId != 54)) {
          this.errors.push('Handling Rate, Sunday & Holiday rates are mandatory fields and must be non-zero & +ve');
        }
        if (req.handling.some(x => !x.delete && (x.rate != 0 || x.sundayRate != 0 || x.holidayRate != 0) && x.huId == 54)) {
          this.errors.push('Handling Rates must be mentioned against Each Container Capacity and general handling rate including sunday and holiday must be zero');
        }
        if (req.handling.some(x => !x.delete && (x.minAmount != 0 && x.minVolume != 0))) {
          this.errors.push('Both minimum amount and volume can`t be defined in single Handling Rate row');
        }
        if (req.handling.some(x => !x.delete && (x.minAmount < 0 || x.minVolume < 0))) {
          this.errors.push('Minimum Amount & volume must be +ve or Zero');
        }
        if (req.handling.some(x => !x.delete && x.huId != 54 && (x.looseUnitId || x.looseRate != 0))) {
          this.errors.push('Loose Unit and Loose Rate can only be defined for Handling Unit Container');
        }
        if (req.handling.some(x => !x.delete && x.looseRate < 0)) {
          this.errors.push('Loose Rate can`t be less than zero');
        }
        if (req.handling.some(x => !x.delete && x.huId != 41 && x.uniquePalletCount)) {
          this.errors.push('Unique Pallet option could only be selected when Handling Unit is Pallet');
        }
        if (req.handling.filter(x => !x.delete && x.huId == 54).some(y => y.containerRates.filter(z => !z.delete).length == 0)) {
          this.errors.push('Atleast one container capacity must be mentioned for Handling if unit type is Containers');
        }
        if (req.handling.some(x => !x.delete && x.huId == 56 && x.skUs.filter(x => !x.delete).length == 0)) {
          this.errors.push('Atleast one SKU must be specified if Handling unit is selected as SKU');
        }
        if (req.handling.some(x => !x.delete && x.huId != 54 && x.containerRates.some(y => !y.delete && (y.rate <= 0 || !y.containerTypeId)))) {
          this.errors.push('Container Handling Rate/Capacity must be specified for each row');
        }

        var dupHandling = req.handling.filter(x => !x.delete).map(item => ({ dateFrom: item.dateFrom, dateTo: item.dateTo, htId: item.htId, huId: item.huId })).slice().sort();
        for (var i = 0; i < dupHandling.length - 1; i++) {
          if (dupHandling[i + 1]['dateFrom'] === dupHandling[i]['dateFrom']) {
            if (dupHandling[i + 1]['dateTo'] === dupHandling[i]['dateTo']) {
              if (dupHandling[i + 1]['htId'] === dupHandling[i]['htId']) {
                if (dupHandling[i + 1]['huId'] === dupHandling[i]['huId'])
                  this.errors.push('The combination of Date From/To, Handling Type and Handling Unit must be unique!');
                i = dupHandling.length;
              }
            }
          }
        }
      }
      //#endregion

      //#region fixed accessorial validation
      if (req.fixedAccessorial.filter(x => !x.delete).length > 0) {
        if (req.fixedAccessorial.some(x => !x.delete && (!x.dateFrom || !x.dateTo))) {
          this.errors.push('Valid date range must be specified for Fixed Accessorial Rate Setup');
        }
        else if (req.fixedAccessorial.some(x => !x.delete && (x.dateFrom > x.dateTo))) {
          this.errors.push('Fixed Accessorial Expiry date can`t be older than Effective Date');
        }
        if (req.fixedAccessorial.some(x => !x.delete && (x.rate <= 0 || !x.chargeId || x.qty <= 0))) {
          this.errors.push('Please provide valid Charge head, Rate & Qty for Fixed Accessorial Rate Setup');
        }
      }
      //#endregion

      //#region variable accessorial validation
      if (req.variableAccessorial.filter(x => !x.delete).length > 0) {
        if (req.variableAccessorial.some(x => !x.delete && (!x.dateFrom || !x.dateTo))) {
          this.errors.push('Valid date range must be specified for Variable Accessorial Rate Setup');
        }
        else if (req.variableAccessorial.some(x => !x.delete && (x.dateFrom > x.dateTo))) {
          this.errors.push('Variable accessorial Expiry Date can`t be older than Effective Date');
        }
        if (req.variableAccessorial.some(x => !x.delete && (x.rate <= 0 || !x.chargeId))) {
          this.errors.push('Please provide valid Charge head & Rate for Variable Accessorial Rate Setup');
        }
      }
      //#endregion

      //#region project & remarks validation
      if (req.projectRemarks.filter(x => !x.delete).length > 0) {
        if (req.projectRemarks.some(x => !x.delete && !x.workFlowId)) {
          this.errors.push('Please select valid Invoice type for each row of Rate sheet default');
        }
        if (req.projectRemarks.some(x => !x.delete && (!x.gstRate || x.gstRate < 0))) {
          this.errors.push('GST Rate must be zero or +ve in Rate Sheet Default');
        }

        var wfDuplicate = req.projectRemarks.filter(x => !x.delete).map(function (item) { return item.workFlowId; }).sort();
        for (var i = 0; i < wfDuplicate.length - 1; i++) {
          if (wfDuplicate[i + 1] === wfDuplicate[i]) {
            this.errors.push('Invoice type must be specified only once in Rate Sheet Default setup');
            i = wfDuplicate.length;
          }
        }
      }
      //#endregion
    }
  }

  //onStorerChange() {
  //  const ratesheet = this.frmWFRateSheet.getRawValue();
  //  if (ratesheet.storerGroupId != null) {
  //    this.frmWFRateSheet.controls.whId.enable();
  //  }   
  //}

  //onWarehouseChange() {
  //  const ratesheet = this.frmWFRateSheet.getRawValue();
  //  if (ratesheet.whId != null) {
  //    var lstProfitCenter = JSON.parse(sessionStorage.getItem("lstProfitCenter"));
  //    this.lstProfitCenter = lstProfitCenter.filter(x => x.whId === ratesheet.whId);
  //    this.frmWFRateSheet.controls.pcId.enable();
  //  }
  //}

  showLCInfo(row) {  
    this.storageLocData = this.goStorage.api.getRowNode(row.node.id).data.locationCategory;
  }

  showContainerInfo(row) {
    this.handlingContainerData = this.goHandling.api.getRowNode(row.node.id).data.containerRates;
  }

  showSKUInfo(row) {
    this.handlingSKUData = this.goHandling.api.getRowNode(row.node.id).data.skUs;
  }

  onHandlingRowSelected(event) {
    if (event.node.selected) {
      if (event.node.data.huId === 54 || event.node.data.huId === 56) {
        this.containerHidden = event.node.data.huId != 54;
        this.skuHidden = event.node.data.huId != 56;
        this.frmWFRateSheet.patchValue({ showContainer: !this.containerHidden, showSKU: !this.skuHidden });
      }
      else {
        this.containerHidden = true;
        this.skuHidden = true;
        this.frmWFRateSheet.patchValue({ showContainer: false, showSKU: false });
      }
      if (this.selectedHandlingNodeId != -1) {
        var r = this.goHandling.api.getRowNode(this.selectedHandlingNodeId.toString());

        if (r.data.huId === 54)
          r.data.containerRates = this.getRHCDataFromGrid();
        else if (r.data.huId === 56)
          r.data.skUs = this.getRHSDataFromGrid();
      }
      this.showContainerInfo(event);
      this.showSKUInfo(event);
      this.selectedHandlingNodeId = event.node.id;
    }
  }

  onStorageRowSelected(event) {
    if (event.node.selected) {
      this.frmWFRateSheet.patchValue({ showLC: ((event.node.data.suId >= 11 && event.node.data.suId <= 14) || (event.node.data.suId >= 21 && event.node.data.suId <= 23))});

      if (this.selectedStorageNodeId != -1) {
          var r = this.goStorage.api.getRowNode(this.selectedStorageNodeId.toString());
          r.data.locationCategory = this.getRSLDataFromGrid();
      }     
      this.showLCInfo(event);     
      this.selectedStorageNodeId = event.node.id;
    }
  }

  onRSLCellValueChanged(params) {
    if (params.data.slcId != 0 && !params.data.add)
      params.data.edit = true;

    if (params.data.slcId == 0)
      params.data.add = true;

    if (params.colDef.field == "lcId") {
      if (params.data.lcId != "") {
        params.node.setDataValue("lcId", parseInt(params.data.lcId));
      }
      else { params.node.setDataValue("lcId", null); }
    }

    var r = this.goStorage.api.getRowNode(this.selectedStorageNodeId.toString());
    if (!r.data.edit && r.data.storageRateId == 0)
      r.data.add = true;
    else
      r.data.edit = true;
  }

  onRHCCellValueChanged(params) {
    if ((params.data.whcId && !params.data.add) || params.data.hcId)
      params.data.edit = true;
    else
      params.data.add = true;

    var r = this.goHandling.api.getRowNode(this.selectedHandlingNodeId.toString());
    if (!r.data.wrshId && !r.data.edit)
      r.data.add = true;
    else
      r.data.edit = true;    

    if (params.colDef.field == "containerTypeId") {
      if (params.data.containerTypeId != "") {
        params.node.setDataValue("containerTypeId", parseInt(params.data.containerTypeId));
      }
      else { params.node.setDataValue("containerTypeId", null); }
    }
  }

  onRHSCellValueChanged(params) {
    if ((params.data.whsId && !params.data.add) || params.data.hsId)
      params.data.edit = true;
    else 
      params.data.add = true;

    var r = this.goHandling.api.getRowNode(this.selectedHandlingNodeId.toString());
    if (!r.data.wrshId && !r.data.edit)
      r.data.add = true;
    else
      r.data.edit = true;
  }

  private setActionBarVisibility(formMode: agFormMode) {
    this.submissionButtonsStatus = (formMode != agFormMode.ReadOnly && formMode != agFormMode.Review) ? "disabled" : "";
  }

  private initForm() {
    this.frmWFRateSheet.reset();
    this.frmWFRateSheet.disable();
    this.errors = [];
    this.footer = new agFooter();
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
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
    //this.goStorage.api.setRowData([]);
    //this.goStorageLoc.api.setRowData([]);
    //this.goHandling.api.setRowData([]);
    //this.goVariable.api.setRowData([]);
    //this.goFixed.api.setRowData([]);
    //this.goRemarks.api.setRowData([]);
    //this.goExemptLoc.api.setRowData([]);
    ////this.goStorageLoc.api.setRowData([]);
    //this.goHandlingContainer.api.setRowData([]);
    //this.goHandlingSKU.api.setRowData([]);
    this.containerHidden = true;
    this.skuHidden = true;
    this.oldExpiryDate = null;
    this.myForm = false;
  }
  //#endregion local functions
}
