import { HttpClient, HttpStatusCode } from '@angular/common/http';

export interface ErrorResponse {
  apiPath: string;
  errorCode: HttpStatusCode;
  errorMessage: string;
  errorTime: Date;
}

export interface SuccessResponse {
  statusCode: string;
  statusMessage: string;
}
