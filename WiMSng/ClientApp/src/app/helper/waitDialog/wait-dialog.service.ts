import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { WaitDialogComponent } from '../waitDialog/wait-dialog.component';

@Injectable()
export class WaitDialogService {
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<WaitDialogComponent>;

  public open(options: MatDialogConfig<any>) {
    options.disableClose = true;
    if (this.dialog.openDialogs.length == 0)
      this.dialogRef = this.dialog.open(WaitDialogComponent, options);
  }

  public close() {
    this.dialogRef.close();
  }
}
