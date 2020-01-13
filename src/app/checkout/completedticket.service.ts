import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CompletedTicketService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    getApptDetails(apptid) {
        return this.http.get(this.apiEndPoint + '/api/appointments/' + apptid)
            .map(this.extractData);
    }
    /**
   * to get the ticket services from ticketservice table
   */
    getTicketServicesByApptId(apptid) {
        return this.http.get(this.apiEndPoint + '/api/checkout/services/' + apptid)
            .map(this.extractData);
    }
    /**
    * to get the ticket products from ticketproduct table
    */
    getTicketProducts(apptId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/ticketproducts/' + apptId)
            .map(this.extractData);
    }
    /**
* To get ticket payment Records by ApptId
*/
    getTicketPaymentData(apptId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/ticketpayments/' + apptId)
            .map(this.extractData);
    }
    /**
     * To get workerTips list
     */
    getTipsList(apptId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/tips/' + apptId)
            .map(this.extractData);
    }
    /**
     * To get other list
     */
    getOthersTicketList(ticketId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/ticketother/' + ticketId)
            .map(this.extractData);
    }
    /**
    * To get Included Tickets
    */
    getIncludedTicketList(ticketId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/apptincludetickets/' + ticketId)
            .map(this.extractData);
    }
    /**
   * To get other list
   */
    sendReciept(dataObj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/emailreciept', { 'data': dataObj })
            .map(this.extractData);
    }
    /**
      * To get clientRewards List
      */
    clientRewardDatabyApptId(apptid, isRefund) {
        return this.http.get(this.apiEndPoint + '/api/checkout/clientRewards/' + apptid + '/' + isRefund)
            .map(this.extractData);
    }
    /**
     * @param
     * worker lists only active  worker for day only
     */
    getWorkerLists() {
        return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
            .map(this.extractData);
    }
    serviceNoteUpdate(obj) {
        return this.http.put(this.apiEndPoint + '/api/checkout/serviceUpdateWrkNotes/' + obj.apptId, obj)
            .map(this.extractData);
    }
    productUpdate(obj) {
        return this.http.put(this.apiEndPoint + '/api/checkout/productUpdateWrk/' + obj.productId, obj)
            .map(this.extractData);
    }
    otherUpdate(obj) {
        return this.http.put(this.apiEndPoint + '/api/checkout/otherUpdateWrk/' + obj.otherId, obj)
            .map(this.extractData);
    }
    tipAmountUpdate(obj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/tipAmountUpdate', obj)
            .map(this.extractData);
    }
    ratingUpdate(obj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/ratingUpdate', obj)
            .map(this.extractData);
    }
    AdditionalTipAmount(obj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/extraTipAmt', obj)
            .map(this.extractData);
    }
    getPaymentList() {
        return this.http.get(this.apiEndPoint + '/api/checkout/getPaymentList')
            .map(this.extractData);
    }
    updatePaymentList(obj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/updatePaymentList', obj)
            .map(this.extractData);
    }
    addPaymentTipAmt(obj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/addPaymentTipAmt', obj)
            .map(this.extractData);
    }
    activeSerive(id) {
        return this.http.get(this.apiEndPoint + '/api/checkout/activeSerive/' + id)
            .map(this.extractData);
    }
    getPosdevices() {
        return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/posdevices')
            .map(this.extractData);
    }
    updateTipAmount(obj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/updateTipAmount', obj)
            .map(this.extractData);
    }
    /*To extract json data*/
    private extractData(res: Response) {
        if (res.headers && res.headers.get('token')) {
            localStorage.setItem('token', res.headers.get('token'));
        }
        const body = res.json();
        return body || {};
    }
}
