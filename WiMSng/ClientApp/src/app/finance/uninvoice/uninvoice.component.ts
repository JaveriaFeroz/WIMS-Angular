import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { UnInvoiceService } from './uninvoice.service';

@Component({
  selector: 'app-uninvoice',
  templateUrl: './uninvoice.component.html',
  styleUrls: ['./uninvoice.component.css']
})

export class UnInvoiceComponent implements OnInit {
  //#region form variables
  optionName: string = 'Un Invoice'; 
  frmUnInvoice: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('invoiceNo', { static: true }) invoiceNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcUnInvoice: UnInvoiceService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
  }

  ngOnInit() {
    this.frmUnInvoice = this.formbulider.group({
      invoiceNo: [null, [Validators.required]],
      acknowledge: [false],
    });
    this.invoiceNo.nativeElement.focus();
  }

  //#region toolbar functions
  tbSave() {
    try {
      this.frmUnInvoice.markAllAsTouched();
      if (!this.frmUnInvoice.invalid) {
        const inv = this.frmUnInvoice.getRawValue();
        this.svcWaitDlg.open({});
        this.svcUnInvoice.unInvoice(inv.invoiceNo, inv.acknowledge).subscribe(
          () => {
            this.initForm();
            this.svcToaster.showSuccess('Un invoice operation completed successfully!');
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
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  } 
  //#endregion toolbar functions

  //#region local functions
  private initForm() {
    this.frmUnInvoice.reset();  
  }
  //#endregion local functions
}
