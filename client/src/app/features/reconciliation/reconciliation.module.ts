import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReconciliationRoutingModule } from './reconciliation-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reconFeatureKey, reconReducer } from './store/recon.reducer';
import { ReconEffects } from './store/recon.effects';
import { UploadComponent } from './components/upload/upload.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';
import { ReconciliationFilterComponent } from './components/reconciliation-filter/reconciliation-filter.component';
import { StatusPercentageComponent } from './components/status-percentage/status-percentage.component';
import {ReconciliationPageComponent} from "./containers/reconciliation-page/reconciliation-page.component";

@NgModule({
  declarations: [
    UploadComponent,
    SummaryComponent,
    ResultsTableComponent,
    ReconciliationFilterComponent,
    StatusPercentageComponent,
    ReconciliationPageComponent

  ],
  exports: [
    SummaryComponent,
    ResultsTableComponent,
    UploadComponent
  ],
  imports: [
    SharedModule,
    ReconciliationRoutingModule,
    StoreModule.forFeature(reconFeatureKey, reconReducer),
    EffectsModule.forFeature([ReconEffects]),

  ]
})
export class ReconciliationModule {}
