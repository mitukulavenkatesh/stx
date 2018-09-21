/*
ngOnInit() : Method to loading athe page..
searchClients() : Method for searching clients
showData() : Method for loading All clients Data.
clearmessage() : Method for Clearing  error messages.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { WaitingListService } from './waitinglist.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './waitinglist.html',
    styleUrls: ['./waitinglist.css'],
    providers: [WaitingListService]
})
export class WaitingListComponent implements OnInit {
    disabledClass = '';
    addDiv: any = false;
    editDiv: any = false;
    disableDiv = true;
    constructor(
        private waitingListService: WaitingListService,
        private toastr: ToastrService,
        private router: Router) {
    }
    /*Method for page Load */
    ngOnInit() {
    }
    addNew() {
        this.disabledClass = 'disabled';
        this.addDiv = true;
        this.editDiv = false;
        this.disableDiv = false;
    }
    showdata() {
        this.disabledClass = 'disabled';
        this.addDiv = false;
        this.editDiv = true;
        this.disableDiv = false;
    }
    cancel() {
        this.disabledClass = '';
        this.addDiv = false;
        this.editDiv = false;
        this.disableDiv = true;
    }
}

