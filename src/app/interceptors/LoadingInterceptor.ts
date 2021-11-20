import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, finalize } from "rxjs/operators";
import { LoadingService } from "../services/loading-service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.totalRequests++;

    setTimeout(() => {
      this.loadingService.setLoading(true);
    }, 0);

    return next.handle(request).pipe(
      delay(100),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
