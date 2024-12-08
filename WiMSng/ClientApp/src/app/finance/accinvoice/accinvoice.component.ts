import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { forkJoin } from 'rxjs';
import { RecipientService } from '../../common/recipient/recipient.service';
import { agEnum } from '../../helper/agEnum';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { FormSubmissionDialogService } from '../../helper/formsubmissionDialog/formsubmission-dialog.service';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { Submission } from '../../helper/submission';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AccInvoice } from './accinvoice';
import { AccInvoiceService } from './accinvoice.service';
import { AccInvoiceDetail } from './accinvoicedetail';

@Component({
  selector: 'app-accinvoice',
  templateUrl: './accinvoice.component.html',
  styleUrls: ['./accinvoice.component.css']
})

export class AccInvoiceComponent implements OnInit {
  //#region form variables
  optionName: string = this.route.snapshot.data.title;
  workFlowId: number = this.route.snapshot.data.workFlowId;
  myForm: boolean = false;
  readonly colSearch =
    [
      { headerName: 'Invoice #', field: 'invoiceNo', width: 100  },
      { headerName: 'Invoice Date', field: 'invoiceDate', width: 100 },
      { headerName: 'Storer Group Name', field: 'storerGroupName' },
      { headerName: 'Profit Center Name', field: 'pcName' },
    ];
  frmAccInvoice: FormGroup;
  public goAccInvoice: GridOptions;
  accInvoiceData: AccInvoiceDetail[] = [];
  loginUser: string; 
  lstStorerGroup: any;
  lstProfitCenter: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = agFormHelper.addDays(-35);
  maxDate = new Date();
  submissionButtonsStatus = "";
  @ViewChild('storerGroupId', { static: true }) storerGroupId: MatSelect;
  @ViewChild('invoiceNo', { static: true }) invoiceNo: ElementRef;
  @ViewChild('btnEdit', { static: true }) btnEdit: HTMLButtonElement;
  targetNode: HTMLElement; 
  config = { childList: true, subtree: true, attributes: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (
          !(<HTMLInputElement>document.getElementById('btnEdit')).disabled || !(<HTMLInputElement>document.getElementById('btnExit')).disabled))
        { mutation.addedNodes[0].disabled = true; }
      }
    }
  };
  observer = new MutationObserver(this.callback);
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcAccInvoice: AccInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService,
    private route: ActivatedRoute, private svcRecipient: RecipientService, private svcAuth: AuthService,
    private svcFormSubmission: FormSubmissionDialogService, private svcHistoryDlg: HistoryDialogService  ) {
    this.loadLookup();
    this.initGrid();
    this.loginUser = svcAuth.getUserId();
    var _formid = (this.route.snapshot.queryParamMap.get("formId"));
    if (_formid != null) {
      this.get(_formid.toString());
      this.myForm = true;
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngOnInit() {
    this.frmAccInvoice = this.formbulider.group({
      invoiceId: [null],
      invoiceNo: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      storerGroupId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],
      gstRate: [null],
      workFlowId: [null],
      stateId: [null],
      stateName: [null],
      owner: [null],
      completed: [null],
    });  
    this.frmAccInvoice.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.setActionBarVisibility(agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.frmAccInvoice.patchValue({
      stateId: 0, stateName: "New", completed: false, invoiceDate: new Date(), 
      owner: this.svcAuth.getUserId(), workFlowId: this.workFlowId, gstRate: 0
    });    
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divSave');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmAccInvoice.reset();
    this.frmAccInvoice.enable();
    this.frmAccInvoice.controls.invoiceNo.disable();
    this.frmAccInvoice.patchValue({
      stateId: 0, stateName: "New", completed: false, invoiceDate: new Date(), 
      owner: this.svcAuth.getUserId(), workFlowId: this.workFlowId, gstRate: 0
    });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.footer.createdBy = this.svcAuth.getUserId();
    this.storerGroupId.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmAccInvoice.controls.invoiceNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.invoiceNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcAccInvoice.getInvoices(this.workFlowId).subscribe(r => {
        this.svcSearchDlg.open("Search & Select Invoice", this.colSearch, r);
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
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmAccInvoice.controls.invoiceNo.disable();
    const accinvoice: AccInvoice = this.frmAccInvoice.getRawValue();
    //if (this.workFlowId == 4 && (accinvoice.stateId == 1 || accinvoice.stateId == 5)) {
    if (accinvoice.stateId == 1 || accinvoice.stateId == 5) {
      this.frmAccInvoice.enable();
      this.storerGroupId.focus();
      agFormHelper.setGridToolbar(true);
      agFormHelper.setGridStatus(true);
    }
    else {
      this.frmAccInvoice.disable();
      agFormHelper.setGridToolbar(false);
      agFormHelper.setGridStatus(false);
    }
  }

  tbSave() {
    try {
      this.frmAccInvoice.markAllAsTouched();
      if (!this.frmAccInvoice.invalid) {
        var formdata: AccInvoice = this.frmAccInvoice.getRawValue();
        formdata.details = this.getDetailFromGrid();
        formdata.footer = this.footer;
        this.validate(formdata);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcAccInvoice.save(formdata).subscribe(
            data => {
             // if (this.workFlowId == 4) {
                agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
                this.svcToaster.showSuccess('Invoice # ' + data.newInvoiceNo + ' saved successfully. Press submit button for onward approval and processing!');
                this.setActionBarVisibility(agFormMode.ReadOnly);
                agFormHelper.setGridToolbar(false);
                agFormHelper.setGridStatus(false);
                //(<HTMLButtonElement>document.getElementById("btnGridAdd")).disabled = true;
                this.get(data.newInvoiceNo);
              //}
              //else {
//                this.initForm();
  //              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    //            this.svcToaster.showSuccess('Invoice # ' + data.newInvoiceNo + ' saved successfully');
      //        }     
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
      this.frmAccInvoice.updateValueAndValidity({ onlySelf: true, emitEvent: false });
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
      this.svcRecipient.getHistory(this.workFlowId, formId).subscribe(r => {
        this.svcHistoryDlg.open("Ad Hoc Invoice" + formId, agGridHelper.colHistory, r);
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
          recipients = this.svcRecipient.getAccInvoiceRecipients(formId, this.workFlowId, stateId);
        }
        if (stateId == 3 || stateId == 4 || stateId == 99) {
          recipients = this.svcRecipient.getCreator(this.workFlowId, formId);
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
            this.svcFormSubmission.open(agEnum.getInvoiceState(nextStateId) + " - Invoice # " + this.frmAccInvoice.controls.invoiceNo.value,
              agEnum.getInvoiceState(nextStateId), recipients);
            this.svcFormSubmission.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  sub.formId = formId;
                  sub.formNo = this.invoiceNo.nativeElement.value;
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
    else if (sn.stateId == 4 || sn.stateId==99) {
      sn.completed = true;
      sn.rejected = true;
      sn.approved = false;
    }
    else {
      sn.completed = false;
    }
    this.svcWaitDlg.open({});
    this.svcAccInvoice.submit(sn).subscribe(
      () => {
        this.svcToaster.showSuccess('Invoice # ' + sn.formNo +
          ' was successfully submitted to ' + sn.owner + (sn.comments == "" ? " with no comments " : " with the comments " + sn.comments))
        this.tbUndo();
      },
      error => { this.svcToaster.showFailure(error); },
      () => { this.svcWaitDlg.close(); }
    );
  }
  //#endregion FormSubmission

  //#region grid setup
  initGrid() {
    this.goAccInvoice = <GridOptions>{
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
      onCellClicked: function (event) {
        if (event.colDef.field == "print") {
          if (!event.data.print) {
            event.node.setDataValue('print', true);
          }
          else {
            event.node.setDataValue('print', false);
          }
        }
      },
      onCellEditingStarted: function (event) {
        if (event.rowPinned)
          event.api.stopEditing();
      },
      onRowSelected: function (event) {
        if (event.rowPinned) { event.node.setSelected(false, true); }
      },
      onRowDataChanged: () => {  this.setFooter(); }
    };
  }
  
  colAccInvoice = [
    {
      headerName: 'Invoice Details',
      children: [
        {
          headerName: "Charge", field: "chargeId", cellEditor: agGridHelper.getAgilitySelect(), editable: this.allowDetailEdit(),
          cellEditorParams: { source: 'Charge', class: "200" }, valueFormatter: agGridHelper.getChargeName, width: 200
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, editable: this.allowUnitEdit(), valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          editable: this.allowDetailEdit(), valueParser: agGridHelper.numberValueParser, width: 100,
        },
        {
          headerName: "UoM", field: "uoMId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'UoM', class: "100" }, valueFormatter: agGridHelper.getUoMName, width: 100
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100, editable: false
        },
        {
          headerName: 'Show Rate/Vol', field: 'print', width: 120, editable: false,
          cellRenderer: params => {
            if (!params.node.rowPinned) {
              if (params.value) { return "<input type='checkbox' checked />"; }
              else { return "<input type='checkbox'/>"; }
            }
          },
          cellEditor: agGridHelper.getCellCheckBox()
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddLine  () {
    try {
      var res = this.goAccInvoice.api.applyTransaction({
        add: [{
          chargeId: null, quantity: 0, rate: 0, uoMId: null, amount: 0, print :true, add: true, edit: false, delete: false
        }]
      });
      this.goAccInvoice.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line:');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goAccInvoice.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goAccInvoice.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goAccInvoice.api);
          this.setFooter();
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Invalid Request');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line');
    }
  };

  onAICellValueChanged(params) {
    const colId = params.colDef.field;
    if (!params.data.add)
      params.data.edit = true;
    if (colId == "chargeId") {
      if (params.data.chargeId != "") {
        params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
      }
      else {
        params.node.setDataValue("chargeId", null);
      }
    }
    if (colId == "uoMId") {
      if (params.data.uoMId != "") {
        params.node.setDataValue("uoMId", parseInt(params.data.uoMId));
      }
      else {
        params.node.setDataValue("uoMId", null);
      }
    }
    if (colId === "quantity" || colId === "rate") {
      params.node.setDataValue("amount", params.data.quantity * params.data.rate)
      this.setFooter();
    }
  }

  private setFooter() {
    try {
      let _quantity = 0; let _amount = 0;
      this.goAccInvoice.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.chargeId != undefined && !rowNode.data.delete) {
          _quantity += rowNode.data.quantity,
            _amount += rowNode.data.amount
        }
      });
      this.goAccInvoice.api.setPinnedBottomRowData([{
        chargeId: null, quantity: _quantity, rate: null, uoMId: null, amount: _amount
      }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  }

  private getDetailFromGrid() {
    let rowData = [];
    this.goAccInvoice.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  private allowDetailEdit() {
    return this.workFlowId == 4;
  }

  private allowUnitEdit() {
    return this.workFlowId != 3;
  }
  //#endregion

  //#region local functions
  get(Id: string) {
    try {
      this.svcWaitDlg.open({});
      this.svcAccInvoice.get(Id, this.workFlowId).subscribe(
        ai => {
          if (ai) {
            this.frmAccInvoice.disable();
            this.frmAccInvoice.controls['invoiceId'].setValue(ai.invoiceId);
            this.frmAccInvoice.controls['invoiceNo'].setValue(ai.invoiceNo);
            this.frmAccInvoice.controls['invoiceDate'].setValue(ai.invoiceDate);
            this.frmAccInvoice.controls['remarks'].setValue(ai.remarks);
            this.frmAccInvoice.controls['storerGroupId'].setValue(ai.storerGroupId);
            this.frmAccInvoice.controls['pcId'].setValue(ai.pcId);
            this.frmAccInvoice.controls['gstRate'].setValue(ai.gstRate);
            this.frmAccInvoice.controls['stateId'].setValue(ai.stateId);
            this.frmAccInvoice.controls['completed'].setValue(ai.completed);
            ai.stateName = agEnum.getInvoiceState(ai.stateId);
            this.frmAccInvoice.controls['stateName'].setValue(ai.stateName);
            this.frmAccInvoice.controls['owner'].setValue(ai.owner);
            this.accInvoiceData = ai.details;
            this.footer = ai.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
            if (this.workFlowId == 4) {
              (<HTMLButtonElement>document.getElementById("btnGridAdd")).disabled = true;
            }            
          }
          else { this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  loadInvoiceDetail() {    
    try {
      const ai: AccInvoice = this.frmAccInvoice.getRawValue();
      if (ai.storerGroupId != null && ai.pcId != null) {
        this.svcWaitDlg.open({});
        if (this.workFlowId == 2) {
          this.svcAccInvoice.getVariable(ai.storerGroupId, ai.pcId, ai.invoiceDate).subscribe(
            ai => {
              if (ai) {
                this.accInvoiceData = ai;
                agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
              }
              else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); });
        }
        else if (this.workFlowId == 3) {
          this.svcAccInvoice.getFixed(ai.storerGroupId, ai.pcId, ai.invoiceDate).subscribe(
            ai => {
              if (ai) {
                this.accInvoiceData = ai;
                agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
              }
              else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); });
        }
        this.svcWaitDlg.open({});
        this.svcAccInvoice.getDefaultGST(ai.storerGroupId, ai.pcId, ai.workFlowId).subscribe(
          gstrate => {
            if (gstrate) {
              this.frmAccInvoice.controls['gstRate'].setValue(gstrate);
            }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcWaitDlg.close();  this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcAccInvoice.getLookup().subscribe(
        data => {
          this.lstStorerGroup = data.lstStorerGroup;
          this.lstProfitCenter = data.lstProfitCenter;
          sessionStorage.setItem("lstCharge", JSON.stringify(data.lstCharge));
          sessionStorage.setItem("lstUoM", JSON.stringify(data.lstUoM));  
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(ai: AccInvoice) {
    this.errors = [];
    if (ai.completed || ai.stateId > 1 || ai.owner != ai.footer.createdBy || ai.owner != this.svcAuth.getUserId()) {
      this.errors.push('No further changes can be made to this Invoice at this stage!');
    }
    else if (ai.stateId == 5 && ai.owner != ai.footer.createdBy) {
      this.errors.push('The current owner of this Invoice is ' + ai.owner +
        '!. Only ' + ai.footer.createdBy + ' can make changes to this Invoice if that user is the current owner!');
    }       
    if (ai.details.filter(x => !x.delete).length == 0) {
      this.errors.push('Atleast one entry must exist in Invoice Detail to perform save operation');
    }
    else {
      if (ai.details.some(x => !x.delete && !x.chargeId)) {
        this.errors.push('Selection of accessrial charge is mandatory for every row of invoice detail');
      }
      if (ai.details.some(x => !x.delete && !x.uoMId)) {
        this.errors.push('Selection of UoM is mandatory every row of invoice detail');
      }
      if (ai.details.some(x => !x.delete && x.quantity <= 0)) {
        this.errors.push('No row in Invoice detail can contain zero quantity');
      }
      if (ai.details.some(x => !x.delete && x.rate <= 0)) {
        this.errors.push('No row in invoice detail can contain zero Rate');
      }

      var detDuplicate = ai.details.filter(x => !x.delete).map(function (item) { return item.chargeId; }).sort();
      for (var i = 0; i < detDuplicate.length - 1; i++) {
        if (detDuplicate[i + 1] === detDuplicate[i]) {
          this.errors.push('Charge code must be unique in Invoice Detail!');
          i = detDuplicate.length;
        }
      }
    }
  }

  private setActionBarVisibility(formMode: agFormMode) {
    this.submissionButtonsStatus = (formMode != agFormMode.ReadOnly && formMode != agFormMode.Review) ? "disabled" : "";
  }

  private disableSave() {
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
     
      if (document.getElementById('btnGridAdd') as HTMLInputElement != null) {
        (<HTMLButtonElement>document.getElementById("btnGridAdd")).disabled = true;
      }
  }

  private initForm() {
    this.frmAccInvoice.reset();
    this.frmAccInvoice.disable();
    this.errors = [];
    this.accInvoiceData = [];
    //this.myForm = false;
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
    this.frmAccInvoice.patchValue({ workFlowId: this.workFlowId, invoiceDate: new Date() });
    this.footer = new agFooter();    
  }
  //#endregion local functions
}
