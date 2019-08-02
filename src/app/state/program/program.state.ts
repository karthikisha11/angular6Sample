import { State, Action, StateContext, Selector } from "@ngxs/store";
import { map, catchError } from "rxjs/operators";
import { Program } from "../../models/program.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
//import { FetchContacts } from "./contacts.actions";
import {
  SubmitForm,
  DisableNotification,
  SetForm,
  ResetForm,
  SUCCESS_NOTIFICATION,
  FAILURE_NOTIFICATION
} from "../../sdk/features/master-form/master-form.actions";
/*import {
  ContactsService,
  fetchResponse,
  addResponse,
  updateResponse
} from "../../services/api/contacts.service";*/
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ProgramFormCreator } from "../../modules/program/add-program/program.form";

type NgxsForm = {
  model: Program;
  dirty: boolean;
  status: string;
  errors: Object;
};
export const formIdProgram = "ADD-EDIT-PROGRAM";
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
  cForm: NgxsForm;
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

/*@State<ProgramStateModel>({
  name: "Programs",
  defaults: defaultProgramState
})*/
export class ProgramState {
  public constructor(
    //private contactsService: ContactsService,
    private contactFormCreator: ProgramFormCreator
  ) {}
  /*@Selector()
  static state(state: ContactStateModel): ContactStateModel {
    return state;
  }
  @Selector()
  static contacts(state: ContactStateModel) {
    return state.contacts;
  }
  @Selector()
  static totalRecords(state: ContactStateModel) {
    return state.totalRecords;
  }
  @Selector()
  static isFetching(state: ContactStateModel) {
    return state.isFetching;
  }

  /*@Action(FetchContacts)
  fetchContacts(
    { getState, patchState, setState }: StateContext<ContactStateModel>,
    { searchParams }: FetchContacts
  ) {
    let state = getState();
    patchState({
      isFetching: true
    });
    this.contactsService
      .fetchContacts(searchParams)
      .subscribe((res: HttpResponse<any>) => {
        if (res.ok) {
          setState({
            ...state,
            contacts: res.body,
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
  submitContactForm(
    { getState, patchState, setState }: StateContext<ContactStateModel>,
    { formId }: SubmitForm
  ) {
    if (formId === formIdContact) {
      const state = getState();
      patchState({ submittingForm: true });
      const contact = state.contactForm.model;
      const contactId = contact.id;
      if (contactId === "NEW") {
        const { id, ...newContact } = contact;
        this.contactsService
          .createContact(newContact)
          .subscribe((res: HttpResponse<any>) => {
            processFormSubmitResponse(res);
          });
        } else {
        this.contactsService
        .updateContact(contact)
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
  disableNotification({ patchState }: StateContext<ContactStateModel>, {formId}: DisableNotification) {
    if(formId === formIdContact) {
      patchState({ showNotification: null, notificationMessage: '' });
    }
  }

  @Action(SetForm)
  setForm(
    { getState, setState }: StateContext<ContactStateModel>,
    { formId, recordId }: SetForm
  ) {
    if (formId === formIdContact) {
      const state = getState();
      let contact: Contact = new Contact();
      if (recordId !== "NEW") {
        contact = state.contacts.find(p => p.id === recordId);
        // Generating the form from the FormCreator Service
        let contactForm = this.contactFormCreator.generateContactForm(contact);
        contact = contactForm.value;
      }
      setState({
        ...state,
        contactForm: { ...state.contactForm, model: contact }
      });
    }
  }

  @Action(ResetForm)
  RestContactForm(
    { getState, setState }: StateContext<ContactStateModel>,
    { formId }: ResetForm
  ) {
    if (formId === formIdContact) {
      const state = getState();
      setState({
        ...state,
        formSubmitted: false,
        submitSuccess: false,
        submittingForm: false,
        contactForm: emptyContactForm
      });
    }
  }*/
}
