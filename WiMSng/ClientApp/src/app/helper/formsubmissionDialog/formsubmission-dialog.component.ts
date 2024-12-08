import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-formsubmission-dialog',
  templateUrl: './formsubmission-dialog.component.html',
  styleUrls: ['./formsubmission.component.css']
})

export class FormSubmissionDialogComponent {
  //stateName: string;
  lstRecipient: any[];
  //header: any;
  //submissionComments: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    header: string, stateName: string,
    recipientId: string, recipients: any[], submissionComments: string
  },
    private mdDialogRef: MatDialogRef<FormSubmissionDialogComponent>) {
    this.lstRecipient = data.recipients;
    if (data.recipients.length === 1)
      data.recipientId = data.recipients[0].recipientId;
    else
      data.recipientId = null;
  }

  onSubmit(result) {
    if (!result.recipientId) {
      alert("Please select valid Recipient from dropdown before submitting the form!");
      return;
    }
    this.mdDialogRef.close(result);
  }

  onClose() {
    this.mdDialogRef.close(true);
  }
}
