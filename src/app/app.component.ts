import { Component, HostListener, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeterTableComponent } from './pages/meter-table/meter-table.component';
import { FlightService } from './services/flight.service';
import { PreferencesService } from './services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    private _modalService: NgbModal,
    public _flight: FlightService,
    public _pref: PreferencesService,
  ) { }


  ngOnInit() {
    // adjust columns of result for small screen
    this.getScreenWidth = window.innerWidth;
    this.closeIfSmall();

    this._pref.loadPrefs();
    this._flight.loadFlight();
  }

  public getScreenWidth: any;
  public meter: boolean = false;
  public colapsed: boolean = false;

  // Screen sizes (iPad: Up= 810, Side= 1080, half/side = 353/535/750, half/Up= 480,/320)
  // adjust columns of result for small screen
  @HostListener('window:resize', ['$event']) onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.closeIfSmall();
  }

  openMeterTable() {
    this._modalService.open(MeterTableComponent, {
      scrollable: true,
      size: 'xl'
     });
  }

  // Closes the side nav only if it's small screen
  closeIfSmall() {
    if (this.getScreenWidth < 768) {
      this.colapsed = true;
    } else {
      this.colapsed = false;
    }
  }

  isSmall() {
    return this.getScreenWidth <= 1000;
  }

  isVerySmall(): boolean {
    return this.getScreenWidth <= 350;
  }

  public appPages = [
    { title: 'Flight Initalization', url: '/flight-init', icon: "settings" },
    { title: 'Performance', url: '/performance', icon: "book" },
    { title: 'TechLog', url: '/techlog', icon: "book" },
    { title: 'Dangerous Goods', url: '/dangerous-goods', icon: "warning" },
    { title: 'Inflight Display', url: '/flight-display', icon: "airplane" },
    { title: 'PA Guide', url: '/pa', icon: "book" },
    { title: 'Inflight Rest', url: '/inflight-rest', icon: "bed" },
    
    //{ title: 'Toolbox', url: '/tools', icon: "hammer" },
    
    { title: 'About', url: '', icon: "home" },
  ];
}
