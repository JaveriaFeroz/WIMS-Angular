import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { CostProvision } from './costprovision';
import { CostProvisionService } from './costprovision.service';
import { CostProvisionDetail } from './costprovisiondetail';

@Component({
  selector: 'app-costprovision',
  templateUrl: './costprovision.component.html',
  styleUrls: ['./costprovision.component.css']
})

export class CostProvisionComponent implements OnInit {
  //#region form variables
  public goCP: GridOptions;
  readonly optionName: string = 'Cost Provisions';
  myForm: boolean = false;
  readonly colSearch =
    [
      { headerName: 'Provision #', field: 'provisionId', width: 70 },
      { headerName: 'Warehouse', field: 'whName' },
      { headerName: 'Profit Center', field: 'pcName' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Owner', field: 'owner' },
    ];
  frmCP: any;
  cpData: CostProvisionDetail[] = [];
  loginUser: string;
  lstProfitCenter: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  submissionButtonsStatus = "";
  @ViewChild('provisionId', { static: true }) provisionId: ElementRef;
  @ViewChild('pcId', { static: true }) pcId: MatSelect;
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

  constructor(private route: ActivatedRoute, private router: Router, private formbulider: FormBuilder,
    private svcCostProvision: CostProvisionService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService,
    private svcHistoryDlg: HistoryDialogService,  private svcRecipient: RecipientService,
    private svcFormSubmission: FormSubmissionDialogService, private svcAuth: AuthService) {
    this.loginUser = svcAuth.getUserId();
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmCP = this.formbulider.group({
      provisionId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],
      periodName: [null],
      periodId: [null],
      stateName: [null],
      stateId: [null],
      owner: [null],
      completed: [null]
    });
    this.frmCP.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);

