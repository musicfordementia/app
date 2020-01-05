import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status == 401) {
                this.api.signout();
                this.router.navigate(['/']);
                return;
            }

            return throwError(err.error.message || err);
        }));
    }
}