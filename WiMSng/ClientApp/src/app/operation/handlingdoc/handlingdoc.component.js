"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlingDocComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const footer_1 = require("../../helper/footer");
let HandlingDocComponent = class HandlingDocComponent {
    constructor(router, formbulider, svcWaitDlg, svcHandlingDoc, svcToaster) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWaitDlg = svcWaitDlg;
        this.svcHandlingDoc = svcHandlingDoc;
        this.svcToaster = svcToaster;
        //#region form variables
        this.optionName = 'Update Container Type/Quantity';
        this.lstDocType = [
            { id: 1, name: 'ASN' },
            { id: 2, name: 'SO' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if ((mutation.addedNodes[0].id === 'btnSave' || mutation.addedNodes[0].id === 'btnUndo') && document.getElementById('btnLoad').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        this.loadLookup();
    }
    ngOnInit() {
        this.frmHandlingDoc = this.formbulider.group({
            whId: [null, [forms_1.Validators.required]],
            storerKey: [null, [forms_1.Validators.required]],
            docTypeId: [null, [forms_1.Validators.required]],
            docNo: [null, [forms_1.Validators.required]],
            customerRefNo: [null],
            containerType1: [null],
            qty1: [null],
            containerType2: [null],
            qty2: [null],
            coLoad: [null],
        });
        this.frmHandlingDoc.controls.containerType1.disable();
        this.frmHandlingDoc.controls.qty1.disable();
        this.frmHandlingDoc.controls.containerType2.disable();
        this.frmHandlingDoc.controls.qty2.disable();
        document.getElementById("btnLoad").disabled = false;
    }
    ngAfterViewInit() {
        this.targetNode = document.getElementById('btnLoad');
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbLoad() {
        try {
            this.frmHandlingDoc.markAllAsTouched();
            if (!this.frmHandlingDoc.invalid) {
                var formData = this.frmHandlingDoc.getRawValue();
                this.svcWaitDlg.open({});
                this.svcHandlingDoc.get(formData.whId, formData.storerKey, formData.docNo, formData.docTypeId).subscribe(hd => {
                    if (hd) {
                        this.frmHandlingDoc.controls['whId'].setValue(hd.whId);
                        this.frmHandlingDoc.controls['storerKey'].setValue(hd.storerKey);
                        this.frmHandlingDoc.controls['docTypeId'].setValue(hd.docTypeId);
                        this.frmHandlingDoc.controls['docNo'].setValue(hd.docNo);
                        this.frmHandlingDoc.controls['customerRefNo'].setValue(hd.customerRefNo);
                        this.frmHandlingDoc.controls['containerType1'].setValue(hd.containerType1);
                        this.frmHandlingDoc.controls['qty1'].setValue(hd.qty1);
                        this.frmHandlingDoc.controls['containerType2'].setValue(hd.containerType2);
                        this.frmHandlingDoc.controls['qty2'].setValue(hd.qty2);
                        this.frmHandlingDoc.controls['coLoad'].setValue(hd.coload);
                        this.footer = hd.footer;
                        this.frmHandlingDoc.controls.containerType1.enable();
                        this.frmHandlingDoc.controls.qty1.enable();
                        this.frmHandlingDoc.controls.containerType2.enable();
                        this.frmHandlingDoc.controls.qty2.enable();
                        this.frmHandlingDoc.controls.whId.disable();
                        this.frmHandlingDoc.controls.storerKey.disable();
                        this.frmHandlingDoc.controls.docTypeId.disable();
                        this.frmHandlingDoc.controls.docNo.disable();
                        document.getElementById("btnLoad").disabled = true;
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value pair or you don`t have access to this record');
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        try {
            this.frmHandlingDoc.markAllAsTouched();
            if (!this.frmHandlingDoc.invalid) {
                var formData = this.frmHandlingDoc.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcHandlingDoc.save(formData).subscribe(() => {
                        this.initForm();
                        this.svcToaster.showSuccess('Record saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions 
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcHandlingDoc.getLookUp().subscribe(data => {
                this.lstWarehouse = data.lstWarehouse;
                this.lstContainerType = data.lstContainerType;
                this.lstContainerType.push({ typeId: null, typeName: 'None' });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(hd) {
        this.errors = [];
        if (!hd.containerType1 && hd.qty1 && hd.qty1 != 0) {
            this.errors.push('Please select valid Container Type 1 if you want to assign Container Qty');
        }
        else if (hd.containerType1 && !hd.qty1) {
            this.errors.push('Please provide valid Container Quantity if you wnat to select Container Type 1');
        }
        else if (hd.containerType1 && hd.qty1 <= 0) {
            this.errors.push('Container Quantity 1 must be positive');
        }
        else if (!hd.containerType2 && hd.qty2 && hd.qty2 != 0) {
            this.errors.push('Please select valid Container Type 2 if you want to assign Container Qty');
        }
        else if (hd.containerType2 && !hd.qty2) {
            this.errors.push('Please provide valid Container Quantity if you wnat to select Container Type 2');
        }
        else if (hd.containerType2 && hd.qty2 <= 0) {
            this.errors.push('Container Quantity 2 must be positive');
        }
    }
    initForm() {
        this.frmHandlingDoc.reset();
        this.frmHandlingDoc.enable();
        this.footer = new footer_1.agFooter();
        this.errors = [];
        document.getElementById("btnLoad").disabled = false;
    }
};
__decorate([
    core_1.ViewChild('whId', { static: true })
], HandlingDocComponent.prototype, "whId", void 0);
HandlingDocComponent = __decorate([
    core_1.Component({
        selector: 'app-handlingdoc',
        templateUrl: './handlingdoc.component.html',
        styleUrls: ['./handlingdoc.component.css']
    })
], HandlingDocComponent);
exports.HandlingDocComponent = HandlingDocComponent;
//# sourceMappingURL=handlingdoc.component.js.map