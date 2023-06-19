import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private _authentication: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._authentication.getToken();
    console.log("interceptor called");

    if (!token) {
      return next.handle(request);
    } else {
      return next.handle(request.clone({
        setHeaders: {
          "authorization": `bearer ${token}` 
        }
      }));
    }
  }
}
