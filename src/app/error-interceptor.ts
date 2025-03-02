import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private matDialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "An unknown error occured";
                if(error.error.message){
                    errorMessage = error.error.message;
                }
                console.log(errorMessage)
                this.matDialog.open(ErrorComponent, {data: {message: errorMessage}});
                return throwError(error);
            })
        );
    }
}