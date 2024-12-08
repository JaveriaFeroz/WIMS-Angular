import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { Note } from './note';
import { NoteService } from './note.service';
import { NoteDetail } from './notedetail';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})

export class NoteComponent implements OnInit {
  //#region form variables
  public goCI: GridOptions;
  public goRI: GridOptions;
  optionName: string = this.route.snapshot.data.title;
  workFlowId: number = this.route.snapshot.data.workFlowId;
  myForm: boolean = false;
  readonly colSearch =
    [
      { headerName: 'Invoice #', field: 'invoiceNo', width: 100 },
      { headerName: 'Invoice Date', field: 'invoiceDate', width: 100 },
      { headerName: 'Storer Group Name', field: 'storerGroupName' },
      { headerName: 'Profit Center Name', field: 'pcName' },
    ];
  frmNote: any;
  loginUser: string;
  ciData: NoteDetail[] = [];
  riData: NoteDetail[] = [];
  lstStorerGroup: any;
  lstProfitCenter: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = agFormHelper.addDays(-35);
  maxDate = new Date();
  submissionButtonsStatus = "";
  @ViewChild('refInvoiceNo', { static: true }) refInvoiceNo: ElementRef;
  @ViewChild('invoiceNo', { static: true }) invoiceNo: ElementRef;
  @ViewChild('remarks', { static: true }) remarks: ElementRef;
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

