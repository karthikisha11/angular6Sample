import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './program/program.component';
import { AddProgramComponent } from './add-program/add-program.component';

const routes: Routes = [
  {
    path: "program-list",
    component: ProgramComponent
  },
  {
    path: "add-program",
    component: AddProgramComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProgramRoutingModule { }
