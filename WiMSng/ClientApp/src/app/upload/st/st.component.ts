import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import * as xlsx from 'xlsx';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ST } from './st';
import { STService } from './st.service';
import { STDetail } from './stdetail';

@Component({
  selector: 'app-st',
  templateUrl: './st.component.html',
  styleUrls: ['./st.component.css']
})
export class STComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Storage Balance';
  frmST: any;
  lstWarehouse: any;
  wipDocument: File;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('whId', { static: true }) whId: MatSelect;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcST: STService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
  }

  ngOnInit() {
    this.frmST = this.formbulider.group({
      whId: [null, [Validators.required]],
      storerKey: [null, [Validators.required]],
      TransactionDate: [null, [Validators.required]]
    });
    this.loadLookup();
    this.frmST.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    (<HTMLInputElement>document.getElementById("UploadFile")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmST.reset();
    this.frmST.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    (<HTMLInputElement>document.getElementById("UploadFile")).disabled = false;
    this.whId.focus();
  }

  tbSave() {
    try {
      this.frmST.markAllAsTouched();
      if (!this.frmST.invalid) {
        var formData: ST = this.frmST.getRawValue();
        if (!formData.whId || !formData.storerKey || !formData.TransactionDate) {
          this.svcToaster.showFailure("Please select valid Warehouse Storer and Transaction Date Key before uploading the file!");
        }
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
            var sts: ST[] = this.getData(formData.storerKey, formData.whId, formData.TransactionDate, jsonData, jsonData[0].length);
            if (this.errors.length == 0)
              this.validate(sts);
            if (this.errors.length > 0) {
              this.errors;
              return;
            }
            else {
              this.svcWaitDlg.open({});
              this.svcST.save(sts).subscribe(
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
  getData(storerKey: string, whId: number, Transactiondate: Date, jsonData: any[][], headerLength: number) {
    this.errors = [];
    var sts: ST[] = [], proNumber = "", st: ST = new ST();
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
        st = new ST();
        st.storerKey = storerKey;
        st.whId = whId;
        st.TransactionDate = Transactiondate;
        st.lottable01 = currentRecord[0].trim();
        st.lottable02 = currentRecord[1].trim();
        st.lottable03 = currentRecord[2].trim();
        st.lottable04 = currentRecord[3].trim();
        st.lottable05 = currentRecord[4].trim();
        st.lottable06 = currentRecord[5].trim();
        st.lottable07 = currentRecord[6].trim();
        st.lottable08 = currentRecord[7].trim();
        st.lottable09 = currentRecord[8].trim();
        st.lottable11 = currentRecord[9].trim();
        st.lottable12 = currentRecord[10].trim();
        st.lottable13 = currentRecord[11].trim();
        st.lottable14 = currentRecord[12].trim();
        st.lottable15 = currentRecord[13].trim();
        st.lottable16 = currentRecord[14].trim();
        st.lottable17 = currentRecord[15].trim();
        st.lottable18 = currentRecord[16].trim();
        //proNumber = currentRecord[1].trim();
        //st.rmaNo = currentRecord[0].trim();
        //st.proNo = proNumber;
        //st.carrierRef = currentRecord[2].trim();
        //st.containerKey = currentRecord[3].trim();
        //st.whRef = currentRecord[4].trim();
        //st.carrierKey = currentRecord[5].trim();
        //st.udf1 = currentRecord[6].trim();
        //st.udf2 = currentRecord[7].trim();
        // }
        //let asd: STDetail = new STDetail();
        ////asd.sku = currentRecord[8].trim();
        ////asd.quantity = parseInt(currentRecord[9].trim());
        //asd.lottable01 = currentRecord[0].trim();
        //asd.lottable02 = currentRecord[1].trim();
        //asd.lottable03 = currentRecord[2].trim();
        //asd.lottable04 = currentRecord[3].trim();
        //asd.lottable05 = currentRecord[4].trim();
        //asd.lottable06 = currentRecord[5].trim();
        //asd.lottable07 = currentRecord[6].trim();
        //asd.lottable08 = currentRecord[7].trim();
        //asd.lottable09 = currentRecord[8].trim();
        //asd.lottable11 = currentRecord[9].trim();
        //asd.lottable12 = currentRecord[10].trim();
        //asd.lottable13 = currentRecord[11].trim();
        //asd.lottable14 = currentRecord[12].trim();
        //asd.lottable15 = currentRecord[13].trim();
        //asd.lottable16 = currentRecord[14].trim();
        //asd.lottable17 = currentRecord[15].trim();
        //asd.lottable18 = currentRecord[16].trim();
        //st.details.push(asd);
        sts.push(st);
      }
    }
    //if (st.details.length != 0)
    //sts.push(st);
    return sts;
  }

  private loadLookup() {
    try {
      this.svcST.getLookUp().subscribe(
        data => { this.lstWarehouse = data.lstWarehouse; },
        error => { this.svcToaster.showFailure(error); }
      );
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private validate(st: ST[]) {
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
    this.frmST.reset();
    this.frmST.disable();
    this.errors = [];
    (<HTMLInputElement>document.getElementById("UploadFile")).disabled = true;
    (<HTMLInputElement>document.getElementById("UploadFile")).value = null;
  }
  //#endregion local functions
}
