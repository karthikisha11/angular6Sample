import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { AgGridModule } from "ag-grid-angular";
//import { PendingChangesGuard } from "./components/add-contact/can-deactivate.guard";
import { ProgramComponent } from './program/program.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { TableModule } from "./../../sdk/features/table/table.module";
import { ProgramRoutingModule } from "./program.routing";
import { FormFieldsComponent } from './form-fields/form-fields.component';
import { MessageService } from "primeng/api";
import { MasterFormModule } from "./../../sdk/features/master-form/master-form.module";
import { StylingModule } from '../../shared/styling.imports';

@NgModule({
  declarations: [ProgramComponent, AddProgramComponent,FormFieldsComponent],
  imports: [
    ProgramRoutingModule,
    CommonModule,
    StylingModule,
    MasterFormModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    TableModule
  ],
    providers: [MessageService]
})

export class ProgramModule { }