  constructor(private router: Router, private formbulider: FormBuilder, private svcNote: NoteService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService,
    private route: ActivatedRoute, private svcRecipient: RecipientService, private svcAuth: AuthService,
    private svcFormSubmission: FormSubmissionDialogService, private svcHistoryDlg: HistoryDialogService) {
    this.loginUser = svcAuth.getUserId();
    this.loadLookup();
    this.initGrid();
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
    this.frmNote = this.formbulider.group({
      invoiceId: [null],
      invoiceNo: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      storerGroupId: [null, [Validators.required]],
      storerGroupName: [null],
      pcId: [null, [Validators.required]],
      pcName: [null],
      gstRate: [null],
      workFlowId: [null],
      amount: [null],
      stateName: [null],
      stateId: [null],
      owner: [null],
      completed: [null],
      refInvoiceNo: [null],
      refInvoiceDate: [null],
      refPeriod: [null]
    });
    this.frmNote.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.frmNote.patchValue({
      stateId: 0, stateName: "New", completed: false, invoiceDate: new Date(), workFlowId: this.workFlowId,
      owner: this.svcAuth.getUserId()
    });
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.setActionBarVisibility(agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    this.targetNode = document.getElementById('divSave');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmNote.reset();
    this.frmNote.enable();
    this.frmNote.controls.invoiceNo.disable();
    this.frmNote.patchValue({
      stateId: 0, stateName: "New", completed: false, invoiceDate: new Date(), workFlowId: this.workFlowId, 
      owner: this.svcAuth.getUserId()
    });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.footer.createdBy = this.svcAuth.getUserId();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.refInvoiceNo.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.frmNote.controls.invoiceNo.enable();
    this.invoiceNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcNote.getInvoices(this.workFlowId).subscribe(r => {
        this.svcSearchDlg.open("Search & Select Note", this.colSearch, r);
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
    this.frmNote.controls.invoiceNo.disable();
    if (this.frmNote.controls.stateId.value == 1 || this.frmNote.controls.stateId.value == 5) {
      this.frmNote.controls.remarks.enable();
      agFormHelper.setGridToolbar(true);
      agFormHelper.setGridStatus(true);
    }
    else {
      this.frmNote.disable();
      agFormHelper.setGridToolbar(false);
      agFormHelper.setGridStatus(false);
    }
  }

  tbSave() {
    try {
      this.frmNote.markAllAsTouched();
      if (!this.frmNote.invalid) {
        var formData: Note = this.frmNote.getRawValue();
        formData.previousDetails = this.getCIDataFromGrid();
        formData.revisedDetails = this.getRIDataFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcNote.save(formData).subscribe(
            data => {
              if (this.workFlowId == 5) {
                agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
                this.svcToaster.showSuccess('Debit Note # ' + data.newInvoiceNo + ' saved successfully. Press submit button for onward approval and processing!');
                this.setActionBarVisibility(agFormMode.ReadOnly);
                agFormHelper.setGridToolbar(false);
                agFormHelper.setGridStatus(false);
                (<HTMLButtonElement>document.getElementById("btnGridAdd")).disabled = true;
                this.get(data.newInvoiceNo);
              }
              else {
                this.initForm();
                agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                this.svcToaster.showSuccess('Credit Note # ' + data.newInvoiceNo + ' saved Successfully');
              }
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
    sessionStorage.removeItem("lstNoteCharge");
    sessionStorage.removeItem("lstUom");
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else
      this.router.navigate(['/MainForm']);
  }

  tbHistory(formId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(agEnum.WorkFlow.DebitNote, formId).subscribe(r => {
        this.svcHistoryDlg.open("Debit Note # " + formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions

  //#region form submission
  tbFormSubmission(formId:number, stateId: number) {
    this.svcWaitDlg.open({});
    let recipients, nextStateId: number, sub: Submission = new Submission();
    return new Promise((resolve, reject) => {   
      try {
        if (stateId == 2 || stateId == 5) {
          recipients = this.svcRecipient.getAccInvoiceRecipients(formId, this.workFlowId, stateId);
        }
        if (stateId == 3 || stateId == 4 || stateId == 99) {
          recipients = this.svcRecipient.getCreator(agEnum.WorkFlow.DebitNote, formId);
        }
      forkJoin([recipients]).subscribe(results => {
        var data = results[0];
        recipients = data["recipient"];

        if (stateId == 4 || stateId == 99 ) {
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
          this.svcFormSubmission.open(agEnum.getInvoiceState(nextStateId) + " - Debit Note # " + this.frmNote.controls.invoiceNo.value,
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

  private submit(sub: Submission) {
    if (sub.stateId == 3) {
      sub.completed = true;
      sub.approved = true;
    }
    else if (sub.stateId == 4 || sub.stateId == 99) {
      sub.completed = true;
      sub.rejected = true;
      sub.approved = false;
    }
    else {
      sub.completed = false;
    }
    this.svcWaitDlg.open({});
    this.svcNote.submit(sub).subscribe(
      () => {
        this.svcToaster.showSuccess('Debit Note # ' + sub.formNo + ' was successfully submitted to ' + sub.owner +
          (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments))
        this.tbUndo();
      },
      error => { this.svcToaster.showFailure(error); },
      () => { this.svcWaitDlg.close(); }
    );
  }
  //#endregion FormSubmission

  //#region grid setup
  initGrid() {
    this.goCI = <GridOptions>{
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
        if (params.colDef.field == "chargeTypeId") {
          if (params.data.chargeTypeId != "") {
            params.node.setDataValue("chargeTypeId", parseInt(params.data.chargeTypeId));
          }
          else {
            params.node.setDataValue("chargeTypeId", null);
          }
        }
        if (params.colDef.field == "uoMId") {
          if (params.data.uoMId != "") {
            params.node.setDataValue("uoMId", parseInt(params.data.uoMId));
          }
          else {
            params.node.setDataValue("uoMId", null);
          }
        }
      },
      onRowDataChanged: () => { this.setFooter(); }
    };

    this.goRI = <GridOptions>{
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
        if (params.colDef.field == "chargeTypeId") {
          if (params.data.chargeTypeId != "") {
            params.node.setDataValue("chargeTypeId", parseInt(params.data.chargeTypeId));
          }
          else {
            params.node.setDataValue("chargeTypeId", null);
          }
        }
        if (params.colDef.field == "uoMId") {
          if (params.data.uoMId != "") {
            params.node.setDataValue("uoMId", parseInt(params.data.uoMId));
          }
          else {
            params.node.setDataValue("uoMId", null);
          }
        }
      },
      onRowDataChanged: () => { this.setFooter(); }
    };
  }

  colCI = [
    {
      headerName: 'Existing Invoice Detail',
      children: [
        {
          headerName: "Charge", field: "chargeTypeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'NoteCharge', class: "200" }, valueFormatter: agGridHelper.getNoteChargeName, width: 200
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "UoM", field: "uoMId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'UoM', class: "100" }, valueFormatter: agGridHelper.getUoMName, width: 100
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100,
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100, editable: false
        },
        {
          headerName: "Remarks", field: "remarks", width: 175, cellEditor: "agLargeTextCellEditor"
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddLine() {
    try {
      var res = this.goCI.api.applyTransaction({
        add: [{
          chargeTypeId: null, quantity: 0, uoMId: null, rate: 0, amount: 0, stateId: 1, add: true, edit: false, delete: false
        }]
      });
      this.goCI.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeTypeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine() {
    try {
      if (this.goCI.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goCI.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goCI.api);
        }
        this.setFooter();
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line:');
    }
  };

  getCIDataFromGrid() {
    let rowData = [];
    this.goCI.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  colRI = [
    {
      headerName: 'Revised Invoice Detail',
      children: [
        {
          headerName: "Accessorial Charge", field: "chargeTypeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'NoteCharge', class: "200" }, valueFormatter: agGridHelper.getNoteChargeName, width: 200
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "UoM", field: "uoMId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'UoM', class: "100" }, valueFormatter: agGridHelper.getUoMName, width: 100
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100,
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100, editable: false
        },
        {
          headerName: "Remarks", field: "remarks", width: 175, cellEditor: "agLargeTextCellEditor"
        },

        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddRILine(){
    try {
      var res = this.goRI.api.applyTransaction({
        add: [{
          chargeTypeId: null, quantity: 0, uoMId: null, rate: 0, amount: 0, stateId: 2, add: true, edit: false, delete: false
        }]
      });
      this.goRI.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeTypeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteRILine(){
    try {
      if (this.goRI.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goRI.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goRI.api);
        }
        this.setFooter();
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line:');
    }
  };

  setFooter() {
    try {
      let rAmount = 0, cAmount = 0;
      this.goCI.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.chargeTypeId != undefined && !rowNode.data.delete) {
          cAmount += rowNode.data.amount;
        }
      });
      this.goRI.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.chargeTypeId != undefined && !rowNode.data.delete) {
          rAmount += rowNode.data.amount;
        }
      });
      this.goRI.api.setPinnedBottomRowData([{ chargeTypeId: null, quantity: null, uoMId: null, amount: rAmount }]);
      this.goCI.api.setPinnedBottomRowData([{ chargeTypeId: null, quantity: null, uoMId: null, amount: cAmount }]);
      this.frmNote.patchValue({ amount: Math.abs(rAmount - cAmount) });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  getRIDataFromGrid() {
    let rowData = [];
    this.goRI.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  validateGridStatus() {
    var rd: boolean = (document.querySelector('[id="btnEdit"]')['disabled'] == false || document.querySelector('[id="btnAdd"]')['disabled'] == false);
    agFormHelper.setGridStatus(!rd);
    agFormHelper.setGridToolbar(!rd);
  }

  onCICellChanged(params) {
    const colId = params.column.getId();
    if (colId === "quantity" || colId === "rate") {
      params.node.setDataValue("amount", params.data.quantity * params.data.rate)
      this.setFooter();
    }
  }

  onRICellChanged(params) {
    const colId = params.column.getId();
    if (colId === "quantity" || colId === "rate") {
      params.node.setDataValue("amount", params.data.quantity * params.data.rate)
      this.setFooter();
    }
  }
  //#endregion
 
  //#region local functions
  get(Id: string) {
    try {
      this.svcWaitDlg.open({});
      this.svcNote.get(Id, this.workFlowId).subscribe(
        note => {
          if (note) {
            this.frmNote.disable();
            this.frmNote.controls['invoiceId'].setValue(note.invoiceId);
            this.frmNote.controls['invoiceNo'].setValue(note.invoiceNo);
            this.frmNote.controls['invoiceDate'].setValue(note.invoiceDate);
            this.frmNote.controls['remarks'].setValue(note.remarks);
            this.frmNote.controls['storerGroupId'].setValue(note.storerGroupId);
            this.frmNote.controls['storerGroupName'].setValue(note.storerGroupName);
            this.frmNote.controls['pcId'].setValue(note.pcId);
            this.frmNote.controls['pcName'].setValue(note.pcName);
            this.frmNote.controls['gstRate'].setValue(note.gstRate);
            this.frmNote.controls['amount'].setValue(note.amount);
            this.frmNote.controls['stateId'].setValue(note.stateId);
            this.frmNote.controls['completed'].setValue(note.completed);
            note.stateName = agEnum.getInvoiceState(note.stateId);
            this.frmNote.controls['stateName'].setValue(note.stateName);
            this.frmNote.controls['owner'].setValue(note.owner);
            this.frmNote.controls['refInvoiceNo'].setValue(note.refInvoiceNo);
            this.frmNote.controls['refInvoiceDate'].setValue(note.refInvoiceDate);
            this.frmNote.controls['refPeriod'].setValue(note.refPeriodName);
            this.riData = note.revisedDetails;
            this.ciData = note.previousDetails;
            this.footer = note.footer;
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
    catch (e) { this.svcToaster.showFailure(e); }
  }

  loadInvoiceDetail(refInvoiceNo: string) {
    try {
      if (refInvoiceNo) {
        this.svcWaitDlg.open({});
        this.svcNote.getRefInvInfo(refInvoiceNo).subscribe(
          inv => {
            if (inv) {
              this.frmNote.controls['refInvoiceDate'].setValue(inv.invoiceDate);
              this.frmNote.controls['storerGroupId'].setValue(inv.storerGroupId);
              this.frmNote.controls['storerGroupName'].setValue(inv.storerGroupName);
              this.frmNote.controls['pcId'].setValue(inv.pcId);
              this.frmNote.controls['pcName'].setValue(inv.pcName);
              this.frmNote.controls['refPeriod'].setValue(inv.periodName);
              this.frmNote.controls['gstRate'].setValue(inv.gstRate);
              this.remarks.nativeElement.focus();
            }
            else { this.svcToaster.showWarning("The provided Invoice # doesn't exist or you don't have permission to refer that invoice"); }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcNote.getLookup().subscribe(
        data => {
          sessionStorage.setItem("lstNoteCharge", JSON.stringify(data.lstNoteCharge));
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

  private validate(note: Note) {
    this.errors = [];
    if (note.completed || (note.stateId > 1 && note.stateId != 5) || note.owner != note.footer.createdBy ||
      note.owner != this.svcAuth.getUserId()) {
      this.errors.push('No further changes can be made to this Debit Note at this stage!');
    }
    else {
      if (note.refInvoiceNo == null) {
        this.errors.push('Ref Invoice # is a mandatory field');
      }

      if (note.previousDetails.filter(x => !x.delete).length == 0 || note.revisedDetails.filter(x => !x.delete).length == 0) {
        this.errors.push('Atleast one entry must exist in previous transaction list to perform save operation');
      }
      else {
        let rTotal = 0, pTotal = 0;
        rTotal = note.revisedDetails.filter(x => !x.delete).reduce((sum, current) => sum + current.amount, 0);
        pTotal = note.previousDetails.filter(x => !x.delete).reduce((sum, current) => sum + current.amount, 0);
        if (note.previousDetails.some(x => !x.delete && !x.chargeTypeId)) {
          this.errors.push('Charge type must be selected for every row in Previous Invoice data');
        }
        if (note.previousDetails.some(x => !x.delete && !x.uoMId)) {
          this.errors.push('UoM must be selected for every row of previous Invoice data');
        }
        if (note.previousDetails.some(x => !x.delete && x.quantity <= 0)) {
          this.errors.push('Each row in previous Invoice data must carry +ve Quantity');
        }
        if (note.previousDetails.some(x => !x.delete && x.rate <= 0)) {
          this.errors.push('Each row in previous Invoice data must carry +ve Rate');
        }
        if (note.revisedDetails.some(x => !x.delete && !x.chargeTypeId)) {
          this.errors.push('Charge type must be selected for every row in Revised Invoice data');
        }
        if (note.revisedDetails.some(x => !x.delete && !x.uoMId)) {
          this.errors.push('UoM must be selected for every row of previous Invoice data');
        }
        if (note.revisedDetails.some(x => !x.delete && x.quantity <= 0)) {
          this.errors.push('Each row in revised Invoice data must carry +ve Qty');
        }
        if (note.revisedDetails.some(x => !x.delete && x.rate <= 0)) {
          this.errors.push('Each row in revised Invoice data must carry +ve Rate');
        }

        if (note.amount == 0) {
          this.errors.push('Note can`t be raised with Zero Amount');
        }

        if (this.workFlowId == 5 && rTotal < pTotal) {
          this.errors.push('In order to raise Debit Note, the Required Invoice Details total must be Greater than Current Invoice Details total ');
        }
        else if (this.workFlowId == 6 && rTotal > pTotal) {
          this.errors.push('In order to raise Credit Note, the Required Invoice Details total must be Lesser than Current Invoice Details total ');
        }

        var valueArr = note.previousDetails.filter(x => !x.delete).map(function (item) { return item.chargeTypeId }).slice().sort();
        for (var i = 0; i < valueArr.length - 1; i++) {
          if (valueArr[i + 1] === valueArr[i]) {
            this.errors.push('Charge used in Previous Invoice data must be unique');
            i = valueArr.length;
          }
        }

        var valueArr = note.revisedDetails.filter(x => !x.delete).map(function (item) { return item.chargeTypeId }).slice().sort();
        for (var i = 0; i < valueArr.length - 1; i++) {
          if (valueArr[i + 1] === valueArr[i]) {
            this.errors.push('Charge used in Revised Invoice data must be unique');
          }
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
  }

  private initForm() {
    this.frmNote.reset();
    this.frmNote.disable();
    this.footer = new agFooter();
    this.errors = [];
    this.riData = [];
    this.ciData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
    this.frmNote.patchValue({ stateId: 0, stateName: "New", amount: 0, completed: false, invoiceDate: new Date(), workFlowId: this.workFlowId });
  }
  //#endregion local functions
}
