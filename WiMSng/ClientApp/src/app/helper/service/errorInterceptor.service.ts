import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { agToasterService } from './toaster.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return <any>next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          //console.error('An error occurred:', error.error.message);
          this.toaster.showFailure('An error occurred:' + error.error.message, "Http Error");
        } else if (error.error) {
          if (error.error.title) 
            this.toaster.showFailure(`${error.error.title}`, `${error.statusText}:`);
          else if (error.error.message)
            this.toaster.showFailure(`${error.error.message}`, `${error.error.fieldName}:`);
          else if (error.message)
            this.toaster.showFailure(`${error.message}`, `${error.statusText}:`);
          else
            this.toaster.showFailure(`${error.error.substring(0, 200)}`, `${ error.statusText }:`)
          

          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          //console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          //this.toaster.showFailure(`${error.error.substring(50, 250)}`, `${error.status}:`);

          //this.toaster.showFailure(error.error.substring(49, error.error.indexOf("The statement has been")));
       
  
        }
        else {
          this.toaster.showFailure(`${error.message}`, `${error.status}:`);
        }
        return EMPTY;
      })
    );
  }
  constructor(private toaster: agToasterService) {
  }
}
