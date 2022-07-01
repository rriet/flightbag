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
import { WeightFuelComponent } from './pages/flight-display/weight-fuel/weight-fuel.component';
import { DepartureComponent } from './pages/flight-display/departure/departure.component';
import { CruiseComponent } from './pages/flight-display/cruise/cruise.component';
import { ApproachComponent } from './pages/flight-display/approach/approach.component';
import { PostFlightComponent } from './pages/flight-display/post-flight/post-flight.component';
import { WaypointComponent } from './pages/flight-display/cruise/waypoint/waypoint.component';

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
    WeightFuelComponent,
    DepartureComponent,
    CruiseComponent,
    ApproachComponent,
    PostFlightComponent,
    WaypointComponent,
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
