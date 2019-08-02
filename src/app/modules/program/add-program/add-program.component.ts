import { Component, OnInit, HostListener } from "@angular/core";
import { Observable } from "rxjs";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Store, Select } from "@ngxs/store";
import { Program } from "./../../../models/program.model";
import { ComponentCanDeactivate } from "./can-deactivate.guard";
import {
  ProgramState,
  ProgramStateModel,
  defaultProgramState,
  formIdProgram
} from "./../../../state/program/program.state";
import { ProgramFormCreator } from "./program.form";
import { MasterFormService } from "./../../../sdk/features/master-form/services/master-form.service";
import { SubmitForm } from "./../../../sdk/features/master-form/master-form.actions";

export const formRouteProgram = "/programs/add-edit";
export const formCloseNavigationRouteProgram = "/programs";
export const formTitle = "Program Information";

@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit {
  formId: string = formIdProgram;
  formTitle: string = formTitle;
  formCloseNavigationRoute: string = formCloseNavigationRouteProgram;
  ProgramForm: FormGroup = this.programFormCreator.generateProgramForm(
    new Program()
  );
  submittingForm: boolean = false;
  formSubmitted: boolean = false;
  showNotification: string;
  notificationMessage: string;
  //recordId: number | "NEW";
  constructor(private programFormCreator: ProgramFormCreator) {

   }

  ngOnInit() {
  }

}
