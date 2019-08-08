import { State, Action, StateContext, Selector } from "@ngxs/store";
import { map, catchError } from "rxjs/operators";
import { Contact } from "./../../models/contact.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FetchContacts } from "./contacts.actions";
import {
  SubmitForm,
  DisableNotification,
  SetForm,
  ResetForm,
  SUCCESS_NOTIFICATION,
  FAILURE_NOTIFICATION
} from "./../../sdk/features/master-form/master-form.actions";
import {
  ContactsService,
  fetchResponse,
  addResponse,
  updateResponse
} from "./../../services/api/contacts.service";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ContactFormCreator } from "../../modules/contacts/components/add-contact/contact.form";

type NgxsForm = {
  model: Contact;
  dirty: boolean;
  status: string;
  errors: Object;
};
export const formIdContact = "ADD-EDIT-PROGRAM";
export const formRouteContact = "/contacts/add-edit";
export const formCloseNavigationRouteContact = "/contacts";

export class ContactStateModel {
  contacts: Contact[];
  submittingForm: boolean;
  formSubmitted: boolean;
  submitSuccess: boolean;
  notificationMessage: string;
  showNotification: string;
  totalRecords: number;
  isFetching: boolean;
  contactForm: NgxsForm;
}
const emptyContactForm: NgxsForm = {
  model: new Contact(), // Contains the form Object in model
  dirty: false,
  status: "",
  errors: {}
};

export const defaultContactState = {
  contacts: [],
  submittingForm: false,
  formSubmitted: false,
  submitSuccess: false,
  notificationMessage: "",
  showNotification: null,
  totalRecords: 0,
  isFetching: false,
  contactForm: emptyContactForm
};

@State<ContactStateModel>({
  name: "Contacts",
  defaults: defaultContactState
})
export class ContactState {
  public constructor(
    private contactsService: ContactsService,
    private contactFormCreator: ContactFormCreator
  ) {}
  @Selector()
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

  @Action(FetchContacts)
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
      console.log('formIdContact coming');
    console.log(formIdContact);
    if (formId === formIdContact) {
      const state = getState();
      console.log("state");
      console.log(state);
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
  }
}
