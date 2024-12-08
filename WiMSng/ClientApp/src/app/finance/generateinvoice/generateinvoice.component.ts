import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Invoice } from './generateinvoice';
import { InvoiceService } from './generateinvoice.service';

@Component({
  selector: 'app-generateinvoice',
  templateUrl: './generateinvoice.component.html',
  styleUrls: ['./generateinvoice.component.css']
})

export class GenerateInvoiceComponent implements OnInit {
  //#region form variables
  optionName: string = 'Generate Invoice';
  myForm: boolean = false;
  frmInvoice: any;
  lstStorerGroup: any;
  lstProfitCenter: any;
  currentUserId: string = this.svcAuth.getUserId();
  errors: string[] = [];
  submissionButtonsStatus = "";
  footer: agFooter = new agFooter();
  @ViewChild('storerGroupId', { static: true }) storerGroupId: MatSelect;
  @ViewChild('formId', { static: true }) formId: ElementRef;
  @ViewChild('btnEdit', { static: true }) btnEdit: HTMLButtonElement;
  readonly colSearch =
    [
      { headerName: 'Form Id', field: 'formId' },
      { headerName: 'Storer Group', field: 'storerGroupName' },
      { headerName: 'Profit Center', field: 'pcName' },
      { headerName: 'State', field: 'stateName' }
    ];
  targetNode: Node;
  config = { childList: true, subtree: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (<HTMLInputElement>document.getElementById('btnEdit')).disabled === false) {
          mutation.addedNodes[0].disabled = true;
        }
      }
    }
  };
  observer = new MutationObserver(this.callback);
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInvoice: InvoiceService, private svcToaster: agToasterService, private svcSearchDlg: SearchDialogService,
    private svcWaitDlg: WaitDialogService, private svcHistoryDlg: HistoryDialogService, private svcRecipient: RecipientService,
    private svcFormSubmission: FormSubmissionDialogService, private svcAuth: AuthService, private route: ActivatedRoute) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmInvoice = this.formbulider.group({
      formId: [null],
      storerGroupId: [null, [Validators.required]],
      pcId: [null, [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      calendarId: [null],
      calendarName: [null],
      gstRate: [null],
      stateId: [null],
      stateName: [null],
      owner: [null],
      completed: [false],
      inclLastPeriod: [false]
    });
    this.frmInvoice.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
    if (_formid != null && _formid > 0) {
      this.get(_formid);
      this.myForm = true;
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divHToolbar');//document.body;//document.getElementById('btnSave') as Node;
    this.observer.observe(this.targetNode, this.config);
  }
  //#region toolbar functions

  tbAdd() {
    this.frmInvoice.reset();
    this.frmInvoice.enable();
    this.frmInvoice.controls.formId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmInvoice.patchValue({
      stateId: 0, completed: false, stateName: "New", owner: this.currentUserId, inclLastPeriod: false//this.svcAuth.getUserId()//this.currentUserId
    });
    this.frmInvoice.controls.storerGroupId.enable();
    this.frmInvoice.controls.stateName.disable();
    this.footer.createdBy = this.currentUserId;//this.svcAuth.getUserId();
    this.storerGroupId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmInvoice.controls.formId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.formId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInvoice.getInvoices().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Invoice Form", this.colSearch, r);
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

  tbHistory(formId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(agEnum.WorkFlow.Invoice, formId).subscribe(r => {
        this.svcHistoryDlg.open("Invoice # " + formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    const inv: Invoice = this.frmInvoice.getRawValue();
    if (inv.stateId == 1 || inv.stateId == 5) {
      if (inv.stateId == 1) {
        this.frmInvoice.enable();
        this.frmInvoice.controls.storerGroupId.disable();
        this.frmInvoice.controls.pcId.disable();
        this.frmInvoice.controls.inclLastPeriod.disable();
      }
      else {
        this.storerGroupId.focus();
        this.frmInvoice.enable();
      }
    }
    else {
      this.frmInvoice.disable();
    }
    this.frmInvoice.controls.inclLastPeriod.disable();
  }

  tbSave() {
    try {
      this.frmInvoice.markAllAsTouched();
      if (!this.frmInvoice.invalid) {
        var formData: Invoice = this.frmInvoice.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcInvoice.validate(formData.storerGroupId, formData.pcId, formData.dateFrom, formData.dateTo).subscribe(
            data => {
              if (Object.keys(data).length == 0) {
                this.svcInvoice.save(formData).subscribe(
                  inv => {
                    this.svcToaster.showSuccess('Invoice Request # ' + inv.newFormId +
                      ' saved successfully. Press submit button to proceed your request for further Approval!');
                    agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
                    this.frmInvoice.controls['formId'].setValue(inv.newFormId);
                    this.frmInvoice.controls['owner'].setValue(inv.owner);
                    this.frmInvoice.controls['stateId'].setValue(1);
                    this.frmInvoice.controls['stateName'].setValue('Saved');
                    this.footer.createdBy = inv.owner;
                    this.frmInvoice.disable();
                    agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormMode.ReadOnly);
                    this.svcWaitDlg.close();
                  }
                );
              }
              else {
                alert('There are ' + Object.keys(data).length + ' error(s) encoutered during invoice data ' +
                  'validation. Please fix issues and retry running invoice generation process');
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
    this.initForm();
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else
      this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region FormSubmission
  tbFormSubmission(formId: number, stateId: number) {
    this.svcWaitDlg.open({});
    let recipients, nextStateId: number, sub: Submission = new Submission();
    return new Promise((resolve, reject) => {
      try {
        if (stateId == 2 || stateId == 5) {
          recipients = this.svcRecipient.getInvoiceRecipients(formId, stateId);
        }
        if (stateId == 3 || stateId == 4 || stateId == 99) {
          recipients = this.svcRecipient.getCreator(agEnum.WorkFlow.Invoice, formId);
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
            this.svcFormSubmission.open(agEnum.getInvoiceState(nextStateId) + " - Invoice Request # " + formId,
              agEnum.getInvoiceState(nextStateId), recipients);
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
                  this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                    "Submission process can not be executed while submission users are missing");
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
    else if (sn.stateId == 4 || sn.stateId == 99) {
      sn.completed = true;
      sn.rejected = true;
      sn.approved = false;
    }
    else {
      sn.completed = false;
    }

    this.svcWaitDlg.open({});
    this.svcInvoice.submit(sn).subscribe(
      () => {
        this.svcToaster.showSuccess('Invoice Generation Req # ' + sn.formId +
          ' was successfully submitted to ' + sn.owner + (sn.comments == "" ? " with no comments " : " with the comments " + sn.comments))
        this.tbUndo();
      }
      , error => { this.svcToaster.showFailure(error); },
      () => { this.svcWaitDlg.close(); }
    );
  }
  //#endregion FormSubmission

  //#region local functions
  getCalendar(sgid: number, pcId: number, inclLastPeriod: boolean) {
    this.svcWaitDlg.open({});
    try {
      this.svcInvoice.getCalendars(sgid, pcId, inclLastPeriod).subscribe(
        cal => {
          if (cal) {
            this.frmInvoice.controls['dateFrom'].setValue((cal.dateFrom));
            this.frmInvoice.controls['dateTo'].setValue((cal.dateTo));
            this.frmInvoice.controls['calendarId'].setValue(cal.calendarId);
            this.frmInvoice.controls['calendarName'].setValue(cal.calendarName);
            this.frmInvoice.controls['gstRate'].setValue(cal.gstRate);
          }
          else {
            this.frmInvoice.reset();
            this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
          }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  get(formId: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInvoice.get(formId).subscribe(
        inv => {
          if (inv) {
            this.frmInvoice.controls['formId'].setValue(formId);
            this.frmInvoice.controls['storerGroupId'].setValue(inv.storerGroupId);
            this.frmInvoice.controls['pcId'].setValue(inv.pcId);
            this.frmInvoice.controls['calendarId'].setValue(inv.calendarId);
            this.frmInvoice.controls['calendarName'].setValue(inv.calendarName);
            this.frmInvoice.controls['dateFrom'].setValue((inv.dateFrom));
            this.frmInvoice.controls['dateTo'].setValue((inv.dateTo));
            this.frmInvoice.controls['inclLastPeriod'].setValue(inv.inclLastPeriod);
            this.frmInvoice.controls['gstRate'].setValue(inv.gstRate);
            this.frmInvoice.controls['stateId'].setValue(inv.stateId);
            inv.stateName = agEnum.getInvoiceState(inv.stateId);
            this.frmInvoice.controls['stateName'].setValue(inv.stateName);
            this.frmInvoice.controls['owner'].setValue(inv.owner);
            this.frmInvoice.controls['completed'].setValue(inv.completed);
            this.footer = inv.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
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
      this.svcInvoice.getLookup().subscribe(
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

  onChange() {
    const inv: Invoice = this.frmInvoice.getRawValue();
    if (inv.storerGroupId && inv.pcId) {
      this.getCalendar(inv.storerGroupId, inv.pcId, inv.inclLastPeriod);
    }
  }

  private validate(inv: Invoice) {
    this.errors = [];
    if (inv.completed ||
      (inv.stateName != 'New' && inv.stateName != 'Saved') ||
      inv.owner != inv.footer.createdBy ||
      inv.owner != this.currentUserId) {
      this.errors.push('No further changes can be made to this Form at this stage!');
    }
    else if (inv.stateId == 5 && inv.owner != inv.footer.createdBy) {
      this.errors.push('The current owner of this Form is ' + inv.owner +
        '!. ' + inv.footer.createdBy + ' can make changes to Form contents provided it is returned to that user!');
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
    this.frmInvoice.reset();
  }
  //#endregion local functions
}
