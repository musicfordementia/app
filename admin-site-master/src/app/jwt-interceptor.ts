import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
    constructor(private api: ApiService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.api.getToken();
        if (token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }
        return next.handle(request);
    }
}