    var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
    if (_formid > 0) {
      this.get(_formid)
      this.myForm = true;
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngAfterViewInit() {
    this.disableSave();
    this.targetNode = document.getElementById('divSave');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmCP.reset();
    this.frmCP.enable();
    this.frmCP.controls.provisionId.disable();
    this.frmCP.patchValue({
      stateId: 0, stateName: "New", completed: false, periodId: this.svcAuth.getPeriodId,
      periodName: this.svcAuth.getPeriodName(), owner: this.svcAuth.getUserId(),
    });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.footer.createdBy = this.svcAuth.getUserId();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.pcId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmCP.controls.provisionId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.provisionId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCostProvision.getCostProvisions().subscribe(r => {
        this.svcSearchDlg.open("Search & Select  Cost Provision", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.provisionId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmCP.enable();
    this.frmCP.controls.provisionId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);   
    const cp = this.frmCP.getRawValue();
    if (cp.StateId > 1) {
      this.frmCP.controls.pcId.disable();
      agFormHelper.setGridToolbar(false);
      agFormHelper.setGridStatus(false);
    }
    else {
      agFormHelper.setGridToolbar(true);
      agFormHelper.setGridStatus(true);
    }
    this.pcId.focus();
  }

  tbLoad() {
    try {
      this.frmCP.markAllAsTouched();
      if (this.frmCP.controls.pcId.value) {
        this.svcWaitDlg.open({});
        this.svcCostProvision.load(this.frmCP.controls.pcId.value).subscribe(cp => {
          if (cp.length != 0) {
            this.cpData = cp;
            this.frmCP.controls.pcId.disable();
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); })
      }
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  tbSave() {
    try {
      this.frmCP.markAllAsTouched();
      if (!this.frmCP.invalid) {
        var formData: CostProvision = this.frmCP.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
            return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcCostProvision.save(formData).subscribe(
            data => {
              agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
              this.svcWaitDlg.close();
              this.svcToaster.showSuccess(' Cost Provision # ' + data.provisionId +
                ' saved successfully. Please click submit button to proceed further!');
              this.get(data.provisionId);
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
    sessionStorage.removeItem("lstSupplier");
    sessionStorage.removeItem("lstCostHead");
    sessionStorage.removeItem("lstPeriod");
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else
      this.router.navigate(['/MainForm']);
  }

  tbHistory(formId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(agEnum.WorkFlow.CostProvision, formId).subscribe(r => {
        this.svcHistoryDlg.open("Activity History for Cost Provision # " + formId, agGridHelper.colHistory, r);
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
          recipients = this.svcRecipient.getCPRecipients(formId, stateId);
        }
        else if (stateId == 3 || stateId == 4 || stateId == 99) {
          recipients = this.svcRecipient.getCreator(agEnum.WorkFlow.CostProvision, formId);
        }
        forkJoin([recipients]).subscribe(results => {
          recipients = results[0]["recipient"];
          if (stateId == 4 || stateId == 99) {
            nextStateId = stateId;
          }
          else {
            nextStateId = results[0]["nextStateId"];
          }

          if (recipients === undefined || recipients.length == 0) {
            this.svcToaster.showWarning("No Recipient(s) are configured for current state of this Form. " +
              "Submission process can not continue while Recipient are missing.");
            this.svcWaitDlg.close();
            return;
          }
          else {
            this.svcFormSubmission.open("Cost Provision # " + this.frmCP.controls.provisionId.value, agEnum.getCPState(nextStateId), recipients);
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

  private submit(sub: Submission) {
    if (sub.stateId == 3) {
      sub.approved = true;
      sub.completed = true;
    }
    else if (sub.stateId == 4 || sub.stateId == 99) {
      sub.rejected = true;
      sub.approved = false;
      sub.completed = true;
    }
    else {
      sub.completed = false;
    }

    this.svcCostProvision.submit(sub).subscribe(
      () => {
        this.svcToaster.showSuccess('Cost Provision # ' + sub.formId +
          ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments))
        this.initForm();
        this.router.navigate(['/MainForm']);
      },
      error => { this.svcToaster.showFailure(error); },
      () => { }
    );
  }
  //#endregion FormSubmission

  //#region grid setup
  initGrid() {
    this.goCP = <GridOptions>{
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
      onRowDataChanged: () => { this.setFooter(); }
    };
  }

  colCP = [
    {
      headerName: "Expense", field: "costHeadId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'CostHead', class: "250" }, valueFormatter: agGridHelper.getCostHeadName, width: 250
    },
    {
      headerName: "Supplier", field: "supplierId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'Supplier', class: "200" }, valueFormatter: agGridHelper.getSupplier, width: 200
    },
    {
      headerName: "Period", field: "periodId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'Period', class: "100" }, valueFormatter: agGridHelper.getPeriod, width: 100
    },    
    {
      headerName: "AmtExTax", field: "grossAmount", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 80
    },
    {
      headerName: "Tax Amt", field: "taxAmount", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 80 
    },
    {
      headerName: "Net Amt", field: "netAmount", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100, editable: false
    },
    {
      headerName: "Desc", field: "description", width: 250, cellEditor: "agLargeTextCellEditor"
    },
    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
  ];

  onAddLine  () {
    try {
      var res = this.goCP.api.applyTransaction({
        add: [{
          costHeadId: null, supplierId: null, periodId: null, grossAmount: 0, taxAmount: 0, netAmount:0, description: null,
          add: true, edit: false, delete: false
        }]
      });
      this.goCP.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "costHeadId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goCP.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goCP.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goCP.api);
          this.setFooter();
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  onCellValueChanged(params) {
    const field = params.colDef.field;
    if (!params.data.add)
      params.data.edit = true;

    if (field == "costHeadId") {
      if (params.data.costHeadId != "") {
        params.node.setDataValue("costHeadId", parseInt(params.data.costHeadId));
      }
      else {
        params.node.setDataValue("costHeadId", null);
      }
    }
    else if (field == "supplierId") {
      if (params.data.supplierId != "") {
        params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
      }
      else {
        params.node.setDataValue("supplierId", null);
      }
    }
    else if (field == "periodId") {
      if (params.data.periodId != "") {
        params.node.setDataValue("periodId", parseInt(params.data.periodId));
      }
      else {
        params.node.setDataValue("periodId", null);
      }
    }
    else if (field === "grossAmount" || field === "taxAmount") {
      const rowNode = this.goCP.api.getDisplayedRowAtIndex(params.rowIndex);
      rowNode.setDataValue('netAmount', params.data.grossAmount + params.data.taxAmount);
      this.setFooter();
    }
  }

  setFooter() {
    try {
      let _grossAmount = 0, _taxAmount = 0, _netAmount = 0;
      this.goCP.api.forEachNode(function (rowNode, index) {
        if (!rowNode.data.delete && rowNode.data.costHeadId != undefined) {
          _grossAmount += rowNode.data.grossAmount,
            _taxAmount += rowNode.data.taxAmount, _netAmount += rowNode.data.netAmount
        }
      });
      this.goCP.api.setPinnedBottomRowData([{
        costHeadId: null, supplierId: null, periodId: null, 
        grossAmount: _grossAmount, taxAmount: _taxAmount, netAmount: _netAmount
      }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  getDetailFromGrid() {
    let rowData = [];
    this.goCP.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcCostProvision.get(Id).subscribe(
        cp => {
          if (cp) {
            this.frmCP.disable();
            this.frmCP.controls['provisionId'].setValue(cp.provisionId);
            this.frmCP.controls['pcId'].setValue(cp.pcId);
            this.frmCP.controls['periodId'].setValue(cp.periodId);
            this.frmCP.controls['periodName'].setValue(cp.periodName);
            this.frmCP.controls['stateId'].setValue(cp.stateId);
            this.frmCP.controls['completed'].setValue(cp.completed);
            cp.stateName = agEnum.getCPState(cp.stateId);
            this.frmCP.controls['stateName'].setValue(cp.stateName);
            this.frmCP.controls['owner'].setValue(cp.owner);         
            this.cpData = cp.details;
            this.goCP.api.setRowData(cp.details);
            this.footer = cp.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
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
      this.svcWaitDlg.open({});
      this.svcCostProvision.getLookup().subscribe(
        data => {
          this.lstProfitCenter = data.lstProfitCenter;
          sessionStorage.setItem("lstCostHead", JSON.stringify(data.lstCostHead));
          sessionStorage.setItem("lstSupplier", JSON.stringify(data.lstSupplier));
          sessionStorage.setItem("lstPeriod", JSON.stringify(data.lstPeriod));
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) { this.svcToaster.showFailure(e);}
  }

  private validate(cp: CostProvision) {
    this.errors = [];
    if (cp.completed || cp.stateId > 1 || cp.owner != cp.footer.createdBy || cp.owner != this.svcAuth.getUserId()) {
      this.errors.push('No further changes can be made to Cost Provision at this stage!');
    }
    else {
      if (cp.details.filter(x => !x.delete).length == 0) {
        this.errors.push('Atleast one row must exist in Grid to perform save operation');
      }
      else if (cp.details.some(x => !x.delete && !x.costHeadId || !x.supplierId || !x.periodId)) {
        this.errors.push('No row in Cost Provision Transaction can have empty Cost Head, Supplier or Period');
      }
      else if (cp.details.some(x => !x.delete && x.grossAmount <= 0)) {
        this.errors.push('The Amount Excl Tax in each row must be greater than zero');
      }
      else if (cp.details.some(x => !x.delete && x.taxAmount < 0)) {
        this.errors.push('The Tax Amount in each row must be zero or +ve');
      }
      if (cp.details.filter(x => !x.delete).length > 0) {
        var detDuplicate = cp.details.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, costId: item.costHeadId, periodId: item.periodId })).slice().sort();
        for (var i = 0; i < detDuplicate.length - 1; i++) {
          if (detDuplicate[i + 1]['supplierId'] === detDuplicate[i]['supplierId']) {
            if (detDuplicate[i + 1]['costId'] === detDuplicate[i]['costId']) {
              if (detDuplicate[i + 1]['periodId'] === detDuplicate[i]['periodId']) {
                this.errors.push('The combination of Supplier, Cost Head and Period must be unique!');
                i = detDuplicate.length;
              }
            }
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
    this.frmCP.reset();
    this.frmCP.disable();
    this.footer = new agFooter();
    this.errors = [];
    this.cpData = [];
    this.setFooter();
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
  }
  //#endregion local functions
}
