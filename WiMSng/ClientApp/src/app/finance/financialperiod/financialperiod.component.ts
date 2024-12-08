import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { FinancialPeriodService } from './financialperiod.service';

@Component({  
  selector: 'app-financialperiod',  
  templateUrl: './financialperiod.component.html',  
  styleUrls: ['./financialperiod.component.css']  
})  

export class FinancialPeriodComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Period Closure';
  frmFinancialPeriod: any;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcFinancialPeriod: FinancialPeriodService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService ) {
  }  
  
  ngOnInit() {
    this.frmFinancialPeriod = this.formbulider.group({
      periodName: [null],
      currentMonth: [null],
      currentYear: [null], 
    });
    this.get();
  }

  //#region toolbar functions
  tbSave() {
    if (!this.frmFinancialPeriod.invalid) {
      this.svcWaitDlg.open({});
      this.svcFinancialPeriod.close().subscribe(
        () => {
          this.initForm();
          this.get();
          this.svcToaster.showSuccess('Current period successfully closed and subsequent Period opened accordingly');
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
  }   

  tbExit() {  
    this.router.navigate(['/MainForm']);      
  }
  //#endregion toolbar functions

  //#region local functions
  get() {  
    try {
      this.svcFinancialPeriod.get().subscribe(
        financialperiod => {
          if (financialperiod) {
            this.frmFinancialPeriod.controls['periodName'].setValue(financialperiod.periodName);
            this.frmFinancialPeriod.controls['currentMonth'].setValue(financialperiod.currentMonth);
            this.frmFinancialPeriod.controls['currentYear'].setValue(financialperiod.currentYear);           
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => {  });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmFinancialPeriod.reset();
  }
  //#endregion local functions
}
