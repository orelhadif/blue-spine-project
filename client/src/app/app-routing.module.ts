import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'reconciliation', pathMatch: 'full' },
  {
    path: 'reconciliation',
    loadChildren: () =>
      import('./features/reconciliation/reconciliation.module').then((m) => m.ReconciliationModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
