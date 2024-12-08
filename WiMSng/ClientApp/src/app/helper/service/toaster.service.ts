import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class agToasterService {
  constructor(
    private toastr: ToastrService) {
  }

  showSuccess(message: string, title?: string) {
    this.toastr.toastrConfig.positionClass = "toast-top-right";
    this.toastr.toastrConfig.timeOut = 2500;
    this.toastr.success(message, title);
  };

  showFailure(message: string, title: string = "Error Occurred") {
    this.toastr.toastrConfig.positionClass = "toast-bottom-right";
    this.toastr.toastrConfig.timeOut = 2500;
    this.toastr.error(message, title);
  }

  showWarning(message: string, title: string = "Attention!") {
    this.toastr.toastrConfig.positionClass = "toast-top-right";
    this.toastr.toastrConfig.timeOut = 2500;
    this.toastr.warning(message, title);
  }
}
