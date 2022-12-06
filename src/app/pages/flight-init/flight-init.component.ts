import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard'
import { FlightService } from 'src/app/services/flight.service';
import { PerformanceSevice } from 'src/app/services/performance.service';
import { PdfReadService } from 'src/app/services/pdf-read.service';
import { saveAs } from 'file-saver';
import { ToastService } from 'src/app/services/toast-service';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flight-init',
  templateUrl: './flight-init.component.html',
})
export class FlightInitComponent implements OnInit {

  constructor(
    private _pdf: PdfReadService,
    public _flight: FlightService,
    public _performance: PerformanceSevice,
    private _clipboard: ClipboardService,
    public _toastService: ToastService,
    private _modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  extractText(event: any) {
    var file = event.target.files[0];
    if (file !== undefined) {
      // First clear flight information 
      this._flight.clearFligh()

      // get file path


      // create new file
      var fileReader = new FileReader();


      fileReader.onload = (e: any) => {
        this._pdf.readPdf(e);
      };
      //Step 3:Read the file as ArrayBuffer
      fileReader.readAsArrayBuffer(file);
    }

    this._modalService.open(DisclaimerComponent, {
      keyboard: false,
      backdrop : 'static',
      scrollable: true,
      size: 'xl',
      centered: true,
     });
  }

  fileName(): string {
    let dateObj: Date = new Date(this._flight.dateStandardDeparture * 60000);
    return dateObj.getFullYear() + '-' + dateObj.getMonth() + '-' + dateObj.getDate() + ' ' + this._flight.number + '.txt';
  }

  downloadFligh() {
    var blob = new Blob([this._flight.getFlightString()], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.fileName());
  }

  restoreBackup(event: any) {
    // get file path
    var file = event.target.files[0];

    if (file !== undefined) {
      // First clear flight information 
      this._flight.clearFligh()



      // Read file
      var reader = new FileReader();

      reader.readAsText(file);
      reader.onload = (e: any) => {
        // Restore Json
        this._flight.restore(String(reader.result));
      }
    }
  }

  copyRoute() {
    this._toastService.show('Route copied to clipboard.', { classname: 'toast-mgs', delay: 2000 });
    this._clipboard.copy(this._flight.flight.route);
  }

  copyAlternates() {
    this._toastService.show('Alternates copied to clipboard.', { classname: 'toast-mgs', delay: 2000 });
    this._clipboard.copy(this._flight.flight.alternateList);
  }

  clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
  }

}
