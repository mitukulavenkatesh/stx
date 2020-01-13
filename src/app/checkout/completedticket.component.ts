import {
  Component, ViewContainerRef, ViewEncapsulation, OnInit, ViewChild, OnDestroy,
  AfterViewInit, Inject, Output, EventEmitter, Directive, HostListener, ElementRef, NgZone
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CompletedTicketService } from './completedticket.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../common/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { JwtHelper } from 'angular2-jwt';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { parse } from 'url';
import { DecimalPipe } from '@angular/common';
declare let $: any;
declare var swal: any;

@Component({
  selector: 'app-completedticket',
  templateUrl: './completedticket.html',
  styleUrls: ['./completedticket.css'],
  providers: [CompletedTicketService, CommonService],
})
export class CompletedTicketComponent implements OnInit {
  apptId: any;
  TicketServiceData = [];
  bookApptVal = '';
  ticketPaymentList: any;
  electronicPaymentData: any;
  ticketProductsList: any;
  error = '';
  rewardsList = [];
  toastermessage: any;
  selWor = '';
  apptData = {
    'apdate': '', 'clientName': '', 'visttype': '', 'clientId': '', 'Status__c': '', 'aptName': '', 'cltemail': '',
    'Name': '', 'isRefund__c': 0
  };
  clientName: any;
  visitType: any;
  noclientLabel: any;
  accountBal: any;
  clientId: any;
  workerTipsList: any;
  ticketOthersList: any;
  includedTicketsList: any = [];
  serviceTotal = 0.00;
  productTotal = 0.00;
  otherTotal = 0.00;
  tipTotal = 0.00;
  paymentTotal = 0.00;
  paymentTotal1 = 0.00;
  includedTicketsTotal = 0.00;
  status: any;
  serTax = 0;
  prodTax = 0;
  totalTax = 0;
  totalsTax = 0;
  subTotal = 0;
  CreatedDate = ['', ''];
  emailTemplate = false;
  LastModifiedDate = ['', ''];
  apptName: any;
  clientEmail: any;
  isRebook = false;
  isBookAppt = false;
  balanceDue = 0.00;
  merchantName = '';
  ticketNumber: any;
  lastmofdate: any;
  companyInfo: any;
  decodedToken: any;
  packageTax = 0;
  inputs = [];
  activeWorkerLists: any;
  tipsArray = [];
  serviceName: any;
  serviceId: any;
  serviceworkerId = '';
  productWorkerId = '';
  productName = '';
  productId = '';
  otherWorkerId: any;
  otherName: any;
  otherId: any;
  serviceNotes: '';
  lists = [];
  delTipAry = [];
  styleOnClickPoor: any = 'logo-active';
  styleOnClickFair: any = 'logo-active';
  styleOnClickGood: any = 'logo-active';
  ticketRate = '';
  tipAmountAdd: any = 0;
  paymentType = 'Cash';
  tipName = 'Tip Left In Drawer';
  errTipAmount: any;
  errPaymnetType: any;
  errTipName: any;
  closeTicketModal: any;
  paymentList: any;
  paymentValue: any;
  paymentId: any;
  tipAmount: any;
  cashBackAmt = 0;
  serviceLists: any;
  tipArrTicketServ: any = [];
  paymentTypeCash: any;
  decodeUserToken: any;
  posLists: any;
  editTipAmnt: any = 0;
  setPermissin = 0;
  cashDrawer: any;
  productListsWorkers: any;
  serviceAmount = 0;
  productAmount = 0;
  otherAmount = 0;
  serTax1 = 0;
  prepaidTax = 0;

