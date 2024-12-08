"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agGridHelper = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
//#region AG Grid Controls
let agGridHelper = class agGridHelper {
    constructor(toaster) {
        this.toaster = toaster;
    }
    static getCellCheckBox() {
        function chkBox() { }
        // gets called once before the renderer is used
        chkBox.prototype.init = function (params) {
            // create the cell
            this.eInput = document.createElement('input');
            this.eInput.type = "checkbox";
            this.eInput.checked = params.value;
        };
        // gets called once when grid ready to insert the element
        chkBox.prototype.getGui = function () {
            return this.eInput;
        };
        // focus and select can be done after the gui is attached
        chkBox.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        // returns the new value after editing
        chkBox.prototype.getValue = function () { return this.eInput.checked; };
        // any cleanup we need to be done here
        chkBox.prototype.destroy = function () { };
        // if true, then this editor will appear in a popup
        chkBox.prototype.isPopup = function () {
            return false;
        };
        return chkBox;
    }
    static getDatePicker() {
        function Datepicker() { }
        Datepicker.prototype.init = function (params) {
            this.eInput = document.createElement("input");
            this.eInput.value = params.value;
            (this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
        };
        Datepicker.prototype.getGui = function () {
            return this.eInput;
        };
        Datepicker.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        Datepicker.prototype.getValue = function () {
            return this.eInput.value;
        };
        Datepicker.prototype.destroy = function () { };
        Datepicker.prototype.isPopup = function () {
            return false;
        };
        return Datepicker;
    }
    static getTimePicker() {
        function TimeEditor() { }
        // gets called once before the renderer is used
        TimeEditor.prototype.init = function (params) {
            // create the cell
            this.Input = document.createElement('input');
            this.Input.value = params.value;
            (this.Input).timepicker({
                timeformat: "hh:mm"
            });
        };
        // gets called once when grid ready to insert the element
        TimeEditor.prototype.getGui = function () {
            return this.eInput;
        };
        // focus and select can be done after the gui is attached
        TimeEditor.prototype.afterGuiAttached = function () {
            this.Input.focus();
            this.Input.select();
        };
        // returns the new value after editing
        TimeEditor.prototype.getValue = function () { return this.Input.value; };
        // any cleanup we need to be done here
        TimeEditor.prototype.destroy = function () { };
        // if true, then this editor will appear in a popup
        TimeEditor.prototype.isPopup = function () {
            return false;
        };
        return TimeEditor;
    }
    static getAgilitySelect() {
        function AgilitySelect() { }
        AgilitySelect.prototype.init = function (params) {
            try {
                this.dropDown = document.createElement('select');
                var style = 'width:' + params.class + 'px;color:blue; background-color:#c9eee3;font-weight: bolder; height:32px; padding-top:0; margin-top: 0; margin-bottom:0;border: 2px blue solid';
                //
                this.dropDown.style.cssText = style;
                switch (params.source) {
                    case "DayType":
                        var lstDayTypes = JSON.parse(sessionStorage.getItem("lstDayType"));
                        lstDayTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "CostHead":
                        var lstCostHeads = JSON.parse(sessionStorage.getItem("lstCostHead"));
                        lstCostHeads.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.headId;
                            opt.innerHTML = x.headName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Supplier":
                        var lstSuppliers = JSON.parse(sessionStorage.getItem("lstSupplier"));
                        lstSuppliers.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.supplierId;
                            opt.innerHTML = x.supplierName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "StorerKey":
                        var lstStorers = JSON.parse(sessionStorage.getItem("lstStorer"));
                        lstStorers.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.storerKey;
                            opt.innerHTML = x.storerName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Period":
                        var lstPeriods = JSON.parse(sessionStorage.getItem("lstPeriod"));
                        lstPeriods.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.periodId;
                            opt.innerHTML = x.periodName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "CostHead":
                        var lstCostHeads = JSON.parse(sessionStorage.getItem("lstCostHead"));
                        lstCostHeads.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.headId;
                            opt.innerHTML = x.headName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "CostStatus":
                        var lstCostStatuss = JSON.parse(sessionStorage.getItem("lstCostStatus"));
                        lstCostStatuss.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.statusId;
                            opt.innerHTML = x.statusName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "PaymentStatus":
                        var lstPaymentStatuss = JSON.parse(sessionStorage.getItem("lstPaymentStatus"));
                        lstPaymentStatuss.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.statusId;
                            opt.innerHTML = x.statusName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "Charge":
                        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
                        lstCharges.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.chargeId;
                            opt.innerHTML = x.chargeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "NoteCharge":
                        var lstNoteCharges = JSON.parse(sessionStorage.getItem("lstNoteCharge"));
                        lstNoteCharges.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "UoM":
                        var lstUoM = JSON.parse(sessionStorage.getItem("lstUoM"));
                        lstUoM.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.uoMId;
                            opt.innerHTML = x.uoMName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "LocCat":
                        var lstLocCategorys = JSON.parse(sessionStorage.getItem("lstLocCategory"));
                        lstLocCategorys.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.categoryId;
                            opt.innerHTML = x.categoryName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "ChargeType":
                        var lstChargeTypes = JSON.parse(sessionStorage.getItem("lstChargeType"));
                        lstChargeTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "InvoiceType":
                        var lstInvoiceTypes = JSON.parse(sessionStorage.getItem("lstInvoiceType"));
                        lstInvoiceTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "ContainerType":
                        var lstContainerTypes = JSON.parse(sessionStorage.getItem("lstContainerType"));
                        lstContainerTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "HType":
                        var lstHandingTypes = JSON.parse(sessionStorage.getItem("lstHandingType"));
                        lstHandingTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "HUnit":
                        var lstHandlingUnits = JSON.parse(sessionStorage.getItem("lstHandlingUnit"));
                        lstHandlingUnits.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.unitId;
                            opt.innerHTML = x.unitName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "LUnit":
                        var lstLooseUnits = JSON.parse(sessionStorage.getItem("lstLooseUnit"));
                        lstLooseUnits.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.unitId;
                            opt.innerHTML = x.unitName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "SType":
                        var lstStorageTypes = JSON.parse(sessionStorage.getItem("lstStorageType"));
                        lstStorageTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "SUnit":
                        var lstStorageUnits = JSON.parse(sessionStorage.getItem("lstStorageUnit"));
                        lstStorageUnits.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.unitId;
                            opt.innerHTML = x.unitName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "PeriodType":
                        var lstPeriodTypes = JSON.parse(sessionStorage.getItem("lstPeriodType"));
                        lstPeriodTypes.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.typeId;
                            opt.innerHTML = x.typeName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                    case "WorkFlow":
                        var lstWorkFlow = JSON.parse(sessionStorage.getItem("lstWorkFlow"));
                        lstWorkFlow.forEach(x => {
                            var opt = document.createElement('option');
                            opt.value = x.workFlowId;
                            opt.innerHTML = x.workFlowName;
                            this.dropDown.appendChild(opt);
                        });
                        break;
                }
                this.dropDown.value = params.value;
            }
            //catch (exception) { showErrorToast('Agility agGrid Select init: ' + exception); }
            catch (exception) {
                this.toaster.showToast('Agility agGrid Select init: ', exception, 'error');
            }
        };
        AgilitySelect.prototype.getGui = function () {
            return this.dropDown;
        };
        AgilitySelect.prototype.afterGuiAttached = function () {
            if (this.dropDown)
                this.dropDown.focus();
        };
        AgilitySelect.prototype.getValue = function () {
            return this.dropDown.value;
        };
        AgilitySelect.prototype.isPopup = function () {
            return true;
        };
        return AgilitySelect;
    }
    static allowEdit(params) {
        return !params.node.isRowPinned();
    }
    static allowRateRowEdit(params) {
        return !params.node.isRowPinned() && params.node.data.action != "D";
    }
    ;
    //static allowChargeEdit(params) {
    //return !params.node.isRowPinned() && !params.node.data.locked;
    //}
    static formatNumbers(x) {
        if (x.value !== undefined && x.value != null) {
            var parts = x.value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    }
    static dateFormatter(params) {
        var dp = new common_1.DatePipe('en-GB');
        return dp.transform(params.value, 'd-MMM-yy');
    }
    static numberValueParser(params) {
        if (params != undefined && params != null)
            return Number(params.newValue);
    }
    static setGridDeleteFilter(gridApi) {
        try {
            gridApi.setFilterModel({ delete: { filter: 'false', filterType: 'text', type: 'equals' } });
        }
        catch (exception) {
            alert('setGridDeleteFilter: ' + exception);
        }
    }
    static setGridIsDeletedFilter(gridApi) {
        try {
            gridApi.setFilterModel({ isDeleted: { filter: 'false', filterType: 'text', type: 'equals' } });
        }
        catch (exception) {
            alert('setGridIsDeletedFilter: ' + exception);
        }
    }
    //#endregion
    //#region Lookup Names
    static getDayTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstDayType = JSON.parse(sessionStorage.getItem("lstDayType"));
        try {
            if (lstDayType != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstDayType.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Day Type---';
            }
        }
        catch (exception) {
            alert('getDayType: ' + exception);
        }
    }
    static getCostHead(x) {
        if (x.node.rowPinned)
            return "";
        var lstCostHead = JSON.parse(sessionStorage.getItem("lstCostHead"));
        try {
            if (lstCostHead != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstCostHead.find(dt => { return dt.headId == x.value; }).headName;
                }
                else
                    return '---Select Cost Head---';
            }
        }
        catch (exception) {
            alert('getCostHead: ' + exception);
        }
    }
    static getSupplier(x) {
        if (x.node.rowPinned)
            return "";
        var lstSupplier = JSON.parse(sessionStorage.getItem("lstSupplier"));
        try {
            if (lstSupplier != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstSupplier.find(dt => { return dt.supplierId == x.value; }).supplierName;
                }
                else
                    return '---Select Supplier---';
            }
        }
        catch (exception) {
            alert('getSupplier: ' + exception);
        }
    }
    static getStorerKey(x) {
        if (x.node.rowPinned)
            return "";
        var lstStorer = JSON.parse(sessionStorage.getItem("lstStorer"));
        try {
            if (lstStorer != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstStorer.find(dt => { return dt.storerKey == x.value; }).storerName;
                }
                else
                    return '---Select Storer Key---';
            }
        }
        catch (exception) {
            alert('getStorerKey: ' + exception);
        }
    }
    static getPeriod(x) {
        if (x.node.rowPinned)
            return "";
        var lstPeriod = JSON.parse(sessionStorage.getItem("lstPeriod"));
        try {
            if (lstPeriod != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstPeriod.find(dt => { return dt.periodId == x.value; }).periodName;
                }
                else
                    return '---Select Period---';
            }
        }
        catch (exception) {
            alert('getPeriod: ' + exception);
        }
    }
    static getCostHeadName(x) {
        if (x.node.rowPinned)
            return "";
        var lstCostHead = JSON.parse(sessionStorage.getItem("lstCostHead"));
        try {
            if (lstCostHead != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstCostHead.find(dt => { return dt.headId == x.value; }).headName;
                }
                else
                    return '---Select Cost Head---';
            }
        }
        catch (exception) {
            alert('getCostHead: ' + exception);
        }
    }
    static getCostStatus(x) {
        if (x.node.rowPinned)
            return "";
        var lstCostStatus = JSON.parse(sessionStorage.getItem("lstCostStatus"));
        try {
            if (lstCostStatus != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstCostStatus.find(dt => { return dt.statusId == x.value; }).statusName;
                }
                else
                    return '---Select Cost Status---';
            }
        }
        catch (exception) {
            alert('getCostStatus: ' + exception);
        }
    }
    static getPaymentStatus(x) {
        if (x.node.rowPinned)
            return "";
        var lstPaymentStatus = JSON.parse(sessionStorage.getItem("lstPaymentStatus"));
        try {
            if (lstPaymentStatus != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstPaymentStatus.find(dt => { return dt.statusId == x.value; }).statusName;
                }
                else
                    return '---Select Payment Status---';
            }
        }
        catch (exception) {
            alert('getPaymentStatus: ' + exception);
        }
    }
    static getChargeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstCharges = JSON.parse(sessionStorage.getItem("lstCharge"));
        try {
            if (lstCharges != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstCharges.find(dt => { return dt.chargeId == x.value; }).chargeName;
                }
                else
                    return '---Select Charge---';
            }
        }
        catch (exception) {
            alert('getCharge: ' + exception);
        }
    }
    static getUoMName(x) {
        if (x.node.rowPinned)
            return "";
        var lstUoM = JSON.parse(sessionStorage.getItem("lstUoM"));
        try {
            if (lstUoM != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstUoM.find(dt => { return dt.uoMId == x.value; }).uoMName;
                }
                else
                    return '---Select UoM---';
            }
        }
        catch (exception) {
            alert('getUoM: ' + exception);
        }
    }
    static getLocCatName(x) {
        if (x.node.rowPinned)
            return "";
        var lstLocCategorys = JSON.parse(sessionStorage.getItem("lstLocCategory"));
        try {
            if (lstLocCategorys != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstLocCategorys.find(dt => { return dt.categoryId == x.value; }).categoryName;
                }
                else
                    return '---Select Location Category---';
            }
        }
        catch (exception) {
            alert('getLocationCategory: ' + exception);
        }
    }
    static getChargeTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstChargeTypes = JSON.parse(sessionStorage.getItem("lstChargeType"));
        try {
            if (lstChargeTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstChargeTypes.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Charge Type---';
            }
        }
        catch (exception) {
            alert('getChargeType: ' + exception);
        }
    }
    static getInvoiceTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstInvoiceTypes = JSON.parse(sessionStorage.getItem("lstInvoiceType"));
        try {
            if (lstInvoiceTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstInvoiceTypes.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Invoice Type---';
            }
        }
        catch (exception) {
            alert('getInvoiceType: ' + exception);
        }
    }
    static getContainerTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstContainerTypes = JSON.parse(sessionStorage.getItem("lstContainerType"));
        try {
            if (lstContainerTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstContainerTypes.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Container Type---';
            }
        }
        catch (exception) {
            alert('getContainerType: ' + exception);
        }
    }
    static getHTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstHandingTypes = JSON.parse(sessionStorage.getItem("lstHandingType"));
        try {
            if (lstHandingTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstHandingTypes.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Handing Type---';
            }
        }
        catch (exception) {
            alert('getHandingType: ' + exception);
        }
    }
    static getHUnitName(x) {
        if (x.node.rowPinned)
            return "";
        var lstHandlingUnits = JSON.parse(sessionStorage.getItem("lstHandlingUnit"));
        try {
            if (lstHandlingUnits != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstHandlingUnits.find(dt => { return dt.unitId == x.value; }).unitName;
                }
                else
                    return '---Select Handling Unit---';
            }
        }
        catch (exception) {
            alert('getHandlingUnit: ' + exception);
        }
    }
    static getLUnit(x) {
        if (x.node.rowPinned)
            return "";
        var lstLooseUnits = JSON.parse(sessionStorage.getItem("lstLooseUnit"));
        try {
            if (lstLooseUnits != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstLooseUnits.find(dt => { return dt.unitId == x.value; }).unitName;
                }
                else
                    return '---Select Loose Unit---';
            }
        }
        catch (exception) {
            alert('getLooseUnit: ' + exception);
        }
    }
    static getSTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstStorageTypes = JSON.parse(sessionStorage.getItem("lstStorageType"));
        try {
            if (lstStorageTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstStorageTypes.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Storage Type---';
            }
        }
        catch (exception) {
            alert('getStorageType: ' + exception);
        }
    }
    static getSUnitName(x) {
        if (x.node.rowPinned)
            return "";
        var lstStorageUnits = JSON.parse(sessionStorage.getItem("lstStorageUnit"));
        try {
            if (lstStorageUnits != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstStorageUnits.find(dt => { return dt.unitId == x.value; }).unitName;
                }
                else
                    return '---Select Storage Unit---';
            }
        }
        catch (exception) {
            alert('getStorageUnit: ' + exception);
        }
    }
    static getPeriodTypeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstPeriodTypes = JSON.parse(sessionStorage.getItem("lstPeriodType"));
        try {
            if (lstPeriodTypes != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstPeriodTypes.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Period Unit---';
            }
        }
        catch (exception) {
            alert('getPeriodUnit: ' + exception);
        }
    }
    static getWorkFlowName(x) {
        if (x.node.rowPinned)
            return "";
        var lstWorkFlow = JSON.parse(sessionStorage.getItem("lstWorkFlow"));
        try {
            if (lstWorkFlow != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstWorkFlow.find(dt => { return dt.workFlowId == x.value; }).workFlowName;
                }
                else
                    return '---Select Work Flow---';
            }
        }
        catch (exception) {
            alert('getWorkFlowName: ' + exception);
        }
    }
    static getNoteChargeName(x) {
        if (x.node.rowPinned)
            return "";
        var lstNoteCharges = JSON.parse(sessionStorage.getItem("lstNoteCharge"));
        try {
            if (lstNoteCharges != null) {
                if (Number.isNaN(x.value)) {
                    x.value = "";
                }
                if (x.value != undefined && x.value != "" && x.value != null) {
                    return lstNoteCharges.find(dt => { return dt.typeId == x.value; }).typeName;
                }
                else
                    return '---Select Note Charge---';
            }
        }
        catch (exception) {
            alert('getNoteCharge: ' + exception);
        }
    }
};
agGridHelper.colHistory = [
    { headerName: 'Sender', field: 'sender', width: 100 },
    { headerName: 'Recipient', field: 'recipient', width: 100 },
    { headerName: 'State', field: 'stateName', width: 120 },
    { headerName: 'Activity Date', field: 'sentOn', width: 100 },
    { headerName: 'Comments', field: 'remarks', tooltipField: 'remarks' }
];
agGridHelper = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], agGridHelper);
exports.agGridHelper = agGridHelper;
//# sourceMappingURL=agGridHelper.js.map