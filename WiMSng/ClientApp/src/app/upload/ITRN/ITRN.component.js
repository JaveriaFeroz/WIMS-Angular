"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITRNComponent = void 0;
const core_1 = require("@angular/core");
const xlsx = require("xlsx");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
const ITRN_1 = require("./ITRN");
let ITRNComponent = class ITRNComponent {
    //#endregion
    constructor(router, formbulider, svcITRN, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcITRN = svcITRN;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region form variables
        this.optionName = 'Inventory Transaction';
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmITRN = this.formbulider.group({});
        //this.loadLookup();
        this.frmITRN.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        document.getElementById("UploadFile").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmITRN.reset();
        this.frmITRN.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        document.getElementById("UploadFile").disabled = false;
        this.whId.focus();
    }
    tbSave() {
        try {
            this.frmITRN.markAllAsTouched();
            if (!this.frmITRN.invalid) {
                var formData = this.frmITRN.getRawValue();
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
                    var arrayBuffer = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i)
                        arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = xlsx.read(bstr, { type: "binary" });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    let jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false, dateNF: "DD-MMM-YYYY", header: 1, defval: "" });
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
                        var ITRNs = this.getData(jsonData, jsonData[0].length);
                        if (this.errors.length == 0)
                            this.validate(ITRNs);
                        if (this.errors.length > 0) {
                            this.errors;
                            return;
                        }
                        else {
                            this.svcWaitDlg.open({});
                            this.svcITRN.save(ITRNs).subscribe(() => {
                                this.initForm();
                                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                                this.svcToaster.showSuccess('Upload request(s) created Successfully');
                            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                        }
                    }
                };
                fileReader.readAsArrayBuffer(this.wipDocument);
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    fileUpload(event) {
        this.wipDocument = event.target.files[0];
        if (!this.wipDocument) {
            this.svcToaster.showFailure("Please select valid file to be uploaded and then click Upload button");
            return;
        }
        if (this.wipDocument.size > 25000000) { // 25MB
            this.svcToaster.showFailure('Upload utility does not allow upload of file more than 25 MB. Please reduce file size and retry');
            return;
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    getData(jsonData, headerLength) {
        this.errors = [];
        var ITRNs = [], proNumber = "", itrn = new ITRN_1.ITRN();
        for (let i = 1; i < jsonData.length; i++) {
            debugger;
            let currentRecord = jsonData[i];
            if (currentRecord.length == headerLength) {
                if (currentRecord[1].trim() == "") {
                    this.errors.push("row # " + (i + 1).toString() + " contains blank Pro Number, Pro number is a key field and can't be left blank, upload process failed!");
                    return;
                }
                itrn = new ITRN_1.ITRN();
                itrn.storerKey = currentRecord[0].trim();
                itrn.Sku = currentRecord[1].trim();
                itrn.TranType = currentRecord[2].trim();
                itrn.SourceKey = currentRecord[3].trim();
                itrn.PackKey = currentRecord[4].trim();
                itrn.UoM = currentRecord[5].trim();
                itrn.Quantity = currentRecord[6].trim();
                itrn.Warehouse = currentRecord[7].trim();
                itrn.PalletId = currentRecord[8].trim();
                itrn.TransactionDate = currentRecord[9].trim();
                itrn.Is10x = currentRecord[10].trim();
                ITRNs.push(itrn);
            }
        }
        //if (st.details.length != 0)
        //sts.push(st);
        return ITRNs;
    }
    loadLookup() {
        try {
            this.svcITRN.getLookUp().subscribe(data => { this.lstWarehouse = data.lstWarehouse; }, error => { this.svcToaster.showFailure(error); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(itrn) {
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
    validateHeader(header) {
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
    initForm() {
        this.frmITRN.reset();
        this.frmITRN.disable();
        this.errors = [];
        document.getElementById("UploadFile").disabled = true;
        document.getElementById("UploadFile").value = null;
    }
};
__decorate([
    core_1.ViewChild('whId', { static: true })
], ITRNComponent.prototype, "whId", void 0);
ITRNComponent = __decorate([
    core_1.Component({
        selector: 'app-st',
        templateUrl: './ITRN.component.html',
        styleUrls: ['./ITRN.component.css']
    })
], ITRNComponent);
exports.ITRNComponent = ITRNComponent;
//# sourceMappingURL=ITRN.component.js.map