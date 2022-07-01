import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard'
import { FlightService } from 'src/app/services/flight.service';
import { PdfReadService } from 'src/app/services/pdf-read.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-flight-init',
  templateUrl: './flight-init.component.html',
})
export class FlightInitComponent implements OnInit {

  constructor(
    private _pdf: PdfReadService,
    public _flight: FlightService,
    private _clipboard: ClipboardService
  ) { }

  ngOnInit(): void {
  }

  extractText(event: any) {
    // First clear flight information 
    this._flight.clearFligh()

    // get file path
    var file = event.target.files[0];

    // create new file
    var fileReader = new FileReader();


    fileReader.onload = (e: any) => {
      this._pdf.readPdf(e);
    };
    //Step 3:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file);
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
    // First clear flight information 
    this._flight.clearFligh()

    // get file path
    var file = event.target.files[0];

    // Read file
    var reader = new FileReader();

    reader.readAsText(file);
    reader.onload = (e: any) => {
      // Restore Json
      this._flight.restore(String(reader.result));
    }
  }

  copyRoute() {
    this._clipboard.copy(this._flight.flight.route);
  }

  copyAlternates() {
    this._clipboard.copy(this._flight.flight.alternateList);
  }

  clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
  }

}