  @ViewChild('recieptModal') public recieptModal: ModalDirective;
  @ViewChild('smileModal') public smileModal: ModalDirective;
  @ViewChild('productModal') public productModal: ModalDirective;
  @ViewChild('serviceModal') public serviceModal: ModalDirective;
  @ViewChild('otherModal') public otherModal: ModalDirective;
  @ViewChild('tipModal') public tipModal: ModalDirective;
  @ViewChild('editTicketModal') public editTicketModal: ModalDirective;
  @ViewChild('paymentModal') public paymentModal: ModalDirective;
  @ViewChild('editTipModal') public editTipModal: ModalDirective;
  constructor(private completedTicketService: CompletedTicketService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(params => {
      this.apptId = route.snapshot.params['TicketId'];
    });
  }
  ngOnInit() {
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
      this.decodeUserToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
    } catch (error) {
      this.decodedToken = {};
      this.decodeUserToken = {};
    }
    if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
    } else {
      this.decodedToken = {};
    }

    if (localStorage.getItem('browserObject')) {
      const cashDrawerObj = localStorage.getItem('browserObject');
      this.cashDrawer = JSON.parse(cashDrawerObj).CashDrawer.split(' ')[0];
    }
    this.getOthersTicketDetails();
    this.getTicketServices(this.apptId);
    this.getTicketProducts(this.apptId);
    this.getIncludedTickets(this.apptId);
    this.getApptDetails(this.apptId);
    this.getTicketPayment(this.apptId);
    this.getWorkerTips();
    this.posDeviceList();
    this.listPayment();
  }
  /**
   * Method to get appointment details
   */
  getApptDetails(apptid) {
    this.completedTicketService.getApptDetails(apptid).subscribe(data => {
      this.apptData = data['result'][0];
      if (this.apptData) {
        this.ticketNumber = this.apptData.Name; // displaying at header //
        this.lastmofdate = data['result'][0].lastmofdate.split(' ');
        this.clientName = this.apptData.clientName ? this.apptData.clientName : '';
        if (this.apptData.visttype === 'null') {
          this.visitType = '';
        } else {
          this.visitType = this.apptData.visttype;
        }
        this.clientId = this.apptData.clientId;
        this.status = this.apptData.Status__c;
        this.apptName = this.apptData.aptName;
        this.clientEmail = this.apptData.cltemail;
        const isRefund = this.apptData.isRefund__c;
        this.getClientRewardDatabyApptId(this.apptId, isRefund);
        if (this.apptId && !this.clientName || this.clientName === '' || this.clientName === null) {
          this.noclientLabel = 'NO CLIENT';
          this.accountBal = 0;
        }
        if (this.apptData && this.apptData.apdate !== '') {
          const date = new Date(this.apptData.apdate);
          const apptDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          // const displayName = document.getElementById('displayNameId');
          // displayName.innerHTML = 'Completed Ticket ' + this.apptData.Name + '</br>' + '<span style = "margin-left: 30px">' + apptDate + '</span>';
          // const displayURL = document.getElementById('headerBCId2');
          // displayURL.innerHTML = 'Completed Ticket ' + this.apptData.Name;
        } else {
          const date = new Date();
          const apptDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          // const displayName = document.getElementById('displayNameId');
          // displayName.innerHTML = 'New Ticket' + '</br>' + '<span style = "margin-left: 30px">' + apptDate + '</span>';
        }

        /**
         * Rebook Button validation
         */
        if ((this.clientId !== 'null' || this.clientId !== '') && (this.apptId !== 'null' || this.apptId !== '')) {
          const date1 = new Date();
          const date2 = new Date(this.apptData.apdate);
          const today = (date1.getMonth() + 1) + '-' + date1.getDate() + '-' + date1.getFullYear();
          const apptDate1 = (date2.getMonth() + 1) + '-' + date2.getDate() + '-' + date2.getFullYear();
          if ((this.status === 'Checked In' || this.status === 'Complete') && (apptDate1 === today) && this.clientId) {
            this.isRebook = this.apptData['isNoService__c'] === 0 ? true : false;
          } else if ((this.status === 'Checked In' || this.status === 'Complete') && (apptDate1 < today) && this.clientId) {
            this.isBookAppt = this.apptData['isNoService__c'] === 0 ? true : false;
          }
        }
        this.getWorkerLists();
        this.styleOnClickPoor = 'logo-active';
        this.styleOnClickFair = 'logo-active';
        this.styleOnClickGood = 'logo-active';
        if (this.apptData['Ticket_Rating__c'] === 'Good') {
          this.styleOnClickPoor = 'logo-inactive';
          this.styleOnClickFair = 'logo-inactive';
        } else if (this.apptData['Ticket_Rating__c'] === 'Fair') {
          this.styleOnClickPoor = 'logo-inactive';
          this.styleOnClickGood = 'logo-inactive';
        } else if (this.apptData['Ticket_Rating__c'] === 'Poor') {
          this.styleOnClickGood = 'logo-inactive';
          this.styleOnClickFair = 'logo-inactive';
        }
      }
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /**
   * Method to get ticket services
   */
  getTicketServices(apptid) {
    this.completedTicketService.getTicketServicesByApptId(apptid).subscribe(data => {
      this.TicketServiceData = data['result'].ticetServices;
      if (this.TicketServiceData && this.TicketServiceData.length > 0) {
        this.bookApptVal = 'Rebook';
      } else {
        this.bookApptVal = 'Book Appt';
      }
      this.calServRetTax();
      this.showDataInView();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /**
   * Method to get ticket products
   */
  getTicketProducts(apptid) {
    this.completedTicketService.getTicketProducts(apptid).subscribe(data => {
      this.ticketProductsList = data['result'];
      this.calServRetTax();
      this.calCharge();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /**
   * Method to get ticket payments
   */
  getTicketPayment(apptId) {
    this.completedTicketService.getTicketPaymentData(this.apptId)
      .subscribe(data => {
        this.ticketPaymentList = data['result'].paymentList;
        let totalvalueSum = 0;
        for (let u = 0; u < this.ticketPaymentList.length; u++) {
          totalvalueSum += Number(this.ticketPaymentList[u].Amount_Paid__c);
        }
        this.cashBackAmt = (this.subTotal + this.totalTax) - totalvalueSum;
        this.electronicPaymentData = data['result'].elecpaymtRefunds;

        if (data['result'] && data['result'].balanceDue.length > 0) {
          this.balanceDue += +parseFloat((data['result'].balanceDue[0].balancedue)).toFixed(2);
          // console.log('325====', this.balanceDue);
        }
        if (this.ticketPaymentList && this.ticketPaymentList.length > 0) {
          this.CreatedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].CreatedDate);
          // this.CreatedDate = data['result'].balanceDue[0].CreatedDate;
          this.LastModifiedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].LastModifiedDate);
          this.checkdate(this.LastModifiedDate);
        } else {
          this.ticketPaymentList = [];
          this.CreatedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].CreatedDate);
          this.LastModifiedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].LastModifiedDate);
          this.ticketPaymentList = data['result'].balanceDue.map((obj) => {
            obj['paymentTypeName'] = 'Ticket # ' + obj['Name']; obj['Amount_Paid__c'] = -obj['inclAmount'];
            obj['type'] = 'included'; return obj;
          });
        }
        this.calCharge();
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              if (statuscode === '2040') {
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                window.scrollTo(0, 0);
              } else if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              } break;
          }
        });
  }
  /**
   * Method to get worker tips
   */
  getWorkerTips() {
    this.completedTicketService.getTipsList(this.apptId).subscribe(data => {
      this.workerTipsList = data['result'];
      data['result'].forEach(element => {
        this.tipsArray.push({
          'id': element['tipId'],
          'workerId': element['Worker__c'],
          'workerName': element['workerName'],
          'tipAmount': element['Tip_Amount__c'],
          'tipOption': element['Tip_Option__c'],
          'Drawer_Number__c': element['Drawer_Number__c'] ? element['Drawer_Number__c'] : this.cashDrawer
        });
      });
      this.calCharge();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2040') {
              this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              window.scrollTo(0, 0);
            } else if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            } break;
        }
      });
  }
  /**
   * Method to get others ticket details
   */
  getOthersTicketDetails() {
    this.completedTicketService.getOthersTicketList(this.apptId).subscribe(data => {
      this.ticketOthersList = data['result'];
      this.ticketOthersList = this.ticketOthersList.map((obj) => {
        if (obj.Transaction_Type__c === 'Package') {
          obj.packageName = '- ' + obj.packageName;
          obj.Amount__c = obj.Package_Price__c;
        } else {
          obj.packageName = '';
        }
        return obj;
      });
      this.calServRetTax();
      this.calCharge();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /**
  * Method to get Included tickets
  */
  getIncludedTickets(apptid) {
    this.completedTicketService.getIncludedTicketList(apptid).subscribe(data => {
      this.includedTicketsList = data['result'];
      this.calCharge();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /**
   * Method to sum all
   */
  calCharge() {
    this.serviceTotal = 0;
    this.productTotal = 0;
    this.otherTotal = 0;
    this.paymentTotal = 0;
    this.paymentTotal1 = 0;
    this.tipTotal = 0;
    this.includedTicketsTotal = 0;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        this.serviceTotal += parseFloat(this.TicketServiceData[i].netPrice);
      }
    }
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let i = 0; i < this.ticketProductsList.length; i++) {
        this.productTotal += parseFloat(this.ticketProductsList[i].Net_Price__c) * this.ticketProductsList[i].quantity;
      }
    }
    if (this.workerTipsList && this.workerTipsList.length > 0) {
      for (let i = 0; i < this.workerTipsList.length; i++) {
        this.tipTotal += parseFloat(this.workerTipsList[i].Tip_Amount__c);
      }
    }
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.ticketOthersList.length; i++) {
        this.otherAmount += parseFloat(this.ticketOthersList[i].Service_Tax__c);
        this.otherTotal += parseFloat(this.ticketOthersList[i].Amount__c);
      }
    }
    this.subTotal = 0;
    this.subTotal = this.serviceTotal + this.productTotal + this.tipTotal + this.otherTotal;

    if (this.ticketPaymentList && this.ticketPaymentList.length > 0) {
      for (let i = 0; i < this.ticketPaymentList.length; i++) {
        this.paymentTotal += parseFloat(this.ticketPaymentList[i].Amount_Paid__c);
      }
    }
    if (this.electronicPaymentData && this.electronicPaymentData.length > 0) {
      for (let i = 0; i < this.electronicPaymentData.length; i++) {
        this.electronicPaymentData[i].apptdate = this.commonService.getUsrDtStrFrmDBStr(this.electronicPaymentData[i].Appt_Date_Time__c);
        this.paymentTotal1 += parseFloat(this.electronicPaymentData[i].Amount_Paid__c);
      }
    }
    if (this.includedTicketsList.length > 0) {
      this.includedTicketsTotal = parseFloat(this.includedTicketsList.map(obj => -(+obj['Included_Ticket_Amount__c'])).reduce(this.calculateSum));
    }

  }
  /**
   * apptId method to get getClientRewardDatabyApptId
   * @param apptId
   */
  getClientRewardDatabyApptId(apptId, isRefund) {
    this.completedTicketService.clientRewardDatabyApptId(apptId, isRefund).subscribe(
      data => {
        this.rewardsList = data['result'];
        if (this.rewardsList) {
          this.rewardsList = this.rewardsList.filter(function (obj) { return obj.earnedPoints || obj.usedPoints; });
        }
        // if (this.rewardsList && this.rewardsList.length > 0) {
        //   for (let i = 0; i < this.rewardsList.length; i++) {
        //     this.rewardsList[i]['earnedPoints'] = 0;
        //     this.rewardsList[i]['usedPoints'] = 0;
        //     if (parseInt(isRefund, 10) === 1) {
        //       if (this.rewardsList[i]['Points_c'] < 0) {
        //         this.rewardsList[i]['earnedPoints'] += parseFloat(this.rewardsList[i]['Points_c']);
        //       } else {
        //         this.rewardsList[i]['usedPoints'] -= parseFloat(this.rewardsList[i]['Points_c']);
        //       }
        //     } else if (parseInt(isRefund, 10) === 0) {
        //       if (this.rewardsList[i]['Points_c'] > 0) {
        //         this.rewardsList[i]['earnedPoints'] += parseFloat(this.rewardsList[i]['Points_c']);
        //       } else {
        //         this.rewardsList[i]['usedPoints'] -= parseFloat(this.rewardsList[i]['Points_c']);
        //       }
        //     }
        //   }
        // }
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          this.router.navigate(['/']).then(() => { });
        }
      });
  }

  calServRetTax() {
    this.serTax = 0;
    this.serTax1 = 0;
    this.prodTax = 0;
    this.packageTax = 0;
    this.totalTax = 0;
    this.prepaidTax = 0;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        const clkPck = this.TicketServiceData[i]['Client_Package__c'];
        const bookedPck = this.TicketServiceData[i]['Booked_Package__c'];
        const txable = +this.TicketServiceData[i]['Taxable__c'];
        if ((clkPck && bookedPck) || (txable === 1)) {
          this.serTax += this.TicketServiceData[i].Service_Tax__c;
        }
        if ((clkPck && bookedPck) || (txable === 1 && !bookedPck)) {
          this.serTax1 += this.TicketServiceData[i].Service_Tax__c;
        }
      }
    }
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let i = 0; i < this.ticketProductsList.length; i++) {
        if (this.ticketProductsList[i]['Taxable__c'] === 1) {
          this.prodTax += this.ticketProductsList[i].Product_Tax__c;
        }
      }
    }
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.ticketOthersList.length; i++) {
        if (this.ticketOthersList[i].Package__c) {
          this.packageTax += this.ticketOthersList[i]['Service_Tax__c'];
        }
      }
    }
    this.totalTax = this.serTax1 + this.prodTax + this.packageTax;
    this.prepaidTax = this.serTax + this.prodTax + this.packageTax;
  }

  calculateSum(total: number, value: number) {
    return total + value;
  }

  commonCancelModal() {
    this.recieptModal.hide();
    this.error = '';
  }
  clearErrMsg() {
    this.error = '';
  }
  printDiv() {
    let printContents, popupWin;
    printContents = document.getElementById('inner_cont').innerHTML;
    const style = '@import url(https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i);'
      + 'body{font-size:8pt; line-height:1;}*,h4{margin:0;line-height:1.1}.total,h4{text-align:center}*{font-family:Raleway,sans-serif;padding:0;font-size:14px}'
      + '.profile-list-view-txt{padding:20px 0;font-size:18px}h4{display:block;font-size:18px;font-weight:400;padding:0 0 10px}.check-profile-list-img,'
      + '.check-profile-list-name{font-family:Raleway,sans-serif!important;font-weight:400;text-align:center;float:none;width:100%;margin:0;padding:0}'
      + '.check-profile-list-name,.price-total,.sub-item-service{font-size:18px;font-weight:600}.checkoutlist,.drawer-button,.merchantDropDown{padding:0 15px}'
      + '.check-profile-list{display:flex;align-items:center;max-width:400px;width:100%;margin:0 auto 7px;cursor:pointer}.check-profile-list-img{width:61px;height:61px;'
      + 'float:left;margin-left:-70px}.check-profile-list-img img{width:61px;height:61px;border-radius:100%;object-fit:cover;border:1px solid #fff}'
      + '.check-profile-list-name{width:100%;line-height:1.1;text-transform:uppercase;color:#000;padding:20px 0}.check-profile-list-name.text-uppercase{padding-top:0}'
      + '.check-profile-list-name h4{font-size:18px;line-height:1;margin:0;padding:0}.check-profile-details-in{max-width:400px;width:100%;margin:0 auto}'
      + '.sub-item-service{display:table;line-height:20px;width:100%;margin-bottom:15px;color:#000}.sub-item-service .sub-item1,.sub-item2,'
      + '.sub-item3{display:table-cell;width:auto}.listcharge,.total{display:inline-block;vertical-align:top;margin-top:15px}'
      + '.price-total{line-height:1;text-transform:uppercase;color:#000;width:126px}.total{width:136px;font-size:20px;color:#000}'
      + '.sub-item-service .sub-item3,.sub-item3 h4{text-align:right}.total-charge{margin-top:0;padding-bottom:20px}.sub-item-service '
      + '.ng-star-inserted{display:table;width:100%}.merchantDropDown{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1}.ml-50{margin-left:-30px}'
      + '.merchantDropDown select{padding:0 15px;height:27px;font-size:12px;line-height:12px;width:52%!important}.checkoutlist a:hover{text-decoration:underline!important}'
      + '.charge-btn{padding-top:3px;padding-bottom:4px;margin-top:12px}.sub-item-service.desc{margin-bottom:5px}.sub-item-service '
      + '.sub-item1 span.disc{margin-right:10px;text-transform:uppercase;padding:2px 5px 2px 10px}.sub-item3 span{text-decoration:line-through;padding-right:10px}'
      + '.sub-item-service .sub-item1,.sub-item3{white-space:nowrap;width:25%}.sub-item3 h4{padding:0}.sub-item-service .sub-item2{border-bottom:1px solid rgba(231,234,242,1)}'
      + '.sub-item-sub{padding:0 10%}.sub-item-sub .sub-item-service{font-weight:400}';
    const finalhtml = printContents + '<style>' + style + '</style>';
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(
      `
    <html>
      <head>
        <title>Bill Receipt</title>
        <style>
        table {
          border-collapse: collapse;
        }
        table, th, td {
            border: 0.5px solid black;
        }
        .pri td {
          padding:6px;
        }
        .arc {
          float:left;
          margin:12px;
        }
        .arc button {
          margin-top:10px;
        }
        .total {
          margin:6px;
        }
        </style>
      </head>
      <body onload="window.print();window.close()">${finalhtml}</body>
    </html>`
    );
    popupWin.document.close();

  }

  sendEmailReciept() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.clientEmail === '' && !this.clientEmail) {
      this.error = 'Primary Email is required';
    } else if ((this.clientEmail !== '' && !EMAIL_REGEXP.test(this.clientEmail))) {
      this.error = 'CLIENTS.INVALID_CLIENT_INFO_PRIMARY_EMAIL';
    } else {
      const HtmlData = document.getElementById('inner_cont').innerHTML;
      const style = '@import url(https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i);'
        + 'body{font-size:8pt; line-height:1;}*,h4{margin:0;line-height:1.1}.total,h4{text-align:center}*{font-family:Raleway,sans-serif;padding:0;font-size:14px}'
        + '.profile-list-view-txt{padding:20px 0;font-size:18px}h4{display:block;font-size:18px;font-weight:400;padding:0 0 10px}.check-profile-list-img,'
        + '.check-profile-list-name{font-family:Raleway,sans-serif!important;font-weight:400;text-align:center;float:none;width:100%;margin:0;padding:0}'
        + '.check-profile-list-name,.price-total,.sub-item-service{font-size:18px;font-weight:600}.checkoutlist,.drawer-button,.merchantDropDown{padding:0 15px}'
        + '.check-profile-list{display:flex;align-items:center;max-width:400px;width:100%;margin:0 auto 7px;cursor:pointer}.check-profile-list-img{width:61px;height:61px;'
        + 'float:left;margin-left:-70px}.check-profile-list-img img{width:61px;height:61px;border-radius:100%;object-fit:cover;border:1px solid #fff}'
        + '.check-profile-list-name{width:100%;line-height:1.1;text-transform:uppercase;color:#16337d;padding:20px 0}.check-profile-list-name.text-uppercase{padding-top:0}'
        + '.check-profile-list-name h4{font-size:18px;line-height:1;margin:0;padding:0}.check-profile-details-in{max-width:400px;width:100%;margin:0 auto}'
        + '.sub-item-service{display:table;line-height:20px;width:100%;margin-bottom:15px;color:#062675}.sub-item-service .sub-item1,.sub-item2,'
        + '.sub-item3{display:table-cell;width:auto}.listcharge,.total{display:inline-block;vertical-align:top;margin-top:15px}'
        + '.price-total{line-height:1;text-transform:uppercase;color:#16337d;width:126px}.total{width:136px;font-size:20px;color:#16337d}'
        + '.sub-item-service .sub-item3,.sub-item3 h4{text-align:right}.total-charge{margin-top:0;padding-bottom:20px}.sub-item-service '
        + '.ng-star-inserted{display:table;width:100%}.merchantDropDown{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1}.ml-50{margin-left:-30px}'
        + '.merchantDropDown select{padding:0 15px;height:27px;font-size:12px;line-height:12px;width:52%!important}.checkoutlist a:hover{text-decoration:underline!important}'
        + '.charge-btn{padding-top:3px;padding-bottom:4px;margin-top:12px}.sub-item-service.desc{margin-bottom:5px}.sub-item-service '
        + '.sub-item1 span.disc{margin-right:10px;text-transform:uppercase;padding:2px 5px 2px 10px}.sub-item3 span{text-decoration:line-through;padding-right:10px}'
        + '.sub-item-service .sub-item1,.sub-item3{white-space:nowrap;width:25%}.sub-item3 h4{padding:0}.sub-item-service .sub-item2{border-bottom:1px solid rgba(231,234,242,1)}'
        + '.sub-item-sub{padding:0 10%}.sub-item-sub .sub-item-service{font-weight:400}';
      const finalhtml = HtmlData + '<style>' + style + '</style>';
      const dataObj = {
        'apptName': this.apptName,
        'apptId': this.apptId,
        'clientName': this.clientName,
        'clientId': this.clientId,
        'clientEmail': this.clientEmail,
        'htmlFile': finalhtml
      };
      this.completedTicketService.sendReciept(dataObj).subscribe(data => {
        this.recieptModal.hide();
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EMAIL_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        this.clientEmail = '';
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              break;
          }
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
    }
  }

  loadCompanyInfo(data) {
    this.companyInfo = data;
  }

  getWorkerLists() {
    this.completedTicketService.getWorkerLists().subscribe(
      data => {
        this.activeWorkerLists = data['result'].filter(obj => obj.IsActive === 1);
      });
  }
  activeSerive() {
    const id = 'asda';
    this.completedTicketService.activeSerive(id).subscribe(
      data => {
        this.serviceLists = data['result'];
      });
  }
  addWorkerTip($event) {
    const tempWorkTip = this.tipsArray.filter(obj => obj.workerId === this.selWor.split('$')[0]);
    if (tempWorkTip && tempWorkTip.length === 0) {
      this.tipsArray.push({
        'workerId': this.selWor.split('$')[0],
        'workerName': this.selWor.split('$')[1],
        'tipAmount': ''
      });
    } else {
      this.toastr.warning('Allready worker Exists In List ', null, { timeOut: 3000 });
    }
    this.inputs.push(this.selWor);
    $event.target.value = '';
  }

  deleteFieldValue(workerId) {
    if (this.tipsArray.filter(obj => obj.workerId === workerId)[0]['id']) {
      this.delTipAry.push(this.tipsArray.filter(obj => obj.workerId === workerId)[0]['id']);
    }
    this.tipsArray = this.tipsArray.filter(obj => obj.workerId !== workerId);
  }
  showRecieptModal() {
    this.recieptModal.show();
    this.clientEmail = this.apptData.cltemail;
  }

  showSmileModal() {
    this.smileModal.show();
  }

  showServiceModal(list) {
    this.serviceworkerId = list.workerId;
    this.serviceName = list.ServiceName;
    this.serviceId = list.TicketServiceId;
    this.serviceNotes = list.Notes__c ? list.Notes__c : '';
    const ServiceId = list.ServiceId;
    this.completedTicketService.activeSerive(ServiceId).subscribe(
      data => {
        this.serviceLists = data['result'];
        if (this.serviceLists.length > 0) {
          this.serviceModal.show();
        }
      });

  }
  showProductModal(list) {
    this.productWorkerId = list.workerId;
    this.productName = list.Name;
    this.productId = list.Id;
    const workerIdName = [{ 'Id': list.workerId, 'FullName': list.workerName }];
    const c = workerIdName.concat(this.activeWorkerLists);
    this.productListsWorkers = this.commonService.removeDuplicates(c, 'Id');
    this.productModal.show();
  }

  showOtherModal(list) {
    this.otherWorkerId = list.Worker__c;
    if (list.Transaction_Type__c === 'Package') {
      this.otherName = list.Transaction_Type__c + ' ' + list.packageName + ' ' + (list.Online__c === 1 ? '(OL)' : '');
    } else if (list.Transaction_Type__c === 'Gift') {
      this.otherName = list.Gift_Number__c + ' ' + list.Gift_Number__c + ' ' + (list.Online__c === 1 ? '(OL)' : '');
    }
    this.otherId = list.Id;
    this.otherModal.show();
  }

  hidePopup() {
    this.recieptModal.hide();
    this.smileModal.hide();
    this.productModal.hide();
    this.otherModal.hide();
    this.serviceModal.hide();
    this.tipModal.hide();
    this.paymentModal.hide();
    this.editTicketModal.hide();
    this.editTipModal.hide();
    this.clearErrorMsg();
  }

  closeEditTicketModal() {
    this.editTicketModal.hide();
  }
  otherSave() {
    const dataObj = {
      'otherId': this.otherId,
      'workerId': this.otherWorkerId
    };
    if (this.otherWorkerId.length > 0) {
      this.completedTicketService.otherUpdate(dataObj).subscribe(data => {
        if (data['result'].affectedRows > 0) {
          this.tipsArray = [];
          this.otherModal.hide();
          this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
            this.getOthersTicketDetails();
            this.toastr.success('Successfully Record Updated', null, { timeOut: 1500 });
          });
        }
      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2040') {
              this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              window.scrollTo(0, 0);
            } else if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            } break;
        }
      });
    }
  }
  productSave() {
    const dataObj = {
      'productId': this.productId,
      'workerId': this.productWorkerId
    };
    this.completedTicketService.productUpdate(dataObj).subscribe(data => {
      if (data['result'].affectedRows > 0) {
        this.productModal.hide();
        this.getTicketProducts(this.apptId);
        this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
          this.toastr.success('Successfully Record Updated', null, { timeOut: 1500 });
        });
      }
    }, error => {
      const status = JSON.parse(error['status']);
      const statuscode = JSON.parse(error['_body']).status;
      switch (status) {
        case 500:
          break;
        case 400:
          if (statuscode === '2040') {
            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
            window.scrollTo(0, 0);
          } else if (statuscode === '2085' || statuscode === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          } break;
      }
    });
  }
  serviceSave() {
    const dataObj = {
      'serviceNote': this.serviceNotes,
      'apptId': this.serviceId,
      'serviceworkerId': this.serviceworkerId,
    };
    this.completedTicketService.serviceNoteUpdate(dataObj).subscribe(data => {
      if (data['result'].affectedRows > 0) {
        this.serviceModal.hide();
        this.getTicketServices(this.apptId);
        this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
          this.toastr.success('Successfully Record Updated', null, { timeOut: 1500 });
        });
      }
    }, error => {
      const errStatus = JSON.parse(error['_body'])['status'];
      if (errStatus === '2085' || errStatus === '2071') {
        if (this.router.url !== '/') {
          localStorage.setItem('page', this.router.url);
          this.router.navigate(['/']).then(() => { });
        }
      }
    });
  }

  saveAll(value) {
    const workerId = [];
    let total = 0;
    const updateTipId = [];
    const addTipAry = [];
    if (this.tipsArray.length > 0) {
      const valiAry = this.tipsArray.filter(function (obj) {
        return !(obj.tipAmount);
      });
      const valiAry2 = this.tipsArray.filter(function (obj) {
        return !(obj.tipAmount > 0);
      });

      if (valiAry.length > 0) {
        this.toastr.warning('please remove the empty field', null, { timeOut: 3000 });
      } else if (valiAry2.length > 0) {
        this.toastr.warning('Only positive number', null, { timeOut: 3000 });
      } else {
        for (let i = 0; i < this.tipsArray.length; i++) {
          total += Number(this.tipsArray[i].tipAmount);
          if (this.tipsArray[i]['id']) {
            updateTipId.push({
              'update': 'update',
              'id': this.tipsArray[i]['id'],
              'tip': this.tipsArray[i]['tipAmount'],
              'tipName': this.tipsArray[i]['tipOption'] ? this.tipsArray[i]['tipOption'] : this.tipName,
              'Drawer_Number__c': this.tipsArray[i]['Drawer_Number__c'] ? this.tipsArray[i]['Drawer_Number__c'] : this.cashDrawer
            });
          } else {
            addTipAry.push({
              'add': 'add',
              'apptId': this.apptId,
              'workerId': this.tipsArray[i]['workerId'],
              'tip': this.tipsArray[i]['tipAmount'],
              'tipName': this.tipsArray[i]['tipOption'] ? this.tipsArray[i]['tipOption'] : this.tipName,
              'Drawer_Number__c': this.tipsArray[i]['Drawer_Number__c'] ? this.tipsArray[i]['Drawer_Number__c'] : this.cashDrawer
            });
          }
        }
        if (this.tipTotal === total) {
          const obj = {
            'delete': this.delTipAry,
            addTipAry,
            updateTipId
          };
          this.completedTicketService.tipAmountUpdate(obj).subscribe(data => {
            if (data['result'].affectedRows >= 0) {
              if (value === 'saveRebook') {
                this.router.navigate(['/appointment/book/' + this.clientId + '/' + this.apptId], { queryParams: { bookingType: 'rebook' } });
                this.toastr.success('Successfully Record Updated', null, { timeOut: 1500 });
              } else if (value === 'saveNew') {
                this.router.navigate(['/checkout/newticket']).then(() => {
                  this.toastr.success('Successfully Record Updated', null, { timeOut: 1500 });
                });
              } else if (value === 'save') {
                this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
                  setTimeout(() => {
                    window.location.reload();
                    this.toastr.success('Successfully Record Updated', null, { timeOut: 3000 });
                  }, 1500);
                });
              }

            }
          }, error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
        } else {
          this.toastr.warning('Cannot save: update tip amounts to be balance', null, { timeOut: 3000 });
        }
      }
    } else {
      if (value === 'saveRebook') {
        this.router.navigate(['/appointment/book/' + this.clientId + '/' + this.apptId], { queryParams: { bookingType: 'rebook' } });
      } else if (value === 'saveNew') {
        this.router.navigate(['/checkout/newticket']).then(() => {
        });
      } else if (value === 'save') {
        this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
        });
      }
    }
  }
  addTicketRating(value) {
    this.ticketRate = value;
    if (this.ticketRate === 'Good') {
      this.styleOnClickPoor = 'logo-inactive';
      this.styleOnClickFair = 'logo-inactive';
      this.styleOnClickGood = 'logo-active';
    } else if (this.ticketRate === 'Fair') {
      this.styleOnClickPoor = 'logo-inactive';
      this.styleOnClickGood = 'logo-inactive';
      this.styleOnClickFair = 'logo-active';
    } else if (this.ticketRate === 'Poor') {
      this.styleOnClickGood = 'logo-inactive';
      this.styleOnClickFair = 'logo-inactive';
      this.styleOnClickPoor = 'logo-active';
    }

  }
  ratingSend() {
    const obj = {
      'rating': this.ticketRate,
      'apptId': this.apptId,
    };
    this.completedTicketService.ratingUpdate(obj).subscribe(data => {
      if (data['result'].affectedRows > 0) {
        this.smileModal.hide();
        this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
          this.toastr.success('Successfully Record Updated', null, { timeOut: 3000 });
        });
      }
    }, error => {
      const errStatus = JSON.parse(error['_body'])['status'];
      if (errStatus === '2085' || errStatus === '2071') {
        if (this.router.url !== '/') {
          localStorage.setItem('page', this.router.url);
          this.router.navigate(['/']).then(() => { });
        }
      }
    });
  }
  tipPopup() {
    if (this.ticketProductsList.length > 0) {
      if (Math.abs(this.balanceDue) > 0) {
        this.tipAmount = Math.abs(this.balanceDue);
        this.tipAmountAdd = Math.abs(this.balanceDue).toFixed(2);
        this.tipModal.show();
      } else if (Math.abs(this.balanceDue) === 0) {
        this.tipModal.show();
      }
    } else if (this.TicketServiceData.length > 0) {
      if (Math.abs(this.balanceDue) > 0) {
        this.tipAmount = Math.abs(this.balanceDue);
        this.tipAmountAdd = Math.abs(this.balanceDue).toFixed(2);
        this.tipModal.show();
      } else if (Math.abs(this.balanceDue) === 0) {
        this.tipModal.show();
      }
    } else if (this.includedTicketsList.length > 0) {
      this.toastr.info('Tips cannot be added to Non Service Ticket and Packages', null, { timeOut: 3000 });
    } else {
      this.toastr.info('Tips cannot be added to Non Service Ticket and Packages', null, { timeOut: 3000 });
    }

  }
  numbersOnly(event: any) {
    const pattern = /[0-9]|\./;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  saveAdditionalAmt() {
    if (Math.abs(this.tipAmountAdd) > 0) {
      if (Math.abs(this.balanceDue) === 0) {
        let insertotal = 0;
        const serivePrice = [];
        const workerName = [];
        const tipInsert = [];
        const inclInsert = [];
        const inclName = [];
        const incluTicket = [];
        const inclSerivePrice = [];
        let inclInsertotal = 0;

        for (let i = 0; i < this.tipArrTicketServ.length; i++) {
          workerName.push(this.tipArrTicketServ[i].workerId);
          insertotal += Number(this.tipArrTicketServ[i].Price__c);
          serivePrice.push(this.tipArrTicketServ[i].Price__c);
        }
        for (let j = 0; j < this.ticketProductsList.length; j++) {
          inclName.push(this.ticketProductsList[j].workerId);
          inclInsertotal += Number(this.ticketProductsList[j].Price__c);
          inclSerivePrice.push(this.ticketProductsList[j].Price__c);
        }

        for (let t = 0; t < serivePrice.length; t++) {
          tipInsert.push(workerName[t] + ' ' + (serivePrice[t] / insertotal * Math.abs(this.tipAmountAdd)).toFixed(2));
        }

        for (let k = 0; k < inclSerivePrice.length; k++) {
          incluTicket.push(inclName[k] + ' ' + (inclSerivePrice[k] / inclInsertotal * Math.abs(this.tipAmountAdd)).toFixed(2));
        }

        const dataSend = {
          'insert': tipInsert,
          'incluTicket': incluTicket,
          'total': this.tipAmountAdd,
          'apptId': this.apptId,
          'tipName': this.tipName,
          'amountToPay': this.tipAmountAdd,
          'Payment_Type__c': this.paymentTypeCash,
          'Merchant_Account_Name__c': 'STX QA 2017',
          'Payment_Gateway_Name__c': 'AnywhereCommerce',
          'Drawer_Number__c': this.cashDrawer ? this.cashDrawer : '',
          'tipsArray': this.tipsArray,
        };
        this.completedTicketService.addPaymentTipAmt(dataSend).subscribe(data => {
          this.tipModal.hide();
          this.balanceDue = 0;
          this.tipsArray = [];
          this.ticketPaymentList = [];
          this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
            this.tipModal.hide();
            this.getWorkerTips();
            this.getTicketServices(this.apptId);
            this.getIncludedTickets(this.apptId);
            this.getTicketPayment(this.apptId);
            this.toastr.success('Successfully Record Updated', null, { timeOut: 3000 });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        }, error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
      } else {
        const updateTipId = [];
        let total = 0;
        const serivePrice = [];
        const workerName = [];
        const tipPerson = [];

        if (this.tipsArray.length > 0) {
          for (let i = 0; i < this.tipsArray.length; i++) {
            workerName.push(this.tipArrTicketServ[i].workerId);
            total += Number(this.tipArrTicketServ[i].Price__c);
            serivePrice.push(this.tipArrTicketServ[i].Price__c);
          }
          for (let t = 0; t < serivePrice.length; t++) {
            const workerIddd = this.tipsArray[t].id;
            tipPerson.push(this.tipsArray[t].id + ' ' + (+this.tipsArray[t]['tipAmount'] +
              (serivePrice[t] / total * Math.abs(this.tipAmountAdd))).toFixed(2));
          }
          const objs = {
            'update': 'update',
            'tipPerson': tipPerson,
            'type': 'cash',
            'tipOption': 'Tip Left In Drawer',
            'appId': this.apptId
          };
          this.completedTicketService.AdditionalTipAmount(objs).subscribe(data => {
            if (data['result'].affectedRows > 0) {
              this.tipModal.hide();
              this.balanceDue = 0;
              this.tipsArray = [];
              this.ticketPaymentList = [];
              this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
                this.getWorkerTips();
                this.getTicketPayment(this.apptId);
                this.getTicketServices(this.apptId);
                this.getIncludedTickets(this.apptId);
                this.toastr.success('Successfully Record Updated', null, { timeOut: 3000 });
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              });
            }
          }, error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });

        } else {

          if ((Math.abs(this.balanceDue).toFixed(2) >= this.tipAmountAdd) && (this.tipAmountAdd <= Math.abs(this.balanceDue).toFixed(2))) {
            for (let i = 0; i < this.tipArrTicketServ.length; i++) {
              workerName.push(this.tipArrTicketServ[i].workerId);
              total += Number(this.tipArrTicketServ[i].Price__c);
              serivePrice.push(this.tipArrTicketServ[i].Price__c);
            }

            for (let t = 0; t < serivePrice.length; t++) {
              tipPerson.push(workerName[t] + ' ' + (serivePrice[t] / total * Math.abs(this.tipAmountAdd)).toFixed(2));
            }

            const obj = {
              'tipPerson': tipPerson,
              'type': 'cash',
              'tipOption': 'Tip Left In Drawer',
              'appId': this.apptId
            };
            this.completedTicketService.AdditionalTipAmount(obj).subscribe(data => {
              if (data['result'].affectedRows > 0) {
                this.tipModal.hide();
                this.balanceDue = 0;
                this.tipsArray = [];
                this.ticketPaymentList = [];
                this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
                  this.getWorkerTips();
                  this.getTicketPayment(this.apptId);
                  this.getTicketServices(this.apptId);
                  this.getIncludedTickets(this.apptId);
                  this.toastr.success('Successfully Record Updated', null, { timeOut: 3000 });
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                });
              }
            }, error => {
              const errStatus = JSON.parse(error['_body'])['status'];
              if (errStatus === '2085' || errStatus === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              }
            });
          } else {
            this.toastr.error('can not add more than the cash back amount', null, { timeOut: 3500 });
          }
        }
      }
    } else {
      this.toastr.warning('Only positive number', null, { timeOut: 3000 });
    }

  }

  clearErrorMsg() {
    this.errPaymnetType = '';
    this.errTipAmount = '';
    this.errTipName = '';
  }
  editTicket() {
    this.editTicketModal.show();
  }

  listPayment() {
    this.completedTicketService.getPaymentList().subscribe(data => {
      const asda = this.paymentList = data['result'].filter(obj => obj.Name.toLowerCase() === 'cash');
      this.paymentTypeCash = asda[0].Payment_Type__c;
    });
  }

  showPaymentModal(list) {
    this.paymentId = list.Id;
    this.completedTicketService.getPaymentList().subscribe(data => {
      this.paymentList = data['result'].filter(e => e.Name !== 'Account Charge' && e.Name !== 'Gift Redeem' && e.Name !== 'Prepaid Package');
      if (list.paymentTypeName.toLowerCase() === 'credit card' || list.paymentTypeName.toLowerCase() === 'clover'
        || list.paymentTypeName.toLowerCase() === 'card on file' || list.paymentTypeName.toLowerCase() === 'account charge'
        || list.paymentTypeName.toLowerCase() === 'gift redeem' || list.paymentTypeName.toLowerCase() === 'prepaid package') {
        this.paymentModal.hide();
      } else {
        this.paymentModal.show();
      }
      this.paymentValue = list.Payment_Type__c;

      // this.paymentList = data['result'].filter(obj => obj.Name.toLowerCase() !== 'gift redeem' || obj.Name.toLowerCase() !== 'account charge'
      //   || obj.Name.toLowerCase() !== 'prepaid package');
      // if (list.paymentTypeName.toLowerCase() === 'credit card' || list.paymentTypeName.toLowerCase() === 'clover'
      //   || list.paymentTypeName.toLowerCase() === 'card on file') {
      //   this.paymentModal.hide();
      // } else {
      //   this.paymentModal.show();
      // }
      // this.paymentValue = list.Payment_Type__c;
    });
  }

  paymentService() {
    const obj = {
      'paymentId': this.paymentId,
      'paymentType': this.paymentValue
    };
    this.completedTicketService.updatePaymentList(obj).subscribe(data => {
      if (data['result'].affectedRows > 0) {
        this.paymentModal.hide();
        this.router.navigate(['/completedticket/' + this.apptId]).then(() => {
          this.balanceDue = 0;
          this.tipsArray = [];
          this.ticketPaymentList = [];
          this.getWorkerTips();
          this.getTicketPayment(this.apptId);
          this.getTicketServices(this.apptId);
          this.getIncludedTickets(this.apptId);
          this.toastr.success('Successfully Record Updated', null, { timeOut: 3000 });
        });
      }
    }, error => {
      const errStatus = JSON.parse(error['_body'])['status'];
      if (errStatus === '2085' || errStatus === '2071') {
        if (this.router.url !== '/') {
          localStorage.setItem('page', this.router.url);
          this.router.navigate(['/']).then(() => { });
        }
      }
    });
  }
  tipPriceOnClick(amount, index) {
    if (amount.indexOf('.') > -1) {
      const tempAry = amount.split('.');
      if (!tempAry[0]) {
        this.tipsArray[index]['tipAmount'] = '0' + this.tipsArray[index]['tipAmount'];
      }
      if (!tempAry[1]) {
        this.tipsArray[index]['tipAmount'] = this.tipsArray[index]['tipAmount'] + '00';
      }
      if (tempAry[1] && tempAry[1].length === 1) {
        this.tipsArray[index]['tipAmount'] = this.tipsArray[index]['tipAmount'] + '0';
      }
    } else if (amount) {
      this.tipsArray[index]['tipAmount'] = this.tipsArray[index]['tipAmount'] + '.00';
    }
  }

  validateNum(event, index) {
    if (event.keyCode !== 46 && event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57)) {
      return false;
    } else {
      const tempVal = this.tipsArray[index]['tipAmount'].split('.')[1];
      if (tempVal && tempVal.length === 2) {
        if (window.getSelection().toString() || event.target.selectionStart <= event.target.value.indexOf('.')) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
  posDeviceList() {
    this.completedTicketService.getPosdevices().subscribe(data => {
      this.posLists = data['result'][1].JSON__c;
    });
  }

  showDataInView() {
    this.completedTicketService.getTicketServicesByApptId(this.apptId).subscribe(data => {
      this.TicketServiceData = data['result'].ticetServices;
      const grouped = [];
      this.TicketServiceData.forEach(function (hash) {
        return function (o) {
          if (!hash[o.workerId]) {
            hash[o.workerId] = { workerId: o.workerId, Price__c: 0 };
            grouped.push(hash[o.workerId]);
          }
          hash[o.workerId].Price__c += +o.Price__c;
        };
      }(Object.create(null)));
      this.tipArrTicketServ = grouped;
    });
  }

  editTip() {
    this.editTipModal.show();
  }

  hideTipPopup() {
    this.editTipModal.hide();
  }

  updateTipAmounts() {
    if (this.editTipAmnt <= this.tipTotal) {
      const obj = {
        'editAmount': this.editTipAmnt,
        'apptId': this.apptId,
      };
      this.completedTicketService.updateTipAmount(obj).subscribe(data => {
        if (data['result']) {
          this.hidePopup();
          this.balanceDue = 0;
          this.tipsArray = [];
          this.ticketPaymentList = [];
          this.getWorkerTips();
          this.getTicketPayment(this.apptId);
          this.getTicketServices(this.apptId);
          this.getIncludedTickets(this.apptId);
          this.toastr.success('Successfully Record Updated', null, { timeOut: 2000 });
        }
      }, error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
    } else {
      this.toastr.info('Amount can not add more than the actual tip amount, you can add amount from tip place.', null, { timeOut: 4000 });
    }

  }

  checkdate(dt) {
    const today = moment().format('YYYY-MM-DD');
    const app_date = moment(dt[0], 'MM/DD/YYYY').format('YYYY-MM-DD');
    if (app_date > today) {
      this.setPermissin = 0;
    } else if (app_date === today) {
      this.setPermissin = 1;
    } else if (app_date < today) {
      this.setPermissin = 0;
    }
  }



}
