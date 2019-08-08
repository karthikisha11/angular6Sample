import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './program/program.component';
import { AddProgramComponent } from './add-program/add-program.component';
import {PendingChangesGuard} from '../program/add-program/can-deactivate.guard';

const routes: Routes = [
  {
    path: "",
    component: ProgramComponent
  },
  {
    path: "add-program",
    component: AddProgramComponent,
    canDeactivate: [PendingChangesGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProgramRoutingModule { }
