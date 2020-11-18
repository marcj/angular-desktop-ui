import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MarkdownDocComponent} from './components/doc.module';

const routes: Routes = [
    {path: '', redirectTo: 'doc/welcome', pathMatch: 'full'},
    {path: 'doc/:id', component: MarkdownDocComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
