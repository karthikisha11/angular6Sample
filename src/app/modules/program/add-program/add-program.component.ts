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
import {
  ProgramService
} from "./../../../services/api/program.service";
import { ProgramFormCreator } from "./program.form";
import { MasterFormService } from "./../../../sdk/features/master-form/services/master-form.service";
import { SubmitForm } from "./../../../sdk/features/master-form/master-form.actions";
//import { ConstantParsingService } from "./../../../services/constant-parsing.service";

export const formRouteProgram = "/program/add-edit";
export const formCloseNavigationRouteProgram = "/program";
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
  programForm: FormGroup = this.programFormCreator.generateProgramForm(
    new Program()
  );
  @Select(ProgramState.state) programState$: Observable<ProgramStateModel>;
  programState: ProgramStateModel = new ProgramStateModel();
  submittingForm: boolean = false;
  formSubmitted: boolean = false;
  showNotification: string;
  recordId: number | "NEW";
  editingProgramForm: Program;
  notificationMessage: string;

  formCanClose(): boolean {
    return this.masterFormService.formCanClose(
      this.programForm,
      this.formSubmitted
    );
  }
  ngOnInit() {
  }
  constructor(
    public router: Router,
    private messageService: MessageService,
    private programService: ProgramService,
    private store: Store,
    private masterFormService: MasterFormService,
    private programFormCreator: ProgramFormCreator
  ) {
      this.programState$.subscribe(latestState => {
      this.editingProgramForm = latestState.programForm.model;
      this.submittingForm = latestState.submittingForm;
      this.formSubmitted = latestState.formSubmitted;
      this.recordId = this.editingProgramForm.id;
      this.showNotification = latestState.showNotification;
      this.notificationMessage = latestState.notificationMessage;
      this.programState = latestState;
    });
    this.programForm = this.programFormCreator.generateProgramForm(
      this.editingProgramForm
    );
  }

  submitForm() {
    this.masterFormService.submitForm(this.programForm, this.formId);

  }
  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener("window:beforeunload")
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return this.formCanClose();
  }

}
