import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { agToasterService } from './service/toaster.service';
import * as xlsx from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
export enum agFormMode { Initialize, Add, Edit, Recall, ReadOnly, Review }

@Injectable({ providedIn: 'root' })
export class agFormHelper {
  constructor(private toaster: agToasterService) { }

  static checkAuthorization(FormName: string) {

  }

  static setFormControls(optionName, formMode: agFormMode) {
    var data = JSON.parse(sessionStorage.getItem("UserAccess")).find(o => o.optionName == optionName);
    if (data) {
      var canAdd = data.canAdd; var canEdit = data.canEdit;
      if (document.getElementById('btnAdd') as HTMLInputElement != null) {
        (document.getElementById('btnAdd') as HTMLInputElement).disabled = !canAdd || formMode != agFormMode.Initialize;
      }
      if (document.getElementById('btnEdit') as HTMLInputElement != null) {
        (document.getElementById('btnEdit') as HTMLInputElement).disabled = !canEdit || formMode != agFormMode.ReadOnly;
      }
      if (document.getElementById('btnSave') as HTMLInputElement != null) {
        (document.getElementById('btnSave') as HTMLInputElement).disabled = (formMode != agFormMode.Edit || !canEdit) && formMode != agFormMode.Add;
      }

      if (formMode != agFormMode.Initialize) {
        if (document.getElementById('btnSearch') != null) {
          (document.getElementById('btnSearch') as HTMLInputElement).disabled = true;
        }
        (document.getElementById('btnUndo') as HTMLInputElement).disabled = false;
      }
      else {
        if (document.getElementById('btnSearch') != null) {
          (document.getElementById('btnSearch') as HTMLInputElement).disabled = false;
        }
        (document.getElementById('btnUndo') as HTMLInputElement).disabled = true;
      }
      if (document.getElementById('btnRecall') != null) {
        (document.getElementById('btnRecall') as HTMLInputElement).disabled = formMode != agFormMode.Initialize;
      }
      (document.getElementById('btnExit') as HTMLInputElement).disabled = (formMode != agFormMode.Initialize) && (formMode != agFormMode.Review);
      if (formMode == agFormMode.ReadOnly) {
        if (document.getElementById('btnEdit') as HTMLInputElement)
          document.getElementById('btnEdit').focus();
      }
    }
    else {
      if (document.getElementById('btnAdd') as HTMLInputElement)
        (document.getElementById('btnAdd') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnEdit') as HTMLInputElement)
        (document.getElementById('btnEdit') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnDelete') as HTMLInputElement)
        (document.getElementById('btnDelete') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnSave') as HTMLInputElement)
        (document.getElementById('btnSave') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnRecall') as HTMLInputElement)
        (document.getElementById('btnRecall') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnSearch') as HTMLInputElement)
        (document.getElementById('btnSearch') as HTMLInputElement).disabled = true;
    }
  }

  static setGridStatus(enable: boolean = true) {
    if (enable) {
      document.querySelectorAll('[id^="grd"]').forEach(x => x.classList.remove('ag-disabled'));
    }
    else {
      document.querySelectorAll('[id^="grd"]:not([class~="ag-disabled"])').forEach(x => x.classList.add('ag-disabled'));
    }      
  }

  static setGridToolbar(enable: boolean) {
    document.querySelectorAll('[id^="tbGrid"]').forEach(x => x.querySelectorAll("button").forEach((a) => {
      if (enable) {
        a.removeAttribute('disabled');
      }
      else if (!a.hasAttribute('disabled')) {
        a.setAttribute('disabled', 'true');
      }
    }));
  }

  static getISODate(date: Date): string {
    date = new Date(date);
    return new Date(date.setHours(date.getHours() + (date.getTimezoneOffset() * -1 / 60))).toISOString().split('T')[0];
  }

  static padL(text: string, padChar: string = "0", size: number = 10): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size).toString();
  }

  static addDays(days: number, initialDate: Date = new Date()) {
    return new Date(new Date().setDate(initialDate.getDate() + days));
  }

  static ExporttoExcel(data: any[], fileName: string) {
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(data);
    const workbook: xlsx.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
