/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class BookOutDetailService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  getWorkerList() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
      .map(this.extractData);
  }
  getApptDetails(apptid) {
    return this.http.get(this.apiEndPoint + '/api/appointments/' + apptid)
      .map(this.extractData);
  }
  updateBookoutData(dataObj, apptid) {
    return this.http.put(this.apiEndPoint + '/api/appointments/bookout/' + apptid, dataObj)
    .map(this.extractData);
  }
}
