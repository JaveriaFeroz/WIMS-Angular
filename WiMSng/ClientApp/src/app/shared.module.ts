import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './app.material.module';
import { FooterComponent } from './common/footer/footer.component';
import { FormSubmissionDialogComponent } from './helper/formsubmissionDialog/formsubmission-dialog.component';
import { HistoryDialogComponent } from './helper/historyDialog/history-dialog.component';
import { SearchDialogComponent } from './helper/searchDialog/search-dialog.component';
import { agToasterService } from './helper/service/toaster.service';
import { ErrorInterceptorService } from './helper/service/errorInterceptor.service';
import { TokenInterceptorService } from './helper/service/tokenInterceptor.service';
import { WaitDialogComponent } from './helper/waitDialog/wait-dialog.component';
import { WaitDialogService } from './helper/waitDialog/wait-dialog.service';
import { SearchDialogService } from './helper/searchDialog/search-dialog.service';
import { HistoryDialogService } from './helper/historyDialog/history-dialog.service';
import { FormSubmissionDialogService } from './helper/formsubmissionDialog/formsubmission-dialog.service';

@NgModule({
  declarations: [FooterComponent, WaitDialogComponent, SearchDialogComponent, HistoryDialogComponent, FormSubmissionDialogComponent
   ],
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule, AgGridModule.withComponents([]),
    ToastrModule.forRoot({ timeOut: 2000, enableHtml: true })],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent, MatProgressBarModule, AgGridModule, ToastrModule],
  entryComponents: [WaitDialogComponent, SearchDialogComponent, HistoryDialogComponent, FormSubmissionDialogComponent]
})
export class SharedModule { 
static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [WaitDialogService,
        SearchDialogService,
        HistoryDialogService,
        FormSubmissionDialogService,
        agToasterService,
       
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptorService,
          multi: true,
        }]
    };
  }
}
//to be used when services to be shared like search, wait etc
