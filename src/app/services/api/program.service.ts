import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { makeUrl, pendpoints } from "./../../sdk/config/api.config";
import { Program } from "./../../models/program.model";

@Injectable({
  providedIn: "root"
})
export class ProgramService {
  constructor(private http: HttpClient) {
  }

  fetchPrograms(searchParams) {
    // ?_page=7&_limit=20
    console.log('test123');
    console.log(makeUrl(pendpoints.programs.fetch));
    const url =
      makeUrl(pendpoints.programs.fetch) +
      `?_page=${searchParams.pageNumber}&_limit=${
        searchParams.pageSize
      }&_sort=${searchParams.sortField}&_order=${searchParams.sortOrder}&q=${searchParams.searchQuery}`;

    return this.http
      .get(url, { observe: "response" })
      .pipe(catchError((err, caught) => of(err)));
  }

  createProgram(programData: Program) {

    let url = makeUrl(pendpoints.programs.fetch);
    return this.http
      .post(url, programData, { observe: "response" })
      .pipe(catchError((err, caught) => of(err)));
  }

  updateProgram(programData: Program) {
    let url = makeUrl(pendpoints.programs.fetch) + `/${programData.id}`;
    return this.http.put(url, programData, { observe: "response" }).pipe(
      catchError((err, caught) => {
        return of(err);
      })
    );
   }
}

export class SearchParams {
  searchQuery: string = "";
  pageNumber: number = 1;
  pageSize: number = 50;
  sortField: string = "id";
  sortOrder: string = "DESC";
  activeStatusFilter: string = "ACTIVE";
  filter: any = null;
  id: number | null = null;
  ownerId: number | null = null;
  dontSendPhoto: boolean = false;
}

export interface fetchResponse {
  totalRecords?: number;
  programs?: Program[];
  ok: boolean;
  message: string;
}

export interface addResponse {
  message: string;
  id?: number;
  code?: number;
  detailedMessage?: string;
}

export interface updateResponse {
  message: string;
  id?: number;
  code?: number;
  detailedMessage?: string;
}
