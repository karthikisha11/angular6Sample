import { State, Action, StateContext, Selector } from "@ngxs/store";
import { map, catchError } from "rxjs/operators";
import { Program } from "../../models/program.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FetchPrograms } from "./program.actions";
import {
  SubmitForm,
  DisableNotification,
  SetForm,
  ResetForm,
  SUCCESS_NOTIFICATION,
  FAILURE_NOTIFICATION
} from "../../sdk/features/master-form/master-form.actions";
import {
   addResponse,
   ProgramService,
   fetchResponse,
   updateResponse
} from "../../services/api/program.service";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ProgramFormCreator } from "../../modules/program/add-program/program.form";

type NgxsForm = {
  model: Program;
  dirty: boolean;
  status: string;
  errors: Object;
};
export const formIdProgram = "ADD-EDIT-PROGRAMS";
export const formRouteProgram = "/program/add-program";
export const formCloseNavigationRouteProgram = "/program";

export class ProgramStateModel {
  programs: Program[];
  submittingForm: boolean;
  formSubmitted: boolean;
  submitSuccess: boolean;
  notificationMessage: string;
  showNotification: string;
  totalRecords: number;
  isFetching: boolean;
  programForm: NgxsForm;
}
const emptyProgramForm: NgxsForm = {
  model: new Program(), // Contains the form Object in model
  dirty: false,
  status: "",
  errors: {}
};

export const defaultProgramState = {
  programs: [],
  submittingForm: false,
  formSubmitted: false,
  submitSuccess: false,
  notificationMessage: "",
  showNotification: null,
  totalRecords: 0,
  isFetching: false,
  programForm: emptyProgramForm
};



@State<ProgramStateModel>({
  name: "Programs",
  defaults: defaultProgramState
})
export class ProgramState {
  public constructor(
    private programService: ProgramService,
    private programFormCreator: ProgramFormCreator
  ) {}
  @Selector()
  static state(state: ProgramStateModel): ProgramStateModel {
    return state;
  }
  @Selector()
  static Programs(state: ProgramStateModel) {
    return state.programs;
  }
  @Selector()
  static totalRecords(state: ProgramStateModel) {
    return state.totalRecords;
  }
  @Selector()
  static isFetching(state: ProgramStateModel) {
    return state.isFetching;
  }

  @Action(FetchPrograms)
  fetchPrograms(
    { getState, patchState, setState }: StateContext<ProgramStateModel>,
    { searchParams }: FetchPrograms
  ) {
    let state = getState();
    patchState({
      isFetching: true
    });
    this.programService
      .fetchPrograms(searchParams)
      .subscribe((res: HttpResponse<any>) => {
        if (res.ok) {
          setState({
            ...state,
            programs: res.body,
            totalRecords: parseInt(res.headers.get('X-Total-Count'), 10),
            isFetching: false
          });
        } else {
          patchState({
            isFetching: false
          });
        }
      });
  }


  @Action(SubmitForm)
  submitProgramForm(
    { getState, patchState, setState }: StateContext<ProgramStateModel>,
    { formId }: SubmitForm
  ) {
    if (formId === formIdProgram) {
      const state = getState();
      patchState({ submittingForm: true });
      const program = state.programForm.model;
      const programId = program.id;
      if (programId === "NEW") {
        const { id, ...newProgram } = program;
          this.programService
          .createProgram(newProgram)
          .subscribe((res: HttpResponse<any>) => {
            processFormSubmitResponse(res);
          });
        }
         else {
        this.programService
        .updateProgram(program)
          .subscribe((res: HttpResponse<any>) => {
            processFormSubmitResponse(res);
          });
        }
        const processFormSubmitResponse = res => {
          if (res.ok) {
            const notificationMessage = res.message ? res.message : 'Form submission successful!';
            patchState({
              submittingForm: false,
              formSubmitted: true,
              submitSuccess: true,
              notificationMessage,
              showNotification: SUCCESS_NOTIFICATION,
            });
          } else {
            patchState({
              submittingForm: false,
              formSubmitted: false,
              submitSuccess: false,
              notificationMessage: res.message,
              showNotification: FAILURE_NOTIFICATION
            });
          }
        };
      }
    }

  @Action(DisableNotification)
  disableNotification({ patchState }: StateContext<ProgramStateModel>, {formId}: DisableNotification) {
    if(formId === formIdProgram) {
      patchState({ showNotification: null, notificationMessage: '' });
    }
  }

  @Action(SetForm)
  setForm(
    { getState, setState }: StateContext<ProgramStateModel>,
    { formId, recordId }: SetForm
  ) {
    if (formId === formIdProgram) {
      const state = getState();
      let program: Program = new Program();
      if (recordId !== "NEW") {
        program = state.programs.find(p => p.id === recordId);
        // Generating the form from the FormCreator Service
        let programForm = this.programFormCreator.generateProgramForm(program);
        program = programForm.value;
      }
      setState({
        ...state,
        programForm: { ...state.programForm, model: program }
      });
    }
  }

  @Action(ResetForm)
  RestProgramForm(
    { getState, setState }: StateContext<ProgramStateModel>,
    { formId }: ResetForm
  ) {
    if (formId === formIdProgram) {
      const state = getState();
      setState({
        ...state,
        formSubmitted: false,
        submitSuccess: false,
        submittingForm: false,
        programForm: emptyProgramForm
      });
    }
  }
}
