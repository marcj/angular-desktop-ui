import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StaticDocComponent} from './components/static-doc.component';

const routes: Routes = [
    {path: '', redirectTo: 'doc/start', pathMatch: 'full'},
    {path: 'doc/:id', component: StaticDocComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
