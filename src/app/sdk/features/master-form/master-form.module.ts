import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective
} from "@angular/forms";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { PendingChangesGuard } from "./services/can-deactivate.guard";
import { MasterFormStylingModule } from "./master-form.styling.imports";
import { MasterFormComponent } from "./components/master-form.component";
import { FormNotification } from "./form-notifications/notification.service";
import { FormCloseChecker } from "./services/form-close-checker.service";

@NgModule({
  declarations: [MasterFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsFormPluginModule.forRoot(),
    MasterFormStylingModule
  ],
  exports: [MasterFormComponent],
  providers: [
    FormGroupDirective,
    PendingChangesGuard,
    FormNotification,
    FormCloseChecker
  ]
})
export class MasterFormModule {}