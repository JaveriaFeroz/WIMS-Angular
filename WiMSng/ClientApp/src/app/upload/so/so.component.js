"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soComponent = void 0;
const core_1 = require("@angular/core");
const xlsx = require("xlsx");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
const so_1 = require("./so");
let soComponent = class soComponent {
    //#endregion
    constructor(router, formbulider, svcLC, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcLC = svcLC;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region form variables
        this.optionName = 'Shipment Order';
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmso = this.formbulider.group({
        //whId: [null, [Validators.required]],
        //storerKey: [null, [Validators.required]],
        //TransactionDate: [null, [Validators.required]]
        });
        //this.loadLookup();
        this.frmso.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        document.getElementById("UploadFile").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmso.reset();
        this.frmso.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        document.getElementById("UploadFile").disabled = false;
        //this.whId.focus();
    }
    tbSave() {
        try {
            this.frmso.markAllAsTouched();
            if (!this.frmso.invalid) {
                var formData = this.frmso.getRawValue();
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
                        var sos = this.getData(jsonData, jsonData[0].length);
                        if (this.errors.length == 0)
                            this.validate(sos);
                        if (this.errors.length > 0) {
                            this.errors;
                            return;
                        }
                        else {
                            this.svcWaitDlg.open({});
                            this.svcLC.save(sos).subscribe(() => {
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
        if (this.wipDocument.size > 5000001) { // 5MB
            this.svcToaster.showFailure('Upload utility does not allow upload of file more than 5 MB. Please reduce file size and retry');
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
        var lcs = [], proNumber = "", LC = new so_1.so();
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
                LC = new so_1.so();
                LC.OrderKey = currentRecord[0].trim();
                LC.Storerkey = currentRecord[1].trim();
                LC.CustomerOrderNo = currentRecord[2].trim();
                LC.ContainerType = currentRecord[3].trim();
                LC.ContainerQty = currentRecord[4].trim();
                LC.Warehouse = currentRecord[5].trim();
                LC.ActualShipmentDate = currentRecord[6].trim();
                lcs.push(LC);
            }
        }
        //if (st.details.length != 0)
        //sts.push(st);
        return lcs;
    }
    loadLookup() {
        try {
            this.svcLC.getLookUp().subscribe(data => { this.lstWarehouse = data.lstWarehouse; }, error => { this.svcToaster.showFailure(error); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(lc) {
        this.errors = [];
        //if (st.some(x => x.proNo == "")) {
        //  this.errors.push('No row in Storage Upload can have empty PRO Number');
        //}
        //if (st.some(y => y.details.some(x => x.so == ""))) {
        //  this.errors.push('so is a required field and must be provided in each row of upload sheet');
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
        this.frmso.reset();
        this.frmso.disable();
        this.errors = [];
        document.getElementById("UploadFile").disabled = true;
        document.getElementById("UploadFile").value = null;
    }
};
__decorate([
    core_1.ViewChild('whId', { static: true })
], soComponent.prototype, "whId", void 0);
soComponent = __decorate([
    core_1.Component({
        selector: 'app-st',
        templateUrl: './so.component.html',
        styleUrls: ['./so.component.css']
    })
], soComponent);
exports.soComponent = soComponent;
//# sourceMappingURL=so.component.js.map