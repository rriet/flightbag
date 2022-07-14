import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DateComponent } from './pages/components/date/date.component';
import { FlightInitComponent } from './pages/flight-init/flight-init.component';
import { TimeComponent } from './pages/components/time/time.component';
import { FlightDisplayComponent } from './pages/flight-display/flight-display.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberComponent } from './pages/components/number/number.component';
import { TextComponent } from './pages/components/text/text.component';
import { TextareaComponent } from './pages/components/textarea/textarea.component';
import { MeterTableComponent } from './pages/meter-table/meter-table.component';
import { TechlogComponent } from './pages/techlog/techlog.component';
import { FuelPopComponent } from './pages/techlog/fuel-pop/fuel-pop.component';
import { DangerousGoodsComponent } from './pages/dangerous-goods/dangerous-goods.component';
import { DgPopComponent } from './pages/dangerous-goods/dg-pop/dg-pop.component';
import { ToastComponent } from './pages/components/toast/toast.component';
import { ShowDgPopComponent } from './pages/dangerous-goods/show-dg-pop/show-dg-pop.component';
import { InflightRestComponent } from './pages/inflight-rest/inflight-rest.component';
import { MinutesToHoursPipe } from './pipes/minutes-to-hours.pipe';
import { WeightFuelComponent } from './pages/performance/weight-fuel/weight-fuel.component';
import { DepartureComponent } from './pages/flight-display/departure/departure.component';
import { CruiseComponent } from './pages/flight-display/cruise/cruise.component';
import { ApproachComponent } from './pages/flight-display/approach/approach.component';
import { PostFlightComponent } from './pages/flight-display/post-flight/post-flight.component';
import { WaypointComponent } from './pages/flight-display/fpl/waypoint/waypoint.component';
import { PaComponent } from './pages/pa/pa.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { SpeedsComponent } from './pages/performance/speeds/speeds.component';
import { FplComponent } from './pages/flight-display/fpl/fpl.component';
import { LatitudeToString } from './pipes/latitude-to-string.pipe';
import { LongitudeToString } from './pipes/longitude-to-string.pipe';
import { SelectComponent } from './pages/components/select/select.component';
import { RoundNumber } from './pipes/roundNumber.pipe';
import { EditWaypointComponent } from './pages/flight-display/fpl/edit-waypoint/edit-waypoint.component';
import { NumDiffPipe } from './pipes/num-diff.pipe';
import { TonDiffPipe } from './pipes/ton-diff.pipe';
import { NumToTonsPipe } from './pipes/num-ton.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DateComponent,
    NumberComponent,
    TextComponent,
    TextareaComponent,
    TimeComponent,
    FlightInitComponent,
    FlightDisplayComponent,
    MeterTableComponent,
    TechlogComponent,
    FuelPopComponent,
    DangerousGoodsComponent,
    DgPopComponent,
    ToastComponent,
    ShowDgPopComponent,
    InflightRestComponent,
    MinutesToHoursPipe,
    LatitudeToString,
    LongitudeToString,
    WeightFuelComponent,
    DepartureComponent,
    CruiseComponent,
    ApproachComponent,
    PostFlightComponent,
    WaypointComponent,
    PaComponent,
    PerformanceComponent,
    SpeedsComponent,
    FplComponent,
    SelectComponent,
    RoundNumber,
    EditWaypointComponent,
    NumDiffPipe,
    TonDiffPipe,
    NumToTonsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
