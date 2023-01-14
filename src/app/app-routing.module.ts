import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BriefingComponent } from './pages/briefing/briefing.component';
import { DangerousGoodsComponent } from './pages/dangerous-goods/dangerous-goods.component';
import { FlightDisplayComponent } from './pages/flight-display/flight-display.component';
import { FlightInitComponent } from './pages/flight-init/flight-init.component';
import { InflightRestComponent } from './pages/inflight-rest/inflight-rest.component';
import { MainComponent } from './pages/main/main.component';
import { MeterTableComponent } from './pages/meter-table/meter-table.component';
import { PaComponent } from './pages/pa/pa.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { TechlogComponent } from './pages/techlog/techlog.component';
import { ToolsComponent } from './pages/tools/tools.component';

const routes: Routes = [
  //{ path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'dangerous-goods', component: DangerousGoodsComponent },
  { path: 'flight-display', component: FlightDisplayComponent },
  { path: 'flight-init', component: FlightInitComponent },
  { path: 'inflight-rest', component: InflightRestComponent },
  { path: 'pa', component: PaComponent },
  { path: 'performance', component: PerformanceComponent },
  { path: 'briefing', component: BriefingComponent },
  { path: '', component: MainComponent },
  { path: 'main', component: MainComponent },
  { path: 'meter-table', component: MeterTableComponent },
  { path: 'techlog', component: TechlogComponent },
  { path: 'tools', component: ToolsComponent },
  { path: '**', redirectTo: 'main' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
