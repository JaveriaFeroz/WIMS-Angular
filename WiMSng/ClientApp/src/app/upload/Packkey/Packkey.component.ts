import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import * as xlsx from 'xlsx';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Packkey } from './Packkey';
import { PackkeyService } from './PackkeyService.service';

@Component({
  selector: 'app-st',
  templateUrl: './Packkey.component.html',
  styleUrls: ['./Packkey.component.css']
})
export class PackkeyComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Location Category';
  frmPackkey: any;
  lstWarehouse: any;
  wipDocument: File;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('whId', { static: true }) whId: MatSelect;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcLC: PackkeyService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
  }

  ngOnInit() {
    this.frmPackkey = this.formbulider.group({
      //whId: [null, [Validators.required]],
      //storerKey: [null, [Validators.required]],
      //TransactionDate: [null, [Validators.required]]
    });
    //this.loadLookup();
    this.frmPackkey.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    (<HTMLInputElement>document.getElementById("UploadFile")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmPackkey.reset();
    this.frmPackkey.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    (<HTMLInputElement>document.getElementById("UploadFile")).disabled = false;
    //this.whId.focus();
  }

  tbSave() {
    try {
      this.frmPackkey.markAllAsTouched();
      if (!this.frmPackkey.invalid) {
        var formData: Packkey = this.frmPackkey.getRawValue();
        
        //if (!formData.TransactionDate) {
        //  console.log(formData.TransactionDate)
        //  this.svcToaster.showFailure("Please select Transactiondate before uploading the file!");
        //  return;
        //}
        if (!this.wipDocument) {
          this.svcToaster.showFailure("Please select valid file to be uploaded and then click Upload button");
          return;
        }
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          var arrayBuffer: any = fileReader.result;
          var data = new Uint8Array(arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = xlsx.read(bstr, { type: "binary" });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          let jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, { raw: false, dateNF: "DD-MMM-YYYY", header: 1, defval: "" });
          if (jsonData.length < 1) {
            this.svcToaster.showFailure("No data found in your selected sheet, upload can't proceed further");
            return;
          }
          this.validateHeader(jsonData[0]);
          if (this.errors.length > 0) {
            this.errors;
            return;
          }
          else {
            var Packkeys: Packkey[] = this.getData(jsonData, jsonData[0].length);
            if (this.errors.length == 0)
              this.validate(Packkeys);
            if (this.errors.length > 0) {
              this.errors;
              return;
            }
            else {
              this.svcWaitDlg.open({});
              this.svcLC.save(Packkeys).subscribe(
                () => {
                  this.initForm();
                  agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                  this.svcToaster.showSuccess('Upload request(s) created Successfully');
                },
                error => { this.svcToaster.showFailure(error); },
                () => { this.svcWaitDlg.close(); }
              );
            }
          }
        }
        fileReader.readAsArrayBuffer(this.wipDocument);
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  fileUpload(event) {
    this.wipDocument = event.target.files[0];
    if (!this.wipDocument) {
      this.svcToaster.showFailure("Please select valid file to be uploaded and then click Upload button")
      return;
    }
    if (this.wipDocument.size > 5000001) { // 5MB
      this.svcToaster.showFailure('Upload utility does not allow upload of file more than 5 MB. Please reduce file size and retry');
      return;
    }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  getData(jsonData: any[][], headerLength: number) {
    this.errors = [];
    var lcs: Packkey[] = [], proNumber = "", LC: Packkey = new Packkey();
    for (let i = 1; i < jsonData.length; i++) {
      debugger;
      let currentRecord = jsonData[i];
      if (currentRecord.length == headerLength) {
        if (currentRecord[1].trim() == "") {
          this.errors.push("row # " + (i + 1).toString() + " contains blank Pro Number, Pro number is a key field and can't be left blank, upload process failed!");
          return;
        }
        //if (proNumber != currentRecord[1].trim()) {
        //if (st.details.length > 0) {
        //  sts.push(st);
        //}
        LC = new Packkey();
        LC.PackKey = currentRecord[0].trim();
        LC.Each = currentRecord[1].trim();
        LC.InnerPack = currentRecord[2].trim();
        LC.Cases = currentRecord[3].trim();
        LC.Pallet = currentRecord[4].trim();

        lcs.push(LC);
      }
    }
    //if (st.details.length != 0)
    //sts.push(st);
    return lcs;
  }

  private loadLookup() {
    try {
      this.svcLC.getLookUp().subscribe(
        data => { this.lstWarehouse = data.lstWarehouse; },
        error => { this.svcToaster.showFailure(error); }
      );
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private validate(lc: Packkey[]) {
    this.errors = [];
    //if (st.some(x => x.proNo == "")) {
    //  this.errors.push('No row in Storage Upload can have empty PRO Number');
    //}
    //if (st.some(y => y.details.some(x => x.sku == ""))) {
    //  this.errors.push('SKU is a required field and must be provided in each row of upload sheet');
    //}
    //if (st.some(y => y.details.some(x => !x.quantity || x.quantity <= 0))) {
    //  this.errors.push('Quantity in each row must be greater than zero');
    //}
  }

  private validateHeader(header: string[]) {
    this.errors = [];
    //if (header[0].trim() != "RMA Number") {
    //  this.errors.push('RMA Number is a required field. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings');
    //}
    //if (header[1].trim() != "Pro Number") {
    //  this.errors.push('Pro Number column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[2].trim() != "Carriers Ref") {
    //  this.errors.push('Carriers Ref column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[3].trim() != "Container Ref") {
    //  this.errors.push('Container Ref column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[4].trim() != "Warehouse Ref") {
    //  this.errors.push('Warehouse Ref column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[5].trim() != "Carrier") {
    //  this.errors.push('Carrier column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[6].trim() != "User1") {
    //  this.errors.push('User1 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[7].trim() != "User2") {
    //  this.errors.push('User2 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[8].trim() != "Commodity") {
    //  this.errors.push('Commodity column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[9].trim() != "Expected Qty") {
    //  this.errors.push('Expected Qty column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[10].trim() != "Lottable01") {
    //  this.errors.push('Lottable01 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[11].trim() != "Lottable02") {
    //  this.errors.push('Lottable02 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[12].trim() != "Lottable03") {
    //  this.errors.push('Lottable03 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[13].trim() != "Lottable04") {
    //  this.errors.push('Lottable04 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[14].trim() != "Lottable05") {
    //  this.errors.push('Lottable05 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[15].trim() != "Lottable06") {
    //  this.errors.push('Lottable06 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[16].trim() != "Lottable07") {
    //  this.errors.push('Lottable07 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[17].trim() != "Lottable08") {
    //  this.errors.push('Lottable08 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[18].trim() != "Lottable09") {
    //  this.errors.push('Lottable09 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
    //if (header[19].trim() != "Lottable10") {
    //  this.errors.push('Lottable10 column does not exists or out of position. Please note that system is mapped one-to-one with these columns so ensure you are refering to Excel file containing exact same column headings and position');
    //}
  }

  private initForm() {
    this.frmPackkey.reset();
    this.frmPackkey.disable();
    this.errors = [];
    (<HTMLInputElement>document.getElementById("UploadFile")).disabled = true;
    (<HTMLInputElement>document.getElementById("UploadFile")).value = null;
  }
  //#endregion local functions
}